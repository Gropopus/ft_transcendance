import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendEntity } from 'src/friend/friend.entity'
import { FriendStatus, IFriend } from 'src/friend/friend.interface'
import { Iuser } from 'src/user/model/user.interface';

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(FriendEntity)
        private friendRepository: Repository<FriendEntity>)
        {}

    async addFriend(u1: Iuser, u2: Iuser) {
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
        await this.friendRepository.save(this.friendRepository.create(u1Relation));
        await this.friendRepository.save(this.friendRepository.create(u2Relation));
    }
    
    async unfriends(u1: Iuser, u2: Iuser) {
        await this.friendRepository.delete({user : u1, targetId :  u2.id});
        await this.friendRepository.delete({user : u2, targetId :  u1.id});
    }
    
    async acceptFriendRequest(u1: Iuser, u2: Iuser) {
        await this.friendRepository.update({user : u2, targetId :  u1.id}, { status: FriendStatus.FRIEND });
        await this.friendRepository.update({user : u1, targetId :  u2.id}, { status: FriendStatus.FRIEND });
    }
    
    async declineFriendRequest(u1: Iuser, u2: Iuser) {
        await this.friendRepository.delete({user : u1, targetId :  u2.id});
        await this.friendRepository.delete({user : u2, targetId :  u1.id});
    }
    
    async friendsRelations(u: Iuser) {
        return this.friendRepository.find({ user: u, status: FriendStatus.FRIEND});
    }
    
    async friendsRequests(u: Iuser) {
        return this.friendRepository.find({ user: u, status: FriendStatus.WAITING});
    }
    
    async friendsStatus(u1: Iuser, u2: Iuser) {
        return this.friendRepository.findOne({ user: u1, targetId: u2.id});
    }
    
    async blockUser(u1: Iuser, u2: Iuser) {
        await this.friendRepository.delete({user : u1, targetId :  u2.id});
        const relation = {
            user: u1,
            targetId: u2.id,
            status: FriendStatus.BLOCKED
        }
        await this.friendRepository.save(this.friendRepository.create(relation));
    }

    async unblockUser(u1: Iuser, u2: Iuser) {
        await this.friendRepository.delete({user : u1, targetId :  u2.id});
        if (!this.friendRepository.count({ user: u2, targetId: u1.id, status: FriendStatus.FRIEND}))
            return ;
        const relation = {
            user: u1,
            targetId: u2.id,
            status: FriendStatus.FRIEND
        }
        await this.friendRepository.save(this.friendRepository.create(relation));
    }

    async getBlockedUsers(u: Iuser) {
        return this.friendRepository.find({ user: u, status: FriendStatus.BLOCKED});
    }
}
