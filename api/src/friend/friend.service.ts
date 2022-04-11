import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async addFriend(u1: Iuser, u2: Iuser): Promise<IFriend>{
        const relation = await this.friendRepository.find({
            where: [
                {user: u1, target: u2},
                {user: u2, target: u1},
            ],
        });
        if (relation.length)
            throw new HttpException(relation[0].status, HttpStatus.CONFLICT);
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
        await this.friendRepository.save(this.friendRepository.create(u1Relation));
        await this.friendRepository.save(this.friendRepository.create(u2Relation));
        return this.friendRepository.findOne({where: {user: u1, target: u2}});
    }
    
    async unfriend(u1: Iuser, u2: Iuser): Promise<any> {
        const relation = await this.friendRepository.findOne({
            where: [ {user: u1, target: u2}, ],
        });
        if (relation && relation.status != FriendStatus.FRIEND)
            throw new HttpException(relation.status, HttpStatus.CONFLICT);
        await this.friendRepository.delete({user: u1, target: u2});
        await this.friendRepository.delete({user: u2, target:  u1});
    }
    
    async acceptFriendRequest(u1: Iuser, u2: Iuser): Promise<IFriend> {
        const relation = await this.friendRepository.findOne({
            where: [ {user: u1, target: u2}, ],
        });
        if (relation && relation.status != FriendStatus.WAITING)
            throw new HttpException(relation.status, HttpStatus.CONFLICT);
        await this.friendRepository.update({user : u2, target :  u1}, { status: FriendStatus.FRIEND });
        await this.friendRepository.update({user : u1, target :  u2}, { status: FriendStatus.FRIEND });
        return this.friendRepository.findOne({where: {user: u1, target: u2}});
    }
    
    async declineFriendRequest(u1: Iuser, u2: Iuser): Promise<any>{
        const relation = await this.friendRepository.findOne({
            where: [ {user: u1, target: u2}, ],
        });
        if (relation && relation.status != FriendStatus.WAITING)
            throw new HttpException(relation.status, HttpStatus.CONFLICT);
        await this.friendRepository.delete({user : u1, target :  u2});
        await this.friendRepository.delete({user : u2, target :  u1});
    }
    
    async friendsList(u: Iuser): Promise<IFriend[]> {
        return this.friendRepository.find({ where: {user: u, status: FriendStatus.FRIEND}});
    }
    
    async friendsRequests(u: Iuser): Promise<IFriend[]> {
        return this.friendRepository.find({ where: {user: u, status: FriendStatus.WAITING}});
    }
    
    async friendsStatus(u1: Iuser, u2: Iuser) {
        return this.friendRepository.findOne({ where: {user: u1, target: u2 }});
    }
    
    async blockUser(u1: Iuser, u2: Iuser): Promise<IFriend> {
        await this.friendRepository.delete({user : u1, target :  u2});
        const relation = {
            user: u1,
            target: u2,
            status: FriendStatus.BLOCKED
        }
        await this.friendRepository.save(this.friendRepository.create(relation));
        if ((await this.friendRepository.find({
            where:[
                {user: u2, target: u1, status: FriendStatus.WAITING},
                {user: u2, target: u1, status: FriendStatus.PENDING}
            ]
        })).length)
            await this.friendRepository.delete({user : u2, target :  u1}); // remove request
        return this.friendRepository.findOne({ where: {user: u1, target: u2 }});
    }

    async unblockUser(u1: Iuser, u2: Iuser): Promise<IFriend> {
        await this.friendRepository.delete({user : u1, target :  u2});
        if (!(await this.friendRepository.count({ where: {user: u2, target: u1, status: FriendStatus.FRIEND }})))
            return ;
        const relation = {
            user: u1,
            target: u2,
            status: FriendStatus.FRIEND
        }
        await this.friendRepository.save(this.friendRepository.create(relation));
        return this.friendRepository.findOne({ where: {user: u1, target: u2 }});
    }

    async getBlockedUsers(u: Iuser): Promise<IFriend[]> {
        return this.friendRepository.find({where: { user: u, status: FriendStatus.BLOCKED }});
    }
}
