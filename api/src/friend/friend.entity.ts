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

    @ManyToOne(() => UserEntity, user => user.target)
    @JoinColumn()
    target: UserEntity;

    @Column({ nullable: true })
    targetName: string;

    @Column({ nullable: true })
    targetId: number;

    @Column({
        type: "enum",
        enum: FriendStatus,
        default: FriendStatus.PENDING
    })
    status: FriendStatus;
}
