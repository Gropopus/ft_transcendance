import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ChannelEntity } from 'src/chat/model/channel.entity';
import { Ichannel, ChannelType } from 'src/chat/model/channel.interface';
import { Iuser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { MessageService } from './service/message.service';

@Injectable()
export class ChannelService {
	constructor(
	@InjectRepository(ChannelEntity)
		private readonly channelRepository: Repository<ChannelEntity>,
		private authService: AuthService,
		private messageService: MessageService,
		private userService: UserService,
	) { }

	async createChannel(channel: Ichannel, creator: Iuser): Promise<Ichannel> {
		if (channel.password !) {
			channel.type = ChannelType.PROTECTED;
			const passwordHash: string = await this.hashPassword(channel.password);
			channel.password = passwordHash;
		}
		channel.owner = creator;
		const newChannel = await this.addCreatorToChannel(channel, creator);
		return await this.addAdminToChannel(newChannel, creator);
	}

	async newDirectMessage(user1: Iuser, user2: Iuser): Promise<Ichannel> {
		let channel: Ichannel = {
			name: 'none',
			users: [user2],
			type: ChannelType.DIRECT,
			admin: [user2],
			password: "",

		};
		channel.owner = user1;
		const newChannel = await this.addCreatorToChannel(channel, user1);
		return await this.channelRepository.save(newChannel);
	}

	async getDirectMessage(userId: number, options: IPaginationOptions): Promise<Pagination<Ichannel>> {
		const query = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.users', 'users')
			.where('users.id = :userId', { userId })
			.andWhere('channel.type = :t', {t: ChannelType.DIRECT});
		return paginate(query, options);
	}

	async getOneDirectMessage(userId1: number, userId2: number, options: IPaginationOptions): Promise<Pagination<Ichannel>> {
		const query = this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.users', 'users1')
			.leftJoinAndSelect('channel.users', 'users2')
			.where('users1.id = :userId1', { userId1: userId1 })
			.andWhere('users2.id = :userId2', { userId2: userId2 })
			.andWhere('channel.type = :t', {t: ChannelType.DIRECT});

		return paginate(query, options);
	}


	async changePasswordChannel(channel: Ichannel, newPassword: string): Promise<Ichannel> {
		if (newPassword) {
			const passwordHash: string = await this.hashPassword(newPassword);
			channel.password = passwordHash;
		}
		return await this.channelRepository.save(channel);
	}

	async changeTypeChannel(channel: Ichannel, newType: ChannelType): Promise<Ichannel> {
		channel.type = newType;
		return await this.channelRepository.save(channel);
	}

	async getChannel(channelId: number): Promise<Ichannel> {
		return await this.channelRepository.findOne({
			relations: ['users', 'owner', 'admin', 'muted', 'ban'],
			select: ['id', 'name', 'type', 'password'],
			where: { 'id': channelId },
		});
	}

	async saveChannel(channel: Ichannel): Promise<Ichannel> {
	return await this.channelRepository.save(channel);
	}

	async getAllChannelAdmin(options: IPaginationOptions): Promise<Pagination<Ichannel>> {
		const query = this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.admin', 'all_admin')
			.leftJoinAndSelect('channel.muted', 'all_muted')
			.leftJoinAndSelect('channel.ban', 'all_ban')
			.leftJoinAndSelect('channel.owner', 'onwner')
			.orderBy('channel.updated_at', 'DESC');

		return paginate(query, options);
	}

	async getChannelInfo(channelId: number, options: IPaginationOptions): Promise<Pagination<Ichannel>> {
		const query = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.admin', 'all_admin')
			.leftJoinAndSelect('channel.muted', 'all_muted')
			.leftJoinAndSelect('channel.ban', 'all_ban')
			.leftJoinAndSelect('channel.owner', 'onwner')
			.where('channel.id = :id', { id: channelId })
			.orderBy('channel.updated_at', 'DESC');
		return paginate(query, options);
	}

	async getChannelsForUser(Iuserid: number, options: IPaginationOptions): Promise<Pagination<Ichannel>> {
		const query = this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.admin', 'admin')
			.leftJoinAndSelect('channel.muted', 'muted')
			.leftJoinAndSelect('channel.owner', 'owner')
			.leftJoinAndSelect('channel.ban', 'ban')
			.where('users.id = :id', { id: Iuserid })
			.andWhere('channel.type != :type', { type: ChannelType.CLOSE })
			.orderBy('channel.updated_at', 'DESC');

		return paginate(query, options);
	}

	async getAllChannel(options: IPaginationOptions): Promise<Pagination<Ichannel>> {
	const query = this.channelRepository
		.createQueryBuilder('channel')
		.where('channel.type != :p', { p: ChannelType.PRIVATE })
		.andWhere('channel.type != :c', { c: ChannelType.CLOSE })
		.andWhere('channel.type != :d', { d: ChannelType.DIRECT })
		.orderBy('channel.updated_at', 'DESC');

	return paginate(query, options);
	}

	async addUserToChannel(channelId: number, user: Iuser, password: string, isAdd: number): Promise<Observable<{ error: string } | { success: string }>> {
		const channel = await this.getChannel(channelId);
	const bool: number = await this.boolIusersOnChannel(user.id, channel);
	if (bool) return of({ error: 'Already on the channel;' });
	if (channel.type == ChannelType.CLOSE) return of({ error: 'Can\'t join channel closed;' }); 
	if (channel.type == ChannelType.PUBLIC || isAdd == 1) {
		channel.users.push(user);
		await this.channelRepository.save(channel);
		return of({ success: 'Channel joined;' });
	}
	if (channel.type == ChannelType.PROTECTED) {
		const matches: boolean = await this.validatePassword(password, channel.password);
		if (matches) {
			channel.users.push(user);
			await this.channelRepository.save(channel);
			return of({ success: 'Channel joined;' });
		}
		return of({ error: 'Bad password;' }); 
	}
	if (channel.type == ChannelType.PRIVATE)
	{
		channel.users.push(user);
		await this.channelRepository.save(channel);
			return of({ success: 'Channel joined;' });
	}
	}

	async addCreatorToChannel(channel: Ichannel, creator: Iuser): Promise<Ichannel> {
	channel.users.push(creator);
	return channel;
	}

	async addAdminToChannel(channel: Ichannel, user: Iuser): Promise<Ichannel> {
		channel.admin.push(user);
		return await this.channelRepository.save(channel);
	}

	async muteUser(channel: Ichannel, user: Iuser): Promise<Ichannel> {
		channel.muted.push(user);
		return await this.channelRepository.save(channel);
	}

	async banUser(channel: Ichannel, user: Iuser): Promise<Ichannel> {
		channel.ban.push(user);
		return await this.channelRepository.save(channel);
	}

	async unbanUser(channelId: number, Iuserid: number): Promise<Ichannel> {
		const channel = await this.getChannel(channelId);
		channel.ban = channel.ban.filter(user => user.id != Iuserid);
		return await this.channelRepository.save(channel);
		}

	private async hashPassword(password: string): Promise<string> {
		return await this.authService.hashPassword(password);
	}

	private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
		return await this.authService.comparePasswords(password, storedPasswordHash);
	}

	async deleteAUserFromChannel(channelId: number, Iuserid: number): Promise<Ichannel> {
		const channel = await this.getChannel(channelId);

		if (channel.owner.id === Iuserid) {
			this.messageService.deleteAllMessagesForChannel(channel);
			channel.type = ChannelType.CLOSE;
			return await this.channelRepository.save(channel);
		}
		channel.users = channel.users.filter(user => user.id != Iuserid);
		channel.admin = channel.admin.filter(user => user.id != Iuserid);	

		return await this.channelRepository.save(channel);
	}

	async deleteAUserMutedFromChannel(channelId: number, Iuserid: number): Promise<Ichannel> {
		const channel = await this.getChannel(channelId);
		channel.muted = channel.muted.filter(user => user.id != Iuserid);
		return await this.channelRepository.save(channel);
	}

	async deleteAUserAdminFromChannel(channelId: number, Iuserid: number): Promise<Ichannel> {
		const channel = await this.getChannel(channelId);
		channel.admin = channel.admin.filter(user => user.id != Iuserid);

		return await this.channelRepository.save(channel);
	}

	async boolUserMutedOnChannel(Iuserid: number, channel_id: number): Promise<number> {
		const query = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.muted', 'muted')
			.where('muted.id = :Iuserid', { Iuserid })
			.andWhere("channel.id = :rid", { rid: channel_id })
			.getCount();
		return  (query);
	}

	async boolUserBanedOnChannel(Iuserid: number, channel_id: number): Promise<number> {
		const query = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.ban', 'ban')
			.where('ban.id = :Iuserid', { Iuserid })
			.andWhere("channel.id = :rid", { rid: channel_id })
			.getCount();
		return  (query);
	}

	async boolIusersOnChannel(Iuserid: number, channel: Ichannel): Promise<number> {
		const query = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.users', 'users')
			.where('users.id = :Iuserid', { Iuserid })
			.andWhere("channel.id = :rid", { rid: channel.id })
			.getCount();
		return  (query);
	}

	async boolIusersAdminOnChannel(Iuserid: number, channel: Ichannel): Promise<number> {
		const query = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.admin', 'admin')
			.where('admin.id = :Iuserid', { Iuserid })
			.andWhere("channel.id = :rid", { rid: channel.id })
			.getCount();
		return  (query);
	}

	async findOne(channelId: number): Promise<Ichannel> {
		return await this.channelRepository.findOne({where: { 'id': channelId }});
	}

	async deleteChannel(channelId: number): Promise<any> {
		return await this.channelRepository.delete({ id: channelId });
	}
}
