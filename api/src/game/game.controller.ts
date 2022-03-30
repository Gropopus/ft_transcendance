import { Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { get } from 'superagent';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

	constructor(
		private gameService: GameService,
		private userService: UserService
		) {}

	@Put('create')
	async createGame() {
		return (await (this.gameService.createGame()));
	}

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

	@Get('hello')
	hello() {
		return 'hello :)';
	}
}
