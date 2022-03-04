import { JoinColumn, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendStatus } from "./friend.interface";
import { UserEntity } from "src/user/model/user.entity";
import { Iuser } from "src/user/model/user.interface";

@Entity()
export class FriendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.friends)
    @JoinColumn()
    user: Iuser;

    @Column()
    targetId: number;

    @Column({
        type: "enum",
        enum: FriendStatus,
        default: FriendStatus.PENDING
    })
    status: FriendStatus;
}
