import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendEntity } from 'src/friend/friend.entity'
import { FriendStatus, IFriend } from 'src/friend/friend.interface'
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(FriendEntity)
        private rsRepository: Repository<FriendEntity>)
        {}

    async addFriend(u1: UserI, u2: UserI) {
        const u1Relation = {
            user: u1,
            targetId: u2.id,
            status: FriendStatus.PENDING
        }
        const u2Relation = {
            user: u2,
            targetId: u1.id,
            status: FriendStatus.WAITING
        }
        await this.rsRepository.save(this.rsRepository.create(u1Relation));
        await this.rsRepository.save(this.rsRepository.create(u2Relation));
    }

    async unfriends(u1: UserI, u2: UserI) {
        await this.rsRepository.delete({user : u1, targetId :  u2.id});
        await this.rsRepository.delete({user : u2, targetId :  u1.id});
    }
    
    async acceptFriendRequest(u1: UserI, u2: UserI) {
        await this.rsRepository.update({user : u2, targetId :  u1.id}, { status: FriendStatus.FRIEND });
        await this.rsRepository.update({user : u1, targetId :  u2.id}, { status: FriendStatus.FRIEND });
    }
    
    async declineFriendRequest(u1: UserI, u2: UserI) {
        await this.rsRepository.delete({user : u1, targetId :  u2.id});
        await this.rsRepository.delete({user : u2, targetId :  u1.id});
    }
    
    async friendsRelations(u: UserI) {
        return this.rsRepository.find({ user: u, status: FriendStatus.FRIEND});
    }

    async friendsRequests(u: UserI) {
        return this.rsRepository.find({ user: u, status: FriendStatus.WAITING});
    }
    
    async friendsStatus(u1: UserI, u2: UserI) {
        return this.rsRepository.findOne({ user: u1, targetId: u2.id});
    }
}
