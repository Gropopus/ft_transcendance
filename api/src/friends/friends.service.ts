import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendEntity } from 'src/friends/friends.entity'
import { FriendStatus, IFriend } from 'src/friends/friends.interface'

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(FriendEntity)
        private rsRepository: Repository<FriendEntity>)
        {}

    async addFriend(u1: number, u2: number) {
        const u1Relation = {
            user: u1,
            target: u2,
            status: FriendStatus.PENDING
        }
        const u2Relation = {
            user: u2,
            target: u1,
            status: FriendStatus.WAITING
        }
        await this.rsRepository.save(this.rsRepository.create(u1Relation));
        await this.rsRepository.save(this.rsRepository.create(u2Relation));
    }

    async unfriends(u1: number, u2: number) {
        await this.rsRepository.delete({user : u1, target :  u2});
        await this.rsRepository.delete({user : u2, target :  u1});
    }
    
    async acceptFriendRequest(u1: number, u2: number) {
        await this.rsRepository.update({user : u2, target :  u1}, { status: FriendStatus.FRIEND });
        await this.rsRepository.update({user : u1, target :  u2}, { status: FriendStatus.FRIEND });
    }
    
    async declineFriendRequest(u1: number, u2: number) {
        await this.rsRepository.delete({user : u1, target :  u2});
        await this.rsRepository.delete({user : u2, target :  u1});
    }
    
    async friendsRelations(userId: number) {
        return this.rsRepository.find({ user: userId, status: FriendStatus.FRIEND});
    }
    
    async friendsRequests(userId: number) {
        return this.rsRepository.find({ user: userId, status: FriendStatus.WAITING});
    }
    
    async friendsStatus(u1: number, u2: number) {
        return this.rsRepository.find({ user: u1, target: u2});
    }
}
