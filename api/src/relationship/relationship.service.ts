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

    async addFriend(newRelation: Irelationship, userId1: number, userId2: number) {
        newRelation.userId1 = userId1;
        newRelation.userId2 = userId2;
        await this.rsRepository.save(this.rsRepository.create(newRelation));
        // return newRelation.id;
    }
    async unfriend(u1: number, u2: number) {
        await this.rsRepository.delete({userId1 : u1, userId2 :  u2});
        await this.rsRepository.delete({userId1 : u2, userId2 :  u1});
    }
    
    async blockUser(u1: number, u2: number) {
        await this.rsRepository.update({userId1 : u1, userId2 :  u2}, { type: relationshipType.BLOCK });
    }
    
    async acceptFriendRequest(u1: number, u2: number) {
        await this.rsRepository.update({userId1 : u1, userId2 :  u2}, { type: relationshipType.FRIEND });
    }
    
    async refuseFriendRequest(u1: number, u2: number) {
        await this.rsRepository.delete({userId1 : u1, userId2 :  u2});
    }

}

// SELECT DISTINCT userid1, userid2 FROM RelationShip WHERE userid1=1 OR userid2=1 AND type='friend';

// SELECT userid FROM RelationShip WHERE 

