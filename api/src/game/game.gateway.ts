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
		// private playerService : PlayerService,
		private gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server;
	
	private logger: Logger = new Logger('GameGateway');
	
	nb_matchmaking: number = 0;
	nb_try: number = 0;
	games_score: Map<number, {r:number, l:number}> = new Map<number, {r:number, l:number}>();
	player_room: Map<string, string> = new Map<string, string>();


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
				this.gameService.setScore(+ room.substring(8), score.l, score.r, false);
			else
				this.logger.log('no score for room id:' + room.substring(8));
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
	emitResetSpeed(gameRoom: string, dir: number): void {
		this.server.to(gameRoom).emit('reset', -4 * dir, Math.random() * 12 - 4);
	}
	emitSpeedUpdate(gameRoom: string, speed_x: number, speed_y: number): void {
		this.server.to(gameRoom).emit('speed_update', speed_x, speed_y);
	}
	@SubscribeMessage('player_pos_left')
	handlePos_left(socket: Socket, data: any): void {
		this.server.to(data.gameRoom).emit('player_pos_left', data.player_pos_left);
	}
	@SubscribeMessage('player_pos_right')
	handlePos_right(socket: Socket, data: any): void {
		this.server.to(data.gameRoom).emit('player_pos_right', data.player_pos_right);
	}
	endGame(data: any, score: {r: number, l: number}){
		//data.gameRoom;	data.gameId;	data.score_l;	data.score_r
		this.server.to(data.gameRoom).emit('gameEnd');
		this.kickAllFrom(data.gameRoom);
		this.games_score.delete(data.gameId);
		this.gameService.setScore(data.gameId, score.l, score.r, true);
	}

	@SubscribeMessage('playerLeave')
	handlePlayerLeave(socket: Socket, data:any): void {
		//data.side;	data.gameId;	data.score_l;	data.score_r
		
		this.kickAllFrom(data.gameRoom);
		this.games_score.delete(data.gameId);
		this.gameService.setScore(data.gameId, data.score_l, data.score_r, true);
	}

	@SubscribeMessage('right_miss')
	handleright_miss(socket: Socket, data: any) {
			//data.gameRoom;	data.gameId;	data.score_l;	data.score_r

		let score: {r: number , l: number};
		score = this.games_score.get(data.gameId);
		if (score == undefined)
			return ;
		score.l = data.score_l + 1;
		this.games_score.set(data.gameId, score);
		this.emitScore(data.gameRoom, score.l, score.r);
		if (score.l == 11)
			this.endGame(data, score);
		else
			this.emitResetSpeed(data.gameRoom, -1);
	}
	@SubscribeMessage('left_miss')
	handleLeft_miss(socket: Socket, data: any) {
			//data.gameRoom;	data.gameId;	data.score_l;	data.score_r;	data.side

		let score: {r: number , l: number};
		score = this.games_score.get(data.gameId);
		if (score == undefined)
			return ;
		score.r = data.score_r + 1;
		this.games_score.set(data.gameId, score);
		this.emitScore(data.gameRoom, score.l, score.r);
		if (score.r == 11)
			this.endGame(data, score);
		else
			this.emitResetSpeed(data.gameRoom, 1);
	}
	@SubscribeMessage('engage')
	handleEngage(client: Socket, data: any) {
		//data.gameRoom; data.speed
		if (data.speed == 0)
			this.emitResetSpeed(data.gameRoom, -1);
	}

	@SubscribeMessage('observe')
	handleObserve(client: Socket, data:any) {
		//data.gameRoom; data.gameId;
		client.emit('observe', data.gameId);
		client.join(data.gameRoom);
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
			this.logger.log('game ' + gameid + ' start')
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
			this.games_score.set(gameid, {r:0, l:0});
		}
		else
			this.logger.log('game already started');
	}
	@SubscribeMessage('joinMatchmaking')
	async handleMatchmaking(client: Socket)
	{
		this.nb_matchmaking += 1;
		client.join('MatchMaking');
		this.player_room.set(client.id, 'MatchMaking');
		if (this.nb_matchmaking == 2)
		{
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