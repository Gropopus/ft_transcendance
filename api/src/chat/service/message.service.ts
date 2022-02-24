import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/model/message.entity';
import { MessageI } from 'src/chat/model/message.interface';
import { Ichannel } from 'src/chat/model/channel.interface';

import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {


  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
	private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForChannel(channel: Ichannel, user: UserI, options: IPaginationOptions): Promise<Pagination<MessageI>> {
	
	const blocked = this.userRepository
        .createQueryBuilder("u")
        .leftJoin('u.sentFriendRequests', 'c')
        .leftJoin('u.receivedFriendRequests', 'r')
        .where("r.creator = :id")
        .andWhere("r.status = 'blocked'")
        .setParameters({ id : user.id })
        .getMany();

    const blockedIds = (await blocked).map(b => b.id);
	if (blockedIds.length != 0) {
		// query for messages excluding blocked users
		const query = this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.channel', 'channel')
        .leftJoinAndSelect('message.user', 'u')
        .where('channel.id = :channelId', { channelId: channel.id })
        .andWhere('u.id NOT IN (:...blockedIds)')
        .setParameters({ blockedIds: blockedIds })
        .orderBy('message.created_at', 'DESC');

		return paginate(query, options);
	}
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
