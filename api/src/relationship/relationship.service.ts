import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationshipEntity } from 'src/relationship/relationship.entity'
import { relationshipType, Irelationship } from 'src/relationship/relationship.interface'

@Injectable()
export class RelationshipService {
    constructor(
        @InjectRepository(RelationshipEntity)
        private rsRepository: Repository<RelationshipEntity>)
        {}

    async addFriend(u1: number, u2: number) {
        const newRelation = {
            userId1: u1,
            userId2: u2,
            type: relationshipType.REQUEST
        }
        await this.rsRepository.save(this.rsRepository.create(newRelation));
    }

    async unfriend(u1: number, u2: number) {
        await this.rsRepository.delete({userId1 : u1, userId2 :  u2});
        await this.rsRepository.delete({userId1 : u2, userId2 :  u1});
    }
    
    async blockUser(u1: number, u2: number) {
        await this.rsRepository.delete({userId1 : u2, userId2 :  u1});
        const newRelation = {
            userId1: u1,
            userId2: u2,
            type: relationshipType.BLOCK
        }
        await this.rsRepository.save(this.rsRepository.create(newRelation));
    }
    
    async acceptFriendRequest(u1: number, u2: number) {
        await this.rsRepository.update({userId1 : u1, userId2 :  u2}, { type: relationshipType.FRIEND });
    }
    
    async refuseFriendRequest(u1: number, u2: number) {
        await this.rsRepository.delete({userId1 : u1, userId2 :  u2});
    }

    async getFriendList(user: number) {
    }

    async getRequestList(user: number) {
    }

    async getBlockList(user: number) {
    }
}

// SELECT DISTINCT userid1, userid2 FROM RelationShip WHERE userid1=1 OR userid2=1 AND type='friend';

// SELECT userid FROM RelationShip WHERE 

