import { JoinColumn, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/user/model/user.entity";
// import { Iuser } from "src/user/model/user.interface";
import { PlayerStatus, PlayerSide } from "./player.interface"

@Entity()
export class PlayerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.history)
    @JoinColumn()
    user: UserEntity;

    @Column({default: 0})
    points: number;

    @Column()
    gameId: number;

    @Column()
    username: string;

    @Column({
        type: "enum",
        enum: PlayerStatus,
        default: PlayerStatus.PLAYING
    })
    status: PlayerStatus;

    @Column({
        type: "enum",
        enum: PlayerSide,
        default: PlayerSide.LEFT
    })
    side: PlayerSide;

    @Column({default: 0})
    opponentId: number;
}
