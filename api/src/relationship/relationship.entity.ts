import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { relationshipType } from "./relationship.interface";
import { Exclude } from 'class-transformer';

@Entity()
export class RelationshipEntity {
    @PrimaryColumn()
    userId1: number;

    @PrimaryColumn()
    userId2: number;

    @Column({
        type:"enum",
        enum: relationshipType,
        default: relationshipType.REQUEST
    })
    type: relationshipType;
}
