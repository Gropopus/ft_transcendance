import { isJSXFragment } from '@babel/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPlayer } from 'src/player/player.interface';
import { PlayerService } from 'src/player/player.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameEntity } from './model/game.entity';
import { Igame, gameStatus } from './model/game.interface';

@Injectable()
export class GameService {
	constructor(
		private playerService: PlayerService,
		private userService: UserService,
		@InjectRepository(GameEntity)
		private gameRepository: Repository<GameEntity>, 
	) { }

	findAll(): Promise<GameEntity[]> {
		return this.gameRepository.find();
	}
	async findAllPlaying(): Promise<any[]> {
		return await this.gameRepository.find({where: { status: "playing" }});
	}
	findOne(id: number): Promise<GameEntity> {
		return this.gameRepository.findOne(id);
	}
	async remove(id: number): Promise<void> {
		await this.gameRepository.delete(id);
	}

	async createGame() : Promise<number> {
		let igame: Igame = {
			score_l: 0,
			score_r: 0,
			status: gameStatus.PLAYING,
		}
		let game = this.gameRepository.create(igame);
		await this.gameRepository.save(game);
		console.log('game id is ', game.id);
		return game.id;
	}
	async addPlayerToGame(pid: number, left_uid: number, right_uid: number): Promise<number> {
		let game = await this.findOne(pid);
		if (!game)
			return (-1); // game doenst exist
		
		let ret = await this.playerService.createGame(await this.userService.findOne(left_uid), await this.userService.findOne(right_uid), pid);
		game.player_left_id = ret.p1;
		game.player_right_id = ret.p2;
		await this.gameRepository.update({id: pid}, game);
	}

	async setScore(pid: number, score_l: number, score_r: number, end: number) {
		let game = await this.findOne(pid);
		
		game.score_l = score_l;
		game.score_r = score_r;
		if (end == 1)
		{
			game.status = gameStatus.FINISH;
			await this.gameRepository.update({id: pid}, game)
			await this.playerService.setFinalScores(game.player_left_id.id, game.score_l, game.score_r);
		}
		else if (end == 0)
		{
			game.status = gameStatus.CANCEL;
			await this.gameRepository.update({id: pid}, game);
			await this.playerService.setFinalScores(game.player_left_id.id, game.score_l, game.score_r);
		}
		else
			await this.gameRepository.update({id: pid}, game);

	}
	async getScore(pid: number) {
		let game = await this.findOne(pid);
		return {score_l: game.score_l, score_r: game.score_r};
	}
}
