import { PlayerEntity } from "src/player/player.entity";
import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class GameEntity{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	player_left: number;

	@Column()
	player_right: number;

	@Column()
	score_l: number;

	@Column()
	score_r: number;
}