import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendStatus } from "./friends.interface";
import { UserEntity } from "src/user/model/user.entity";
import { Exclude } from 'class-transformer';

@Entity()
export class FriendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    target: number;
    
    @Column()
    user: number;

    @Column({
        type: "enum",
        enum: FriendStatus,
        default: FriendStatus.PENDING
    })
    status: FriendStatus;                                                                                   
}
