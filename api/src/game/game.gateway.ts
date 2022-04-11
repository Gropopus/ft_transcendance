import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { find, map } from "rxjs";
import { Socket, Server } from 'socket.io';
import { PlayerService } from "src/player/player.service";
import { subscribe } from "superagent";
import { UnauthorizedException } from '@nestjs/common';
import { GameService } from "./game.service";
import { Igame } from './model/game.interface';
import { Iuser } from "src/user/model/user.interface";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@WebSocketGateway(42069, {cors: {
		origin: "http://localhost:4200",
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true
		}
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	constructor (
		private authService: AuthService,
		private userService: UserService,
		private playerService : PlayerService,
		private gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server;
	
	private logger: Logger = new Logger('GameGateway');
	
	nb_matchmaking:		 number = 0;
	nb_hard_matchmaking: number = 0;
	nb_direct: number = 0;
	nb_try: number = 0;
	games_score: Map<number, {r:number, l:number, ball_x: number, ball_y: number, speed_x: number, speed_y: number, pos_r: number, pos_l: number, l_height: number, r_height: number, custom: boolean, l_username: string, r_username: string}> = 
				new Map<number, {r:number, l:number, ball_x: number, ball_y: number, speed_x: number, speed_y: number, pos_r: number, pos_l: number, l_height: number, r_height: number, custom: boolean, l_username: string, r_username: string}>();
	player_room: Map<string, string> = new Map<string, string>();
	matchmaking_id: string[] = [];
	matchmaking_hard_id: string[] = [];
	direct_game_id: Map<number, {mode: string, usr: string, gameId: number, status: string}> = new
					Map<number, {mode: string, usr: string, gameId: number, status: string}>();

	private disconnect(client: Socket) {
		client.disconnect();
	  }

	async handleConnection(client: Socket, ...args: any[]) {
		this.player_room.set(client.id, 'not in a room')
		try {
			const user: Iuser = await this.userService.getOne(client.handshake.auth.userId);
			if (!user)
				return this.disconnect(client);
		} catch {
			this.logger.log('auth fail');
			return this.disconnect(client);
		}

	}
	async handleDisconnect(client: Socket) {
		let room = this.player_room.get(client.id);

		if (room == "MatchMaking")
		{
			this.matchmaking_id = [];
			--this.nb_matchmaking;
		}
		else if (room == "MatchMakingHard")
		{
			this.matchmaking_hard_id = [];
			--this.nb_hard_matchmaking;
		}
		else if (room.substring(0, 10) == 'DirectGame')
		{
			let dg = this.direct_game_id.get(+ room.substring(10));
			dg.usr = "";
		}
		else if (room.substring(0, 7) == 'Confirm' )
		{
			this.server.to(room).emit('playerUnconfirm');
		}
		else if (room.substring(0, 8) == 'gameRoom') 
		{
			let score = this.games_score.get(+ room.substring(8))
			if (!score)
			{
				this.player_room.delete(client.id);
				return ;
			}
			score.ball_x = 50;
			score.ball_y = 50;
			score.speed_x = 0;
			score.speed_y = 0;
			this.server.to(room).emit('playerLeave');
		}
		this.player_room.delete(client.id);
	}
	kickAllFrom(room: string) {
		var client_t = this.server.sockets.adapter.rooms.get(room);
		if (client_t)
		{
			var clients = Array.from(client_t.values());
			if (clients[0])
				this.player_room.set(clients[0], 'not in a room')
			if (clients[1])
				this.player_room.set(clients[1], 'not in a room')
		}
		this.server.socketsLeave(room);
	}
	afterInit(server: Server) {
		this.logger.log('Init');
	}
	@SubscribeMessage('joinRoom')
	async handleJoinRoom(client: Socket, room: string) {
		this.player_room.set(client.id, room);
		client.join(room);
	}
	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(client: Socket, room: string) {
		client.leave(room);
	}

	emitScore(gameRoom: string, score_l: number, score_r: number): void {
		this.server.to(gameRoom).emit('score_update', score_l, score_r)
	}
	@SubscribeMessage('player_pos_left')
	handlePos_left(socket: Socket, data: any): void {
		let score = this.games_score.get(data.gameId);
		score.pos_l = data.pos;
		this.server.to(data.gameRoom).emit('player_pos_left', score.pos_l);
	}
	@SubscribeMessage('player_pos_right')
	handlePos_right(socket: Socket, data: any): void {
		let score = this.games_score.get(data.gameId);
		score.pos_r = data.pos;
		this.server.to(data.gameRoom).emit('player_pos_right', score.pos_r);
	}
	endGame(gameRoom: string, gameId: number, score: {r: number, l: number}){
		//data.gameRoom;	data.gameId;	data.score_l;	data.score_r
		this.server.to(gameRoom).emit('gameEnd');
		this.kickAllFrom(gameRoom);
		this.games_score.delete(gameId);
		this.gameService.setScore(gameId, score.l, score.r, 0);
	}

	@SubscribeMessage('playerLeave')
	handlePlayerLeave(socket: Socket, data:any): void {
		//data.side;	data.gameId;
		let score = this.games_score.get(data.gameId);

		if (data.side == 'left' && score.l <= score.r)
			score.l = score.r + 1;
		else if (data.side == 'right' && score.r <= score.l)
			score.r = score.l + 1;
		this.server.to(data.gameRoom).emit('leaveResult', score.l, score.r)
		this.kickAllFrom(data.gameRoom);
		this.games_score.delete(data.gameId);
		this.gameService.setScore(data.gameId, score.l, score.r, 0);
	}

	handleRightMiss(gameId: number) {
		let score = this.games_score.get(gameId);
		if (score == undefined)
			return ;
		score.l += 1;
		this.gameService.setScore(gameId, score.l, score.r, 3)
		this.emitScore('gameRoom' + gameId, score.l, score.r);
		if (score.l == 11)
			this.endGame('gameRoom' + gameId, gameId, {r: score.r, l: score.l});
		else
		{
			score.ball_x = 50;
			score.ball_y = 50;
			score.speed_x = 0.4;
			score.speed_y = (Math.random() - 0.5);
			if (score.custom == true)
			{
				score.l_height = 100 / (6 + score.l );
				this.server.to('gameRoom' + gameId).emit('player_size', score.l_height, score.r_height);
			}
		}
	}
	handleLeftMiss(gameId: number) {
		let score = this.games_score.get(gameId);
		if (score == undefined)
			return ;
		score.r += 1;
		this.gameService.setScore(gameId, score.l, score.r, 3)
		this.emitScore('gameRoom' + gameId, score.l, score.r);
		if (score.r == 11)
			this.endGame('gameRoom' + gameId, gameId, {r: score.r, l: score.l});
		else
		{
			score.ball_x = 50;
			score.ball_y = 50;
			score.speed_x = -0.4;
			score.speed_y = (Math.random() - 0.5);
			if (score.custom == true)
			{
				score.r_height = 100 / (6 + score.r );
				this.server.to('gameRoom' + gameId).emit('player_size', score.l_height, score.r_height);
			}
		}
	}

	sendBall(gameId:number, pos_x: number, pos_y: number) {
		this.server.to('gameRoom' + gameId).emit('ball_pos', pos_x, pos_y)
	}
	async sleep(ms: number) {
		return new Promise((resolve) => {
						setTimeout(resolve, ms);
					});
	}
	async actualiseBall(gameId: number) {
		let score = this.games_score.get(gameId);
		if (!score || score.r >= 11 || score.l >= 11)
			return;
		if (score.ball_y > 100)
		{
			score.speed_y *= -1;
			score.ball_y = 100;
		}
		else if (score.ball_y < 0)
		{
			score.speed_y *= -1;
			score.ball_y = 0;
		} 
			
		if (score.ball_x >= 100) // colllision right
		{
			score.ball_x = 100;
			if (score.ball_y < score.pos_r || score.ball_y > score.pos_r + score.r_height )
				this.handleRightMiss(gameId)
			else
			{
				const impact = score.ball_y - score.pos_r - score.l_height / 2;
				const ratio = 100 / (score.l_height / 2)
				const multi = Math.abs(score.speed_x) / 0.4;
				score.speed_y = multi * impact * ratio / 180;
				if (score.speed_x < 2.0 && score.speed_x > -2.0)
					score.speed_x *= 1.2;

			}
		}
		if (score.ball_x <= 0)
		{
			score.ball_x = 0;
			if (score.ball_y < score.pos_l || score.ball_y > score.pos_l + score.l_height )
				this.handleLeftMiss(gameId)
			else
			{
				const impact = score.ball_y - score.pos_l - score.r_height / 2;
				const ratio = 100 / (score.r_height / 2)
				const multi = Math.abs(score.speed_x) / 0.4;
				score.speed_y = multi * impact * ratio / 180;
				if (score.speed_x < 2.0 && score.speed_x > -2.0)
					score.speed_x *= 1.2;
			}
		}
		if (score.ball_x >= 100 || score.ball_x <= 0 )
			score.speed_x *= -1;
		score.ball_x += score.speed_x;
		score.ball_y += score.speed_y;

		this.games_score.set(gameId, score);
		this.sendBall(gameId, score.ball_x, score.ball_y)
		await this.sleep(100/6);
		this.actualiseBall(gameId);
	}

	async handleEngage(gameId: number) {		
		await this.sleep(2000);
		let score = this.games_score.get(gameId);
		if (!score)
			return;
		score.speed_y = (Math.random() - 0.5);
		if (Math.random() < 0.5)
			score.speed_x *= -1;
		this.actualiseBall(gameId);
	}

	@SubscribeMessage('observe')
	handleObserve(client: Socket, data:any) {
		//data.gameRoom; data.gameId;
		let score = this.games_score.get(data.gameId);
		if (!score)
		{
			this.disconnect(client)
			return ;
		}
		client.join(data.gameRoom);
		this.server.to(client.id).emit('player_size', score.l_height, score.r_height);
		this.server.to(client.id).emit('player_pos_left', score.pos_l);
		this.server.to(client.id).emit('player_pos_right', score.pos_r);
		this.server.to(client.id).emit('score_update', score.l, score.r)
		this.server.to(client.id).emit('start_watching_now', score.l_username, score.r_username);
	}

	//bellow is matchmaking part
	@SubscribeMessage('startGame')
	async handleStartGame(client: Socket, data: any) {
		let room = data.room;
		if (client.rooms.has(room) == true)
		{			
			const players = this.server.sockets.adapter.rooms.get(room);
			const playerss = Array.from(players.values());
			this.kickAllFrom(room);

			// create game
			if (data.mode == 'normal')
				var gameid = await this.gameService.createGame(false);
			else
				var gameid = await this.gameService.createGame(true);
			this.player_room.set(this.server.sockets.sockets.get(playerss[0]).id, 'gameRoom' + gameid);
			this.player_room.set(this.server.sockets.sockets.get(playerss[1]).id, 'gameRoom' + gameid);
			let p_zero = this.server.sockets.sockets.get(playerss[0]).handshake.auth.userId;
			let p_one  = this.server.sockets.sockets.get(playerss[1]).handshake.auth.userId;
			if (Math.random() < 0.5)
			{
				var p_r_name = (await this.userService.findOne(p_zero)).username;
				var p_l_name = (await this.userService.findOne(p_one)).username;
				await this.gameService.addPlayerToGame(gameid, p_one, p_zero);
				this.server.to(playerss[0]).emit('gameId', 'right', gameid, "gameRoom" + gameid, p_l_name, p_r_name);
				this.server.to(playerss[1]).emit('gameId', 'left',  gameid, "gameRoom" + gameid, p_l_name, p_r_name);
			}
			else
			{
				var p_l_name = (await this.userService.findOne(p_zero)).username;
				var p_r_name = (await this.userService.findOne(p_one)).username;
				await this.gameService.addPlayerToGame(gameid, p_zero, p_one);
				this.server.to(playerss[0]).emit('gameId', 'left',  gameid, "gameRoom" + gameid, p_l_name, p_r_name);
				this.server.to(playerss[1]).emit('gameId', 'right', gameid, "gameRoom" + gameid, p_l_name, p_r_name);
			}
			if (data.mode == 'normal')
				this.games_score.set(gameid, {r:0, l:0, speed_x: 0.4, speed_y: 0, ball_x: 50, ball_y: 50, pos_l: 50 - 50/6, pos_r: 50 - 50/6, l_height: 100/ 6, r_height: 100/6, custom: false, l_username: p_r_name, r_username: p_l_name});
			else
				this.games_score.set(gameid, {r:0, l:0, speed_x: 0.4, speed_y: 0, ball_x: 50, ball_y: 50, pos_l: 50 - 50/6, pos_r: 50 - 50/6, l_height: 100/ 6, r_height: 100/6, custom: true, l_username: p_r_name, r_username: p_l_name});
			this.server.to(playerss[0]).emit('player_size', 100/6, 100/6)
			this.server.to(playerss[1]).emit('player_size', 100/6, 100/6)
			this.handleEngage(gameid);
		}
	}
	@SubscribeMessage('joinMatchmaking')
	async handleMatchmaking(client: Socket)
	{
		if (this.matchmaking_id && this.matchmaking_id[0] == client.handshake.auth.userId)	//already in matchmacking
		{
			this.server.to(client.id).emit('already_in_matchmaking');
			return ;
		}
		this.matchmaking_id.push(client.handshake.auth.userId);
		this.nb_matchmaking += 1;
		client.join('MatchMaking');
		this.player_room.set(client.id, 'MatchMaking');
		if (this.nb_matchmaking == 2)
		{
			this.matchmaking_id = [];
			this.nb_try += 1;
			this.server.to('MatchMaking').emit('AskReady', 'Confirm' + this.nb_try.toString());
			this.kickAllFrom('MatchMaking');
			this.nb_matchmaking = 0;
		}
	}

	@SubscribeMessage('joinHardMatchmaking')
	async handleHardMatchmaking(client: Socket)
	{
		if (this.matchmaking_hard_id && this.matchmaking_hard_id[0] == client.handshake.auth.userId)	//already in matchmacking
		{
			this.server.to(client.id).emit('already_in_matchmaking');
			return ;
		}
		this.matchmaking_hard_id.push(client.handshake.auth.userId);
		this.nb_hard_matchmaking += 1;
		client.join('MatchMakingHard');
		this.player_room.set(client.id, 'MatchMakingHard');
		if (this.nb_hard_matchmaking == 2)
		{
			this.matchmaking_hard_id = [];
			this.nb_try += 1;
			this.server.to('MatchMakingHard').emit('AskReady', 'Confirm' + this.nb_try.toString());
			this.kickAllFrom('MatchMakingHard');
			this.nb_hard_matchmaking = 0;
		}
	}
	@SubscribeMessage('DirectGameId')
	async handleDirectGameId(client: Socket, data: {searchid: number, gameId: number})
	{
		let match = this.direct_game_id.get(data.searchid);
		match.gameId = data.gameId;
		match.status = "playing";
	}
	@SubscribeMessage('DirectGameEnd')
	async handleDirectGameEnd(client: Socket, data: {searchid: number, gameId: number})
	{
		let match = this.direct_game_id.get(data.searchid);
		match.status = "done";
	}

	@SubscribeMessage('joinDirectGame')
	async handleDirectGame(client: Socket, data: {mode: string, searchid: number})
	{
		// let match = this.bidul.set(id, {val})
		let match = this.direct_game_id.get(data.searchid);
		if (match && match.status != 'waiting')
		{
			this.server.to(client.id).emit('tooLateForChall');
			return ;
		}

		if (match && match.usr == client.handshake.auth.userId)
		{
			this.server.to(client.id).emit('already_in_matchmaking');
			return ;
		}
		if (!match)
		{
			match = (this.direct_game_id.set(data.searchid, {mode: data.mode, usr: client.handshake.auth.userId, gameId: -1, status: 'waiting'}))[0];
			client.join('DirectGame' + data.searchid);
			this.player_room.set(client.id, 'DirectGame' + data.searchid);
		}
		else
		{
			client.join('DirectGame' + data.searchid);
			this.player_room.set(client.id, 'DirectGame' + data.searchid);
			this.server.to('DirectGame' + data.searchid).emit('AskReady', 'Confirm' + this.nb_try.toString());
			this.kickAllFrom('DirectGame' + data.searchid);
			match.status = 'confirming';
		}
		
	}

	@SubscribeMessage('playerReady')
	async handlePlayerReady(client: Socket, room: string) {
		this.server.to(room).emit('playerConfirm');
	}
	@SubscribeMessage('MatchTimeOut')
	async handleMatchTimeOut(client: Socket, data: {room: string}) {
		client.leave(data.room);
		this.player_room.set(client.id, 'not in a room');
		this.server.to(data.room).emit('didntRespond');
		this.kickAllFrom(data.room);
	}
}
