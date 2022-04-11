import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PlayerService } from 'src/player/player.service';
import { Iuser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameGateway } from './game.gateway';
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
		return await this.gameRepository.find({where: { status: gameStatus.PLAYING }});
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
		return this.gameRepository.findOne({ where: { id: id }});
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
			igame.mode = gameMode.HARD;
		else
			igame.mode = gameMode.NORMAL;
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
			game.status = gameStatus.CANCEL;
			await this.gameRepository.update({id: pid}, game)
		}
		else if (end == 0)
		{
			game.status = gameStatus.FINISH;
			await this.gameRepository.update({id: pid}, game);
			await this.playerService.setFinalScores(game.player_left_id.id, game.score_l, game.score_r);
			if (game.mode == 'normal')
			{
				if (game.score_l > game.score_r)
					await this.updateElo(game.player_left_id.user.id, game.player_right_id.user.id);
				else
					await this.updateElo(game.player_right_id.user.id, game.player_left_id.user.id);
			}
		}
		else
			await this.gameRepository.update({id: pid}, game);

	}
	async getScore(pid: number) {
		let game = await this.findOne(pid);
		return {score_l: game.score_l, score_r: game.score_r};
	}

	
	async updateElo(winnerid: number, looserid: number)
	{
		let user_a = await this.userService.findOne(winnerid);
		let user_b = await this.userService.findOne(looserid);

		const D = 400;
		var Ea = 1 / (1 + Math.pow(10 , ((user_b.level - user_a.level) / D))) //proba of A winning
		var Eb = 1 / (1 + Math.pow(10 , ((user_a.level - user_b.level) / D))) //proba of B winning
		if (Ea > 0.9)
			Ea = 0.9;
		if (Eb < 0.1)
			Eb = 0.1;

		var Ka = 40;
		var Kb = 40;
		if (user_a.level >= 2400)
			Ka = 15;
		if (user_b.level >= 2400)
			Kb = 15;
		var win_p = Math.round(Ka * (1 - Ea));
		var loose_p = Math.round(Kb * (0 - Eb));
		if (win_p < 1)
			win_p = 1;
		if (loose_p > -1)
			loose_p = -1;
		user_a.level = user_a.level + win_p;

		if (user_b.level + loose_p < 0)
			user_b.level = 0;
		else
			user_b.level = user_b.level + loose_p;
		this.userService.updateOne(user_a.id, user_a)
		this.userService.updateOne(user_b.id, user_b)
	}
}
