import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { Iuser, UserRole, UserStatus } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import UserOauthIdNotFoundException from 'src/auth/exception/UserOauthIdNotFound.exception';
import { LogoutUserDto } from 'src/user/model/dto/logout-user.dt';

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
			newUser.level = 0;
			newUser.defeat = 0;
			newUser.victory = 0;
			newUser.twoFactorAuthEnabled = false;
			newUser.picture = "profile-picture.png";
			const user = await this.userRepository.save(this.userRepository.create(newUser));
			//if (user.id == 0) {
			//user.role = UserRole.OWNER;
			//await this.userRepository.save(user);
			//}
			return this.findOne(user.id);
		} else {
			throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
		}
		} catch {
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
					if (payload.ban)
						throw new HttpException('User banned', HttpStatus.UNAUTHORIZED);
					const jwt: string = await this.authService.generateJwt(payload);
					this.updateStatusOfUser(payload.id, {"status": UserStatus.ON});
					return {
						jwt,
						payload,
						};
				} else {
					throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
				}
			} else {
				throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
			}
		} catch {
		throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
	}

	async logout(user:Iuser): Promise<any> {
		this.updateStatusOfUser(user.id, {"status": UserStatus.OFF});
	}

	async findAll(options: IPaginationOptions): Promise<Pagination<Iuser>> {
		return paginate<UserEntity>(this.userRepository, options);
	}

	async findAllByUsername(username: string): Promise<Iuser[]> {
		return this.userRepository.find({
			where: {
				username: Like(`%${username.toLowerCase()}%`)
			}
		})
	}

	async findAllByLevel(): Promise<Iuser[]> {
		return this.userRepository.find({
			order: {
				level: "DESC"
			}
		})
	}

	async findOne(id: number): Promise<Iuser> {
		return this.userRepository.findOne({ id });
	}

	async updateOne(id: number, user: Iuser): Promise<any> {
		//delete user.email;
		delete user.password;
		delete user.role;
		
		return from(this.userRepository.update(id, user)).pipe(
			switchMap(() => this.findOne(id))
			);
	}

    async  updateUserRole(id: number, user: Iuser): Promise<any> {
		const temp = await this.userRepository.findOne({
			where: {
			  id: id,
			},
		});
		if (temp.role == UserRole.OWNER) throw new HttpException('Can\'t change the Owner role...', HttpStatus.CONFLICT);
		if (user.role == UserRole.OWNER) throw new HttpException('Can\'t have 2 owner', HttpStatus.CONFLICT);
		return from(this.userRepository.update(id, user)).pipe(
			switchMap(() => this.findOne(id))
		);
    }

    async updateBanOfUser(id: number, user: Iuser): Promise<any> {
		const temp = await this.userRepository.findOne({
			where: {
			  id: id,
			},
		});		
		if (temp.role == UserRole.OWNER) throw new HttpException('You can\'t ban Owner...', HttpStatus.CONFLICT);
		return from(this.userRepository.update(id, user)).pipe(
			switchMap(() => this.findOne(id))
		);
    }

    updateStatusOfUser(id: number, user: Iuser): Observable<any> {
      	return from(this.userRepository.update(id, user))
    }

	updateOneOb(id: number, user: Iuser): Observable<any> {
		delete user.email;
		delete user.password;
		
		return from(this.userRepository.update(id, user)).pipe(
			switchMap(() => this.findOne(id))
		);
	}

	private async findByEmail(email: string): Promise<Iuser> {
		return this.userRepository.findOne({ email }, { select: ['id', 'email', 'username', 'password'] });
	}

	private async hashPassword(password: string): Promise<string> {
		return this.authService.hashPassword(password);
	}

	private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
		return this.authService.comparePasswords(password, storedPasswordHash);
	}

	public getOne(id: number): Promise<Iuser> {
		return this.userRepository.findOneOrFail({ id });
	}

	private async mailExists(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ email });
		if (user)
			return true;
		return false;
	}

	async setTwoFactorAuthenticationSecret(secret: string, Iuserid: number) {
		return this.userRepository.update(Iuserid, {
		twoFactorAuthenticationSecret: secret
		});
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


}
