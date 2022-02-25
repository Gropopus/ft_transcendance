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
            user: u1,
            target: u2,
            type: relationshipType.REQUEST
        }
        await this.rsRepository.save(this.rsRepository.create(newRelation));
    }

    async unfriend(u1: number, u2: number) {
        await this.rsRepository.delete({user : u1, target :  u2});
        await this.rsRepository.delete({user : u2, target :  u1});
    }
    
    async blockUser(u1: number, u2: number) {
        await this.rsRepository.delete({user : u2, target :  u1});
        const newRelation = {
            user: u1,
            target: u2,
            type: relationshipType.BLOCK
        }
        await this.rsRepository.save(this.rsRepository.create(newRelation));
    }
    
    async acceptFriendRequest(u1: number, u2: number) {
        const newRelation = {
            user: u1,
            target: u2,
            type: relationshipType.FRIEND
        }
        await this.rsRepository.save(this.rsRepository.create(newRelation))
        await this.rsRepository.update({user : u2, target :  u1}, { type: relationshipType.FRIEND });
    }
    
    async refuseFriendRequest(u1: number, u2: number) {
        await this.rsRepository.delete({user : u1, target :  u2});
    }

    async friendRelations(userId: number) {
        return this.rsRepository.find({ user: userId, type: relationshipType.FRIEND});
    }

    async friendRequests(userId: number) {
        return this.rsRepository.find({ user: userId, type: relationshipType.REQUEST});
    }

}
