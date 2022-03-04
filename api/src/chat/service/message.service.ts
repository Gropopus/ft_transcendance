import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/model/message.entity';
import { Imessage } from 'src/chat/model/message.interface';
import { Ichannel } from 'src/chat/model/channel.interface';
import { UserEntity } from 'src/user/model/user.entity';
import { Iuser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { FriendEntity } from 'src/friend/friend.entity';
@Injectable()
export class MessageService {


  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(FriendEntity)
	  private readonly friendRequestRepository: Repository<FriendEntity>,
    @InjectRepository(UserEntity)
	private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(message: Imessage): Promise<Imessage> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForChannel(channel: Ichannel, user: Iuser, options: IPaginationOptions): Promise<Pagination<Imessage>> {
	
	const query = this.messageRepository
	.createQueryBuilder('message')
	.leftJoin('message.channel', 'channel')
	.leftJoinAndSelect('message.user', 'u')
	.where('channel.id = :channelId', { channelId: channel.id })
	.orderBy('message.created_at', 'DESC');
	
	return paginate(query, options);

  }

  async deleteAllMessagesForChannel(channel: Ichannel): Promise<void> {
	await this.messageRepository.delete({ channel: channel });
  }

}