import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { UserEntity } from "src/user/model/user.entity";
import { UserI } from "src/user/model/user.interface";
import { PlayerStatus, PlayerSide } from "./player.interface"

@Entity()
export class PlayerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.history)
    user: UserI;

    @Column({default: 0})
    points: number;

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
}
