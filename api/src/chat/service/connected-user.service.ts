import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/model/connected-user.entity';
import { ConnectedIuser } from 'src/chat/model/connected-user.interface';
import { Iuser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {

  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>
  ) { }

  async create(connectedUser: ConnectedIuser): Promise<ConnectedIuser> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: Iuser): Promise<ConnectedIuser[]> {
    return this.connectedUserRepository.find({ where: { 'user': user }});
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }

}
