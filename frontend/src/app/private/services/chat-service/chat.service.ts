import { HttpClient } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MessageI, MessagePaginateI } from 'src/app/model/chat/message.interface';
import { ChannelType ,Ichannel, ChannelPaginateI } from 'src/app/model/chat/channel.interface';
import { GameStateI } from 'src/app/model/game-state.interface';
import { UserI } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: CustomSocket = null;
  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
	private http: HttpClient,
	private router: Router
    ) {
        if(authService.isAuthenticated())
          this.socket = new CustomSocket;
      }

  @HostListener('window:beforeunload') goToPage() {
    this.socket.emit('PlayerExit');
  }

  createChannel(channel: Ichannel) {
	let iduser : number;
	
	this.authService.getUserId().subscribe(val => {
	  iduser = val;
	})
	if (channel.users.filter(function(e) { return e.id === iduser; }).length > 0) {
	  this.snackbar.open(`You're adding YOU :)`, 'Close', {
		duration: 5000, horizontalPosition: 'right', verticalPosition: 'top',
		panelClass: ['red-snackbar','login-snackbar'],
	  });
	  throw iduser;
	}
	this.socket.emit('createChannel', channel);
	this.snackbar.open(`Channel ${channel.name} created successfully`, 'Close', {
	  duration: 3000, horizontalPosition: 'right', verticalPosition: 'top',
	});
  }
  
  emitPaginateChannels(limit: number, page: number) {
	this.socket.emit('paginateChannels', { limit, page });
  }

  inviteMessage(message: MessageI, id: number, type: number) {
    this.socket.emit('gameMessage', {message, id, type});
  }

  joinChannel(channel: Ichannel) {
	this.socket.emit('joinChannel', channel);
  }

  spectate(id: number, self_id: number){
    this.socket.emit('specChannel', [id, self_id]);
  }

  leaveJoinChannel(channel: Ichannel) {    
	this.socket.emit('leaveJoinChannel', channel);
  }

  leaveChannel(channel : Ichannel) {
	this.socket.emit('leaveChannel', channel);
  }
  
  emitPaginateAllChannels(limit: number, page: number) {
    this.socket.emit('allChannel', { limit, page });
  }

  addUserToChannel(channel: Ichannel, password: string) {
	this.socket.emit('addUser',  {channel, password});
  }

  addAdmin(channel: Ichannel, user: UserI) {
	this.socket.emit('addAdmin', { channel, user });
  }

  addMuted(channel: Ichannel, user: UserI) {
	this.socket.emit('addMuted', { channel, user });
  }

  removeUser(channel: Ichannel, user: UserI) {
	this.socket.emit('removeUser', { channel, user });
  }

  removeAdmin(channel: Ichannel, user: UserI) {
	this.socket.emit('removeAdmin', { channel, user });
  }

  removeMuted(channel: Ichannel, user: UserI) {
	this.socket.emit('removeMuted', { channel, user });
  }

  changePassword(channel: Ichannel, password: string) {
	this.socket.emit('changePassword', { channel, password });
  }

  changeType(channel: Ichannel, type: ChannelType, password: string, user: UserI) {
	this.socket.emit('changeType', { channel, type, password, user});
  }

  sendMessage(message: MessageI) {
    this.socket.emit('addMessage', message);
  }

  getMessages(): Observable<MessagePaginateI> {
    return this.socket.fromEvent<MessagePaginateI>('messages');
  }

  getMyChannels(): Observable<ChannelPaginateI> {
    return this.socket.fromEvent<ChannelPaginateI>('channels');
  }
  
  getAllChannels(): Observable<ChannelPaginateI> {
    return this.socket.fromEvent<ChannelPaginateI>('allchannels');
  }

  getAddedMessage(): Observable<MessageI> {
    return this.socket.fromEvent<MessageI>('messageAdded');
  }	  

  // Controller

  //delete channel by id
  deleteChannel(id: number) {
	return this.http.put(`/api/channel/${id}/admin/destroy`, {});
  }

  // give admin to user
  giveAdmin(id: number, user: UserI) {
	  return this.http.put(`/api/channel/${id}/admin/give`, {user});
  }

  // remove admin from user
  removeAdminFromUser(id: number, user: UserI) {
	  return this.http.put(`/api/channel/${id}/admin/remove`, {user});
  }

  IsInChannel(channelId: number, userId : number): Observable<number> {
	  return this.http.get<number>('/api/channel/' + channelId + '/' +  userId).pipe(
		tap(val => {
		  if (val < 1) {
			this.snackbar.open(`Password failed, Try again !`, 'Close', {
			  duration: 3000, 
			  panelClass: ['red-snackbar','login-snackbar'],
			  horizontalPosition: 'right', verticalPosition: 'top',
			});
		  }
		  else {
			this.snackbar.open(`Password success, You're in the channel!`, 'Close', {
			  duration: 3000, horizontalPosition: 'right', verticalPosition: 'top',
			});
			this.router.navigate(['../../private/dashboard']);
		}
		}));
  }

  findOne(id: number): Observable<Ichannel> {
	return this.http.get('/api/channel/' + id).pipe(
	  map((channel:Ichannel) => channel)
	)
  }

  // Game
  checkExistence(n: number)
  {
    this.socket.emit('checkExistence', n);
  }

  gameLogout()
  {
    this.socket.emit('logoutPlayer', 0);
  }

  newPlayer(info: number, user: number) {
    this.socket.emit('newPlayer', [info, user]);
  }

  newPrivatePlayer(channel: Ichannel, user: number, m_id: number) {
    this.socket.emit('newPrivatePlayer', {channel, user, m_id});
  }

  newPrivateGame(channel: Ichannel, user: number, type: number, m_id: number) {
    this.socket.emit('CreatePrivateGame', {channel, user, type, m_id});
  }

  getGameState(): Observable<GameStateI> {
    return this.socket.fromEvent<GameStateI>('gamestate');
  }

  emitInput(data: number[]){
    this.socket.emit("paddle", data);
  }

}
