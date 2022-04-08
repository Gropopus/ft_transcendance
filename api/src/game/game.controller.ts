import { Body, Controller, Param, Get, Put, Query } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GameService } from './game.service';
import { Igame } from './model/game.interface';
import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {

	constructor(
		private gameService: GameService,
		private userService: UserService,
		private gameGateway: GameGateway,
		) {}

	@Put('delete/:gameID')
	async deleteGame(@Param('gameID') gameID: number) {
		this.gameService.remove(gameID);
		return ('removed game ID : ' + gameID );
	}

	@Get('stat/:gameID')
	async gameStat(@Param('gameID') gameID: any) {
		try {
			let test: number = gameID;
			return this.gameService.findOne(gameID);
		}
		catch
		{
			return
		}
	}
	@Get('stat/')
	async allStat() {
		return this.gameService.findAll();
	}
	@Get('playinglist/')
	async playingStat() {
		return this.gameService.findAllPlaying();
	}

	@Get('newchallengeid/')
	async newChallengeId() {
		this.gameGateway.nb_direct += 1;
		return this.gameGateway.nb_direct;
	}

	@Get('history/:userId')
	async getUserHistory(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Igame>> {
		return this.gameService.userHistory(params.userId, { page, limit, route: 'http://localhost:3000/api/game/history/:userId' });
	}
}
