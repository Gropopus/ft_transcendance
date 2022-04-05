import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PlayerService } from 'src/player/player.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameEntity } from './model/game.entity';
import { Igame, gameStatus, gameMode } from './model/game.interface';

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

	async userHistory(userId: number, options: IPaginationOptions): Promise<Pagination<Igame>> {
		const query = this.gameRepository
		.createQueryBuilder('history')
		.leftJoinAndSelect('history.player_left_id', 'p1')
		.leftJoinAndSelect('history.player_right_id', 'p2')
		.leftJoinAndSelect('p1.user', 'u1')
		.leftJoinAndSelect('p2.user', 'u2')
		.where('u1.id = :userId1', { userId1: userId })
		.orWhere('u2.id = :userId2', { userId2: userId })

		return paginate(query, options);
	}

	findOne(id: number): Promise<GameEntity> {
		return this.gameRepository.findOne(id);
	}
	async remove(id: number): Promise<void> {
		await this.gameRepository.delete(id);
	}

	async createGame(hard: boolean) : Promise<number> {
		let igame: Igame = {
			score_l: 0,
			score_r: 0,
			status: gameStatus.PLAYING
		}
		if (hard == true)
			igame.mode = gameMode.NORMAL;
		else
			igame.mode = gameMode.HARD;
		let game = this.gameRepository.create(igame);
		await this.gameRepository.save(game);
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
