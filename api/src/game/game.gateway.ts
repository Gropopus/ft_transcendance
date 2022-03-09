import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { PlayerService } from "src/player/player.service";
import { subscribe } from "superagent";
import { GameService } from "./game.service";
import { Igame } from './model/game.interface'

@WebSocketGateway(42069, {cors: true})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	constructor (
		// private playerService : PlayerService,
		gameService: GameService,
	) {}

	MAX_SPEED = 12;

	@WebSocketServer()
	server: Server;
	
	private logger: Logger = new Logger('GameGateway');
	
	nb_matchmaking: number = 0;
	nb_try: number = 0;
	

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log('client connected: ', client.id);
	}
	handleDisconnect(client: Socket) {
		this.logger.log('client disconnected: ', client.id);
		console.log('was in room', client.rooms);
		let room = this.server.sockets.adapter.rooms.get('MatchMaking');
		let numClient = room ? room.size : 0;
		console.log('nb client in Matchmaking = ', numClient);
		console.log('nb in Matchmaking = ', this.nb_matchmaking);
		if (this.nb_matchmaking != numClient)
		 --this.nb_matchmaking;
	}
	
	kickAllFrom(room: string) {
		this.server.socketsLeave(room);
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	// @SubscribeMessage('init')
	// handleInit(socket: Socket, data:any): void {

	// 	Logger.log('speed update at start')
	// 	if ((Math.floor(Math.random() * 10) + 1) % 2 == 0)
	// 		this.emitSpeedUpdate(data.gameId, 4, Math.random() * 8 - 4);
	// 	else
	// 		this.emitSpeedUpdate(data.gameId, -4, Math.random() * 8 - 4);
	// }

	// emitScore(gameId: number): void {
	// 	this.server.to(gameId.toString()).emit('score_update', this.rooms[gameId].score_l, this.rooms[gameId].score_r);
	// }
	// emitResetSpeed(gameId: number, dir: number): void {
	// 	this.server.to(gameId.toString()).emit('reset', -4 * dir, Math.random() * 12 - 4);
	// }
	// emitSpeedUpdate(gameId: string, speed_x: number, speed_y: number): void {
	// 	this.server.to(gameId).emit('speed_update', speed_x, speed_y);
	// }
	// endGame(gameId: string): void {
	// 	this.server.to(gameId).emit('game_end');
	// 	//NEED RESULT TO DB
	// }

	// @SubscribeMessage('player_pos_left')
	// handlePos_left(socket: Socket, data: any): void {
	// 	this.server.to(data.gameId).emit('player_pos_left', data.player_pos_left);
	// }
	// @SubscribeMessage('player_pos_right')
	// handlePos_right(socket: Socket, data: any): void {
	// 	this.server.to(data.gameId).emit('player_pos_right', data.player_pos_right);
	// }

	// @SubscribeMessage('right_miss')
	// handleright_miss(socket: Socket, gameId: string): void {
	// 	console.log('right miss the ball point for left');
	// 	this.rooms[gameId].score_l += 1;
	// 	this.emitScore(gameId);
	// 	this.emitResetSpeed(gameId, -1);
	// 	if (this.rooms[gameId].score_l == 5) 
	// 	{
	// 		this.endGame(gameId);
	// 	}
	// }
	// @SubscribeMessage('left_miss')
	// handleLeft_miss(socket: Socket, gameId: string): void {
	// 	console.log('left miss the ball point for right');
	// 	this.rooms[gameId].score_r += 1;
	// 	this.emitScore(gameId);
	// 	this.emitResetSpeed(gameId, 1);
	// }

	// @SubscribeMessage('bonce')
	// handleBonce(socket: Socket, data: any): void {
	// 	this.emitSpeedUpdate(data.gameId, data.speed_x, data.speed_y);
	// }
	
	// @SubscribeMessage('player_ready')
	// handlePlayerReady(client: Socket, data: any): void {
	// 	this.rooms[data.gameId].ready += 1;
	// }
	
	@SubscribeMessage('joinRoom')
	async handleJoinRoom(client: Socket, room: string) {

		console.log("client join room : ", room);
		client.join(room);
		this.server.to(room).emit('gameId', room);
	}

	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(client: Socket, room: string) {
		client.leave(room);
		console.log("client disconnect room");
	}
	
	@SubscribeMessage('MatchTimeOut')
	async handleMatchTimeOut(client: Socket, room: string) {
		client.leave(room);
		this.server.to(room).emit('didntRespond');
		this.kickAllFrom(room);
	}

	@SubscribeMessage('playerReady')
	async handlePlayerReady(client: Socket, room: string) {
		this.server.to(room).emit('playerConfirm');
		console.log("player confirm in room " ,room);
	}

	@SubscribeMessage('joinMatchmaking')
	async handleMatchmaking(client: Socket)
	{

		this.nb_matchmaking += 1;
		client.join('MatchMaking');
		if (this.nb_matchmaking == 2)
		{
			this.nb_try += 1;
			console.log("enough player to start a game :D");
			this.server.to('MatchMaking').emit('AskReady', this.nb_try.toString());
			this.kickAllFrom('MatchMaking');
			this.nb_matchmaking = 0;
		}
		else console.log("not enough player to start a game :(");
	}	
}