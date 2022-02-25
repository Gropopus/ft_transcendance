import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { relationshipType } from "./relationship.interface";
import { UserEntity } from "src/user/model/user.entity";
import { Exclude } from 'class-transformer';

@Entity()
export class RelationshipEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    target: number;
    
    @Column()
    user: number;

    @Column({
        type: "enum",
        enum: relationshipType,
        default: relationshipType.REQUEST
    })
    type: relationshipType;                                                                                   
}
