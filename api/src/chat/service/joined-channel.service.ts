import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedChannelEntity } from 'src/chat/model/joined-channel.entity';
import { JoinedChannelI } from 'src/chat/model/joined-channel.interface';
import { Ichannel } from 'src/chat/model/channel.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedChannelService {

  constructor(
    @InjectRepository(JoinedChannelEntity)
    private readonly joinedChannelRepository: Repository<JoinedChannelEntity>
  ) { }

  async create(joinedChannel: JoinedChannelI): Promise<JoinedChannelI> { 
    return this.joinedChannelRepository.save(joinedChannel);
  }

  async findByUser(user: UserI): Promise<JoinedChannelI[]> {
    return this.joinedChannelRepository.find({ user });
  }

  async findByChannel(channel: Ichannel): Promise<JoinedChannelI[]> {
    return this.joinedChannelRepository.find({ channel });
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
