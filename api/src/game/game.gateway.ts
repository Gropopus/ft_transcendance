import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { map } from "rxjs";
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
	
	nb_matchmaking: number = 0;
	nb_try: number = 0;
	games_score: Map<number, {r:number, l:number, ball_x: number, ball_y: number, speed_x: number, speed_y: number, pos_r: number, pos_l: number, l_height: number, r_height: number, custom: boolean}> = 
				new Map<number, {r:number, l:number, ball_x: number, ball_y: number, speed_x: number, speed_y: number, pos_r: number, pos_l: number, l_height: number, r_height: number, custom: boolean}>();
	player_room: Map<string, string> = new Map<string, string>();
	matchmaking_id: string[] = [];

	private disconnect(client: Socket) {
		client.emit('Error', new UnauthorizedException());
		client.disconnect();
	  }

	async handleConnection(client: Socket, ...args: any[]) {
		this.player_room.set(client.id, 'not in a room')
		// try {
		// 	const user: Iuser = await this.userService.getOne(client.handshake.auth.userId);
		// 	if (!user)
		// 		return this.disconnect(client);
		// } catch {
		// 	this.logger.log('auth fail');
		// 	return this.disconnect(client);
		// }

	}
	async handleDisconnect(client: Socket) {
		this.logger.log('client disconnected: ' + client.id);
		this.logger.log('\t the client was in room : ' + this.player_room.get(client.id));

		let room = this.player_room.get(client.id);

		if (room == "MatchMaking")
		{
			this.matchmaking_id = [];
			--this.nb_matchmaking;
			this.logger.log("reduce number of player in matchmaking")
		}
		else if (room.substring(0, 7) == 'Confirm' )
		{
			this.logger.log("was in confirm room send unconfirm");
			this.server.to(room).emit('playerUnconfirm');
		}
		else if (room.substring(0, 8) == 'gameRoom') 
		{
			let score = this.games_score.get(+ room.substring(8))
			if (score)
				this.gameService.setScore(+ room.substring(8), score.l, score.r, 1);
			else
				this.logger.log('no score for room id:' + room.substring(8));
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
		this.logger.log("client leave room");
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
		//data.side;	data.gameId;	data.score_l;	data.score_r
		
		this.kickAllFrom(data.gameRoom);
		this.games_score.delete(data.gameId);
		this.gameService.setScore(data.gameId, data.score_l, data.score_r, 0);
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
			score.speed_x = -0.4;
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
			score.speed_x = 0.4;
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
		if (score.ball_y > 100 || score.ball_y < 0)
			score.speed_y *= -1;
			
		if (score.ball_x >= 100) // colllision right
		{
			if (score.ball_y < score.pos_r || score.ball_y > score.pos_r + score.l_height )
				this.handleRightMiss(gameId)
			else
			{
				const impact = score.ball_y - score.pos_r - score.l_height / 2;
				const ratio = 100 / (score.l_height / 2)

				score.speed_y = impact * ratio / 180;
				if (score.speed_x < 2.0 && score.speed_x > -2.0)
					score.speed_x *= 1.2;

			}
		}
		if (score.ball_x <= 0)
		{
			if (score.ball_y < score.pos_l || score.ball_y > score.pos_l + score.r_height )
				this.handleLeftMiss(gameId)
			else
			{
				const impact = score.ball_y - score.pos_l - score.r_height / 2;
				const ratio = 100 / (score.r_height / 2)

				score.speed_y = impact * ratio / 180;
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

	handleEngage(gameId: number) {		
		let score = this.games_score.get(gameId);
		score.speed_y = (Math.random() - 0.5);
		if (Math.random() < 0.5)
			score.speed_x *= -1;
		this.actualiseBall(gameId);
	}

	@SubscribeMessage('observe')
	handleObserve(client: Socket, data:any) {
		//data.gameRoom; data.gameId;
		client.join(data.gameRoom);
		this.server.to(data.gameRoom).emit('ask_pos')
	}
	@SubscribeMessage('for_observer')
	async handleForObserver(client: Socket, data:any) {
		// data.gameId;		data.gameRoom
		// data.pos_x;		data.pos_y
		// data.speed_x;	data.speed_y
		// data.left_pos;	data.right_pos;
		this.server.to(data.gameRoom).emit('observer_data', data.pos_x, data.pos_y,
									data.speed_x, data.speed_y, data.left_pos, data.right_pos);
	}

	//bellow is matchmaking part
	@SubscribeMessage('startGame')
	async handleStartGame(client: Socket, room: string) {
		if (client.rooms.has(room) == true)
		{	// if client still in room to avoid duplicate game
			
			const players = this.server.sockets.adapter.rooms.get(room);
			const playerss = Array.from(players.values());
			this.kickAllFrom(room);

			// create game
			let gameid = await this.gameService.createGame();
			this.logger.log('game ' + gameid + ' start');
			this.player_room.set(this.server.sockets.sockets.get(playerss[0]).id, 'gameRoom' + gameid);
			this.player_room.set(this.server.sockets.sockets.get(playerss[1]).id, 'gameRoom' + gameid);
			let p_zero = this.server.sockets.sockets.get(playerss[0]).handshake.auth.userId;
			let p_one  = this.server.sockets.sockets.get(playerss[1]).handshake.auth.userId;
			if (Math.random() < 0.5)
			{
				await this.gameService.addPlayerToGame(gameid, p_one, p_zero);
				this.server.to(playerss[1]).emit('gameId', 'left',  gameid, "gameRoom" + gameid);
				this.server.to(playerss[0]).emit('gameId', 'right', gameid, "gameRoom" + gameid);
			}
			else
			{
				await this.gameService.addPlayerToGame(gameid, p_zero, p_one);
				this.server.to(playerss[0]).emit('gameId', 'left', gameid, "gameRoom" + gameid);
				this.server.to(playerss[1]).emit('gameId', 'right',  gameid, "gameRoom" + gameid);
			}
			this.games_score.set(gameid, {r:0, l:0, speed_x: 0.4, speed_y: 0, ball_x: 50, ball_y: 50, pos_l: 50 - 50/6, pos_r: 50 - 50/6, l_height: 100/ 6, r_height: 100/6, custom: true});
			this.server.to(playerss[0]).emit('player_size', 100/6, 100/6)
			this.server.to(playerss[1]).emit('player_size', 100/6, 100/6)
			await this.sleep(2000);
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
	@SubscribeMessage('playerReady')
	async handlePlayerReady(client: Socket, room: string) {
		this.server.to(room).emit('playerConfirm');
	}
	@SubscribeMessage('MatchTimeOut')
	async handleMatchTimeOut(client: Socket, room: string) {
		client.leave(room);
		this.player_room.set(client.id, 'not in a room');
		this.server.to(room).emit('didntRespond');
		this.kickAllFrom(room);
	}
}