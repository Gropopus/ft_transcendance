import { isJSXFragment } from '@babel/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPlayer } from 'src/player/player.interface';
import { PlayerService } from 'src/player/player.service';
import { Iuser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { GameEntity } from './model/game.entity';
import { Igame } from './model/game.interface';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		private gameRepository: Repository<GameEntity>, 
	) { }

	findAll(): Promise<GameEntity[]> {
		return this.gameRepository.find();
	}
	findOne(id: number): Promise<GameEntity> {
		return this.gameRepository.findOne(id);
	}
	async remove(id: number): Promise<void> {
		await this.gameRepository.delete(id);
	}

	async createGame() : Promise<number> {
		let igame: Igame = {
			player_left: -1,
			player_right: -1,

			score_l: 0,
			score_r: 0,
		}
		let game = this.gameRepository.create(igame);
		await this.gameRepository.save(game);
		console.log('game id is ', game.id);
		return game.id;
	}
	async addPlayerToGame(pid: number, player_left: number, player_right: number): Promise<number> {
		let game = await this.findOne(pid);
		if (!game)
			return (-1); // game doenst exist
		game.player_right = player_right;
		game.player_right = player_left;
		await this.gameRepository.update({id: pid}, game);
	}

	async setScore(pid: number, score_l: number, score_r: number) {
		await this.gameRepository.update({id: pid}, {
			score_l: score_l,
			score_r: score_r,
		})
	}
	async getScore(pid: number) {
		let game = await this.findOne(pid);
		return {score_l: game.score_l, score_r: game.score_r};
	}
}
