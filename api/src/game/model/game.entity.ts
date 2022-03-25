import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { gameStatus } from "src/game/model/game.interface"
import { IPlayer } from "src/player/player.interface";

@Entity()
export class GameEntity{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	player_left_id?: number;

	@Column()
	player_right_id?: number;

	@Column()
	score_l: number;

	@Column()
	score_r: number;

	@Column({
		type: "enum",
		enum: gameStatus,
	})
	status: gameStatus;
}