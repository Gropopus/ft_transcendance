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

	MAX_SPEED = 12;

	@WebSocketServer()
	server: Server;
	
	private logger: Logger = new Logger('GameGateway');
	
	nb_matchmaking: number = 0;
	nb_try: number = 0;
	games_score: Map<number, {r:number, l:number}> = new Map<number, {r:number, l:number}>();


	private disconnect(client: Socket) {
		client.emit('Error', new UnauthorizedException());
		client.disconnect();
	  }

	async handleConnection(client: Socket, ...args: any[]) {
		this.logger.log('client connected: ' + client.id);

		// try {
		// 	const decodedToken = await this.authService.verifyJwt(client.handshake.headers.authorization);
		// 	this.logger.log('token ok');
		// 	const user: Iuser = await this.userService.getOne(decodedToken.user.id);
		// 	if (!user)
		// 		return this.disconnect(client);
		// } catch {
		// 	this.logger.log('auth fail');
		// 	return this.disconnect(client);
		// }

	}
	async handleDisconnect(client: Socket) {
		this.logger.log('client disconnected: ' + client.id);
		let room = this.server.sockets.adapter.rooms.get('MatchMaking');
		let numClient = room ? room.size : 0;
		if (this.nb_matchmaking != numClient)
		{
		 --this.nb_matchmaking;
		 console.log("remove nb user in matchmaking")
		}
	}
	kickAllFrom(room: string) {
		this.server.socketsLeave(room);
	}
	afterInit(server: Server) {
		this.logger.log('Init');
	}
	@SubscribeMessage('joinRoom')
	async handleJoinRoom(client: Socket, room: string) {
		this.logger.log('client ' + client.id + ' join room ' + room)
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
		// this.games_score.delete(data.gameId);S
		this.gameService.setScore(data.gameId, score.l, score.r);
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
			this.logger.log('game start confirm for room', room);
			
			const players = this.server.sockets.adapter.rooms.get(room).values();
			const playerss = Array.from(players);
			this.kickAllFrom(room);

			// create game
			let gameid = await this.gameService.createGame();
			this.logger.log('player in room', playerss[0], ', ' ,playerss[1]);

			if (Math.random() < 0.5)
			{
				await this.gameService.addPlayerToGame(gameid, 1, 0);
				this.server.to(playerss[1]).emit('gameId', 'left',  gameid, "gameRoom" + gameid);
				this.server.to(playerss[0]).emit('gameId', 'right', gameid, "gameRoom" + gameid);
			}
			else
			{
				await this.gameService.addPlayerToGame(gameid, 0, 1);
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
		if (this.nb_matchmaking == 2)
		{
			this.nb_try += 1;
			this.server.to('MatchMaking').emit('AskReady', this.nb_try.toString());
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
		this.server.to(room).emit('didntRespond');
		this.kickAllFrom(room);
	}
}