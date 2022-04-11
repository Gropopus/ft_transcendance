import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedChannelEntity } from 'src/chat/model/joined-channel.entity';
import { IjoinedChanel } from 'src/chat/model/joined-channel.interface';
import { Ichannel } from 'src/chat/model/channel.interface';
import { Iuser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedChannelService {

  constructor(
    @InjectRepository(JoinedChannelEntity)
    private readonly joinedChannelRepository: Repository<JoinedChannelEntity>
  ) { }

  async create(joinedChannel: IjoinedChanel): Promise<IjoinedChanel> { 
    return this.joinedChannelRepository.save(joinedChannel);
  }

  async findByUser(user: Iuser): Promise<IjoinedChanel[]> {
    return this.joinedChannelRepository.find({ where: {user: user }});
  }

  async findByChannel(channelId: number): Promise<IjoinedChanel[]> {
    return this.joinedChannelRepository.find({ where: {channelId: channelId }});
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedChannelRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedChannelRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }

}
