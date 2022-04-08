import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { gameMode, gameStatus } from "src/game/model/game.interface"
import { PlayerEntity } from "src/player/player.entity";

@Entity()
export class GameEntity{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => PlayerEntity, {eager: true})
	@JoinColumn()
	player_left_id?: PlayerEntity;

	@OneToOne(() => PlayerEntity, {eager: true})
	@JoinColumn()
	player_right_id?: PlayerEntity;

	@Column()
	score_l: number;

	@Column()
	score_r: number;

	@Column({
		type: "enum",
		enum: gameStatus,
	})
	status: gameStatus;


	@Column({
		type: "enum",
		enum: gameMode,
	})
	mode: gameMode;
}