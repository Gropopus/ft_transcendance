import { JoinColumn, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendStatus } from "./friend.interface";
import { UserEntity } from "src/user/model/user.entity";

@Entity()
export class FriendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.friends)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => UserEntity, user => user.target, {eager: true})
    @JoinColumn()
    target: UserEntity;

    @Column({
        type: "enum",
        enum: FriendStatus,
        default: FriendStatus.PENDING
    })
    status: FriendStatus;
}
