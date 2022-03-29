import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { gameStatus } from "src/game/model/game.interface"
import { IPlayer } from "src/player/player.interface";
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
}