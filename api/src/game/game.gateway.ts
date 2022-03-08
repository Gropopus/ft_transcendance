import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';

@WebSocketGateway(42069, {cors: true})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	MAX_SPEED = 12;

	//NEED INTERFACE.ts

	@WebSocketServer()
	server: Server;
	
	private logger: Logger = new Logger('GameGateway');
	
	nb_ready: number = 0;
	
	rooms = {};

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log('client connected: ', client.id);
	}
	handleDisconnect(client: Socket) {
		this.logger.log('client disconnected: ', client.id);
	}
	
	afterInit(server: Server) {
		this.logger.log('Init');
	}

	@SubscribeMessage('init')
	handleInit(socket: Socket, data:any): void {
		this.rooms[data.gameId].score_r = 0;
		this.rooms[data.gameId].score_l = 0;
		this.rooms[data.gameId].ready += 1;

		if ((Math.floor(Math.random() * 10) + 1) % 2 == 0)
		{
			Logger.log('random put 4, 4');
			this.emitSpeedUpdate(data.gameId, 4, Math.random() * 8 - 4);
		}
		else
		{
			Logger.log('random put -4, 4');
			this.emitSpeedUpdate(data.gameId, -4, Math.random() * 8 - 4);
		}
	}

	emitScore(gameId: string): void {
		this.server.to(gameId).emit('score_update', this.rooms[gameId].score_l, this.rooms[gameId].score_r);
	}
	emitResetSpeed(gameId: string, dir: number): void {
		this.server.to(gameId).emit('reset', -4 * dir, Math.random() * 12 - 4);
	}
	emitSpeedUpdate(gameId: string, speed_x: number, speed_y: number): void {
		this.server.to(gameId).emit('speed_update', speed_x, speed_y);
	}
	endGame(gameId: string): void {
		this.server.to(gameId).emit('game_end');
		//NEED RESULT TO DB
	}

	@SubscribeMessage('player_pos_left')
	handlePos_left(socket: Socket, data: any): void {
		this.server.to(data.gameId).emit('player_pos_left', data.player_pos_left);
	}
	@SubscribeMessage('player_pos_right')
	handlePos_right(socket: Socket, data: any): void {
		this.server.to(data.gameId).emit('player_pos_right', data.player_pos_right);
	}

	@SubscribeMessage('right_miss')
	handleright_miss(socket: Socket, gameId: string): void {
		console.log('right miss the ball point for left');
		this.rooms[gameId].score_l += 1;
		this.emitScore(gameId);
		this.emitResetSpeed(gameId, -1);
		if (this.rooms[gameId].score_l == 5) 
		{
			this.endGame(gameId);
		}
	}
	@SubscribeMessage('left_miss')
	handleLeft_miss(socket: Socket, gameId: string): void {
		console.log('left miss the ball point for right');
		this.rooms[gameId].score_r += 1;
		this.emitScore(gameId);
		this.emitResetSpeed(gameId, 1);
	}

	@SubscribeMessage('bonce')
	handleBonce(socket: Socket, data: any): void {
		this.emitSpeedUpdate(data.gameId, data.speed_x, data.speed_y);
	}
	
	@SubscribeMessage('player_ready')
	handlePlayerReady(client: Socket, data: any): void {
		this.rooms[data.gameId].ready += 1;
	}
	
	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, room: string) {
		console.log("client join room");
		client.join(room);
		this.server.to(room).emit('gameId', room);
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(client: Socket, room: string) {
		client.leave(room);
		console.log("client disconnect room");
	}

	// @SubscribeMessage('colission')
	// handleBall_pos(@MessageBody() ): void {
		// send new ball speed
	//left
	//right

	//no colission left
	// no colission right
	
	//reset
	
}