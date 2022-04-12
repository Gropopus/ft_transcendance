import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { Iuser, UserStatus } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import UserOauthIdNotFoundException from 'src/auth/exception/UserOauthIdNotFound.exception';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private authService: AuthService
	) { }

	async create(newUser: Iuser): Promise<Iuser> {
		try {
			const exists: boolean = await this.mailExists(newUser.email);
			if (!exists) {
				const passwordHash: string = await this.hashPassword(newUser.password);
				newUser.password = passwordHash;
				newUser.level = 1000;
				newUser.defeat = 0;
				newUser.victory = 0;
				newUser.twoFactorAuthEnabled = false;
				newUser.picture = "profile-picture.png";
				const user = await this.userRepository.save(this.userRepository.create(newUser));
				return this.findOne(user.id);
			} else {
				throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
			}
		}
		catch {
			throw new HttpException('Email or username is already in use', HttpStatus.CONFLICT);
		}
	}

	async login(user: Iuser): Promise<any> {
		try {
			const foundUser: Iuser = await this.findByEmail(user.email.toLowerCase());
			if (foundUser) {
				const matches: boolean = await this.validatePassword(user.password, foundUser.password);
				if (matches) {
					const payload: Iuser = await this.findOne(foundUser.id);
					const jwt: string = await this.authService.generateJwt(payload);
					this.updateLastTaskTime(payload.id);
					this.userRepository.update(payload.id, {status: UserStatus.ON});
					return {
						jwt,
						payload,
					};
				}
				else {
					throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
				}
			}
			else {
				throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
			}
		}
		catch {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
	}

	async logout(user:Iuser): Promise<any> {
		this.userRepository.update(user.id, {status: UserStatus.OFF});
	}

	async findAll(options: IPaginationOptions): Promise<Pagination<Iuser>> {
		return paginate<UserEntity>(this.userRepository, options);
	}

	async findAllByUsername(username: string): Promise<Iuser> {
			return this.userRepository.findOne({
			where: {
				username: username
			}
		})
	}

	async searchUser(key: string): Promise<Iuser[]> {
		return this.userRepository.find({
			where: {
				username: Like(`%${key.toLowerCase()}%`)
			}
		})
	}

	async findOneByEmail(email: string): Promise<Iuser> {
		return this.userRepository.findOne({
			where: {
				email: Like(`%${email.toLowerCase()}%`)
			}
		})
	}

	async findOne(id: number): Promise<Iuser> {
		return this.userRepository.findOne({ where: { id: id }});
	}

	async updateUser(id: number, user: Iuser)
	{
		if (user.password)
			user.password = await this.authService.hashPassword(user.password);
		return this.userRepository.update(id, user);
	}

	async updateOne(id: number, user: Iuser): Promise<any> {
		delete user.password;
		
		return from(this.userRepository.update(id, user)).pipe(
			switchMap(() => this.findOne(id))
			);
	}

	updateOneOb(id: number, user: Iuser): Observable<any> {
		delete user.email;
		delete user.password;
		
		return from(this.userRepository.update(id, user)).pipe(
			switchMap(() => this.findOne(id))
		);
	}

	private async findByEmail(email: string): Promise<Iuser> {
		return this.userRepository.findOne({ where: { email: email }, select: ['id', 'email', 'username', 'password'] });
	}

	private async hashPassword(password: string): Promise<string> {
		return this.authService.hashPassword(password);
	}

	private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
		return this.authService.comparePasswords(password, storedPasswordHash);
	}

	public getOne(id: number): Promise<Iuser> {
		return this.userRepository.findOneOrFail({ where: { id: id }});
	}

	private async mailExists(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { email: email }});
		if (user)
			return true;
		return false;
	}

	async setTwoFactorAuthenticationSecret(secret: string, Iuserid: number) {
		this.userRepository.update(Iuserid, {
		twoFactorAuthenticationSecret: secret
		});
		return;
	}

	async turnOnTwoFactorAuthentication(Iuserid: number) {
		return this.userRepository.update(Iuserid, {
			twoFactorAuthEnabled: true
		});
	}

	async turnOffTwoFactorAuthentication(Iuserid: number) {
		return this.userRepository.update(Iuserid, {
			twoFactorAuthEnabled: false
		});
  	}

	async getUserByid42(id: number): Promise<Iuser> {
		const user = await this.userRepository.findOne({
		where: {
			id42: id,
		},
		});
		if (user) return user;
		else throw new UserOauthIdNotFoundException(id);
	}

	async updateStat(userId: number, isWinner: boolean) {
		if (isWinner)
			await this.userRepository.increment({id: userId}, "victory", 1);
		else 
			await this.userRepository.increment({id: userId}, "defeat", 1);
		this.userRepository.update(userId, {status: UserStatus.ON});
	}

	async getLadderLevel(userId: number) {
		const ladder = await this.userRepository.find({
			select: ["id"],
			order: {
				level: "DESC"
			},
		});
		for (let i = 0; i < ladder.length; i++)
			if (userId == ladder[i].id)
				return {level: i + 1, total: ladder.length};
	}

	async setStatus(user: Iuser, newStatus: UserStatus) {
		this.userRepository.update(user.id, {status: newStatus});
	}

	async updateLastTaskTime(id: number) {
		this.userRepository.update(id, {status: UserStatus.ON});
		const currentTime = Math.floor(Date.now() / 1000);
		return await this.userRepository.update(id, {lastTask: currentTime});
	}

	async handleUserConnection() {
		const currentTime = Math.floor(Date.now() / 1000);
		const connectUsers = await this.userRepository.find({
			select: ['id', 'lastTask'],
			where: {status: UserStatus.ON},
		})
		for (let user of connectUsers)
			if (currentTime - user.lastTask > 3 * 60) // 3min
				this.userRepository.update(user.id, {status: UserStatus.OFF});
	}

}
