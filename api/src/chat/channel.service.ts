import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ChannelEntity } from 'src/chat/model/channel.entity';
import { Ichannel, ChannelType } from 'src/chat/model/channel.interface';
import { Iuser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/user.service';
import { Repository, getConnection } from 'typeorm';
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
	if (channel.password) {
		channel.type = ChannelType.PROTECTED;
		const passwordHash: string = await this.hashPassword(channel.password);
		channel.password = passwordHash;
	}
	channel.owner = creator;
    const newChannel = await this.addCreatorToChannel(channel, creator);
    const newChannelAdmin = await this.addAdminToChannel(newChannel, creator);
	return this.channelRepository.save(newChannelAdmin);
  }

  async changePasswordChannel(channel: Ichannel, newPassword: string): Promise<Ichannel> {
	  if (newPassword) {
		const passwordHash: string = await this.hashPassword(newPassword);
		channel.password = passwordHash;
	}
    return this.channelRepository.save(channel);
  }

  async changeTypeChannel(channel: Ichannel, newType: ChannelType): Promise<Ichannel> {
	channel.type = newType;
    return this.channelRepository.save(channel);
  }

  async getChannel(channelId: number): Promise<Ichannel> {
    return this.channelRepository.findOne(channelId, {
      relations: ['users', 'owner', 'admin', 'muted'],
	  select: ['id', 'name', 'type', 'password']
    });
  }

  async saveChannel(channel: Ichannel): Promise<Ichannel> {
	return this.channelRepository.save(channel);
  }
  
  async getAllChannelAdmin(options: IPaginationOptions): Promise<Pagination<Ichannel>> {
    const query = this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .leftJoinAndSelect('channel.admin', 'all_admin')
      .leftJoinAndSelect('channel.muted', 'all_muted')
      .leftJoinAndSelect('channel.owner', 'onwner')
      .orderBy('channel.updated_at', 'DESC');

    return paginate(query, options);
  }

  async getChannelsForUser(Iuserid: number, options: IPaginationOptions): Promise<Pagination<Ichannel>> {
	const query = this.channelRepository
		.createQueryBuilder('channel')
		.leftJoinAndSelect('channel.users', 'users')
		.where('users.id = :Iuserid', { Iuserid })
		.andWhere('channel.type != :type', { type: ChannelType.CLOSE })
		.leftJoinAndSelect('channel.admin', 'all_admin')
		.leftJoinAndSelect('channel.muted', 'all_muted')
		.leftJoinAndSelect('channel.owner', 'onwner')
		.orderBy('channel.updated_at', 'DESC');

	return paginate(query, options);
  }

  async getAllChannel(options: IPaginationOptions): Promise<Pagination<Ichannel>> {
	const query = this.channelRepository
		.createQueryBuilder('channel')
		.where('channel.type != :p', { p: ChannelType.PRIVATE })
		.andWhere('channel.type != :c', { c: ChannelType.CLOSE })
		.orderBy('channel.updated_at', 'DESC');
	
	return paginate(query, options);
  }

  async addUserToChannel(channelId: number, user: Iuser, password: string): Promise<Observable<{ error: string } | { success: string }>> {
	  const channel = await this.getChannel(channelId);
	const bool: number = await this.boolIusersOnChannel(user.id, channel);
	if (bool) return of({ error: 'Already on the channel;' }); 
	if (channel.type == ChannelType.PRIVATE) return of({ error: 'Can\'t join private channel;' }); 
	if (channel.type == ChannelType.CLOSE) return of({ error: 'Can\'t join channel closed;' }); 
	if (channel.type == ChannelType.PUBLIC) {
		const newChannel = await this.addCreatorToChannel(channel, user);		
		this.channelRepository.save(newChannel);
		return of({ success: 'Channel joined;' });
	}
	if (channel.type == ChannelType.PROTECTED) {
		const matches: boolean = await this.validatePassword(password, channel.password);
		if (matches) {
			const newChannel = await this.addCreatorToChannel(channel, user);
			this.channelRepository.save(newChannel);
			return of({ success: 'Channel joined;' }); 
		}
		return of({ error: 'Bad password;' }); 
	}	
  }

  async addCreatorToChannel(channel: Ichannel, creator: Iuser): Promise<Ichannel> {
    channel.users.push(creator);
    return channel;
  }

  async addAdminToChannel(channel: Ichannel, user: Iuser): Promise<Ichannel> {
    channel.admin.push(user);
    return channel;
  }

  async addMutedToChannel(channel: Ichannel, user: Iuser): Promise<Ichannel> {
    channel.muted.push(user);
    return channel;
  }

  	private async hashPassword(password: string): Promise<string> {
		return this.authService.hashPassword(password);
	}

	private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
		return this.authService.comparePasswords(password, storedPasswordHash);
	}

  async deleteAUserFromChannel(channelId: number, Iuserid: number): Promise<Ichannel> {
	const channel = await this.getChannel(channelId);
	
	if (channel.owner.id === Iuserid) {
		this.messageService.deleteAllMessagesForChannel(channel);
		channel.type = ChannelType.CLOSE;
		return this.channelRepository.save(channel);
	}
	channel.users = channel.users.filter(user => user.id !== Iuserid);
	channel.admin = channel.admin.filter(user => user.id !== Iuserid);	

	return this.channelRepository.save(channel);
  }

  async deleteAUserMutedFromChannel(channelId: number, Iuserid: number): Promise<Ichannel> {
	const channel = await this.getChannel(channelId);
	channel.muted = channel.muted.filter(user => user.id !== Iuserid);

	return this.channelRepository.save(channel);
  }

  async deleteAUserAdminFromChannel(channelId: number, Iuserid: number): Promise<Ichannel> {
	const channel = await this.getChannel(channelId);
	channel.admin = channel.admin.filter(user => user.id !== Iuserid);
	
	return this.channelRepository.save(channel);
  }

  boolUserMutedOnChannel(Iuserid: number, channel: Ichannel): Promise<number> {
	const query = this.channelRepository
	.createQueryBuilder('channel')
    .leftJoinAndSelect('channel.muted', 'muted')
    .where('muted.id = :Iuserid', { Iuserid })
	.andWhere("channel.id = :rid", { rid: channel.id })
	.getCount();

	return  (query);
  }

  boolIusersOnChannel(Iuserid: number, channel: Ichannel): Promise<number> {
	const query = this.channelRepository
    .createQueryBuilder('channel')
    .leftJoinAndSelect('channel.users', 'users')
    .where('users.id = :Iuserid', { Iuserid })
	.andWhere("channel.id = :rid", { rid: channel.id })
	.getCount();

	return  (query);
  }

  boolIusersAdminOnChannel(Iuserid: number, channel: Ichannel): Promise<number> {
	const query = this.channelRepository
	.createQueryBuilder('channel')
    .leftJoinAndSelect('channel.admin', 'admin')
    .where('admin.id = :Iuserid', { Iuserid })
	.andWhere("channel.id = :rid", { rid: channel.id })
	.getCount();

	return  (query);
  }
  
  async findOne(channelId: number): Promise<Ichannel> {
	return this.channelRepository.findOne(channelId);
}

async deleteChannel(id: number): Promise<any> {
	this.channelRepository.delete(id)
}

}
