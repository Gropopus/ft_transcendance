import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Socket, Server } from 'socket.io';
import { UserI, UserRole } from 'src/user/model/user.interface';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { ChannelService } from '../channel.service';
import { PageI } from '../model/page.interface';
import { ConnectedUserService } from '../service/connected-user.service';
import { Ichannel, ChannelType } from '../model/channel.interface';
import { ConnectedUserI } from '../model/connected-user.interface';
import { JoinedChannelService } from '../service/joined-channel.service';
import { MessageService } from '../service/message.service';
import { MessageI } from '../model/message.interface';
import { JoinedChannelI } from '../model/joined-channel.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway{

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private channelService: ChannelService,
    private connectedUserService: ConnectedUserService,
    private joinedChannelService: JoinedChannelService,
    private messageService: MessageService) { }

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedChannelService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const channels = await this.channelService.getChannelsForUser(user.id, { page: 1, limit: 10 });
        // substract page -1 to match the angular material paginator
        channels.meta.currentPage = channels.meta.currentPage - 1;
        // Save connection to DB
        await this.connectedUserService.create({ socketId: socket.id, user });
        // Only emit channels to the specific connected client
        return this.server.to(socket.id).emit('channels', channels);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: Ichannel) {
    const createdChannel: Ichannel = await this.channelService.createChannel(channel, socket.data.user);
    
    for (const user of createdChannel.users) {
      const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
      const channels = await this.channelService.getChannelsForUser(user.id, { page: 1, limit: 10 });
      // substract page -1 to match the angular material paginator
      channels.meta.currentPage = channels.meta.currentPage - 1;
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('channels', channels);
      }
    }
  }

  @SubscribeMessage('paginateChannels')
  async onPaginateChannel(socket: Socket, page: PageI) {
    if (!socket || !socket.data || !socket.data.user)
      return ;
    const channels = await this.channelService.getChannelsForUser(socket.data.user.id, this.handleIncomingPageRequest(page));
    // substract page -1 to match the angular material paginator
    channels.meta.currentPage = channels.meta.currentPage - 1;
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, channel: Ichannel) {
    const messages = await this.messageService.findMessagesForChannel(channel, socket.data.user, { limit: 30, page: 1 });
    messages.meta.currentPage = messages.meta.currentPage - 1;
    // Save Connection to Channel
    await this.joinedChannelService.create({ socketId: socket.id, user: socket.data.user, userId: socket.data.user.id, channel });
    // Send last messages from Channel to User
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveJoinChannel')
  async onleaveJoinChannel(socket: Socket) {
    // remove connection from JoinedChannels
    await this.joinedChannelService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(socket: Socket, channel: Ichannel) {
    // remove user from Channel
    await this.channelService.deleteAUserFromChannel(channel.id, socket.data.user.id);
  }

  // get all channel (public and protected)
  @SubscribeMessage('allChannel')
  async allChannel(socket: Socket, page: PageI) {
	const channels = await this.channelService.getAllChannel(this.handleIncomingPageRequest(page));
    // substract page -1 to match the angular material paginator
    channels.meta.currentPage = channels.meta.currentPage - 1;
    return this.server.to(socket.id).emit('allchannels', channels);
  }

  // add user
  @SubscribeMessage('addUser')
  async addUser(socket: Socket, data: any) {
	  let channel : Ichannel = data.channel;
	  const password = data.password;
    await this.channelService.addUserToChannel(channel.id, socket.data.user, password);
  }

  // Add admin
  @SubscribeMessage('addAdmin')
  async addAdmin(socket: Socket, data: any) {
	let channel : Ichannel = data.channel;
	let user : UserI = data.user;
	
	let bool: Number = await this.channelService.boolUserIsAdminOnChannel(socket.data.user.id, channel);
	if (socket.data.user.role == UserRole.ADMIN || socket.data.user.role == UserRole.OWNER) {
		bool = 1;
	}
	
	if (bool) await this.channelService.addAdminToChannel(channel, user);
	this.channelService.saveChannel(channel);
  }

  // add muted
  @SubscribeMessage('addMuted')
  async addMuted(socket: Socket, data: any) {
	let channel : Ichannel = data.channel;
	let user : UserI = data.user;
	const bool: Number = await this.channelService.boolUserIsAdminOnChannel(socket.data.user.id, channel);
	if (bool && user != channel.owner) await this.channelService.addMutedToChannel(channel, user);
	this.channelService.saveChannel(channel);
  }

  // remove user
  @SubscribeMessage('removeUser')
  async removeUser(socket: Socket, data: any) {
	let channel : Ichannel = data.channel;
	let user : UserI = data.user;
	const bool: Number = await this.channelService.boolUserIsAdminOnChannel(socket.data.user.id, channel);
	if (bool && user != channel.owner) {
		await this.channelService.deleteAUserFromChannel(channel.id, user.id);
		const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
		const channels = await this.channelService.getChannelsForUser(user.id, { page: 1, limit: 10 });
      	// substract page -1 to match the angular material paginator
      	channels.meta.currentPage = channels.meta.currentPage - 1;
      	for (const connection of connections) {
      	  await this.server.to(connection.socketId).emit('channels', channels);
		}
	}
  }

  // remove admin
  @SubscribeMessage('removeAdmin')
  async removeAdmin(socket: Socket, data: any) {
	let channel : Ichannel = data.channel;
	let user : UserI = data.user;
	const bool: Number = await this.channelService.boolUserIsAdminOnChannel(socket.data.user.id, channel);
	if (bool && user != channel.owner) await this.channelService.deleteAUserAdminFromChannel(channel.id, user.id);
  }

   // remove muted
   @SubscribeMessage('removeMuted')
   async removeMuted(socket: Socket, data: any) {
	let channel : Ichannel = data.channel;
	let user : UserI = data.user;
	 const bool: Number = await this.channelService.boolUserIsAdminOnChannel(socket.data.user.id, channel);
	 if (bool) await this.channelService.deleteAUserMutedFromChannel(channel.id, user.id);
   }

  // try join channel
  @SubscribeMessage('tryJoinChannel')
   async tryJoinChannel(socket: Socket, data: any) {
	  let channel : Ichannel = data.channel;
	  const password = data.password;
	await this.channelService.addUserToChannel(channel.id, socket.data.user, password);
   }

  // change password
  @SubscribeMessage('changePassword')
   async changePassword(socket: Socket, data: any) {
	  let channel : Ichannel = data.channel;
	  const password = data.password;
	if (channel.owner.id == socket.data.user.id) await this.channelService.changePasswordChannel(channel, password);
   }

  // change type channel
  @SubscribeMessage('changeType')
   async changeType(socket: Socket, data: any) {
	let channel : Ichannel = data.channel;
	let type : ChannelType = data.type;
	const password = data.password;

	if (channel.owner.id == socket.data.user.id) {
		if (type == ChannelType.PROTECTED) {
			if (channel.password != null && password == null){
				await this.channelService.changeTypeChannel(channel, type);
			}
			else if (password != null) {
				await this.channelService.changePasswordChannel(channel, password);
				await this.channelService.changeTypeChannel(channel, type);
			}
		}
		else
			await this.channelService.changeTypeChannel(channel, type);
	}
   }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
	const bool: number = await this.channelService.boolUserMutedOnChannel(socket.data.user.id, message.channel);
    if (!bool) {
		const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
		const channel: Ichannel = await this.channelService.getChannel(createdMessage.channel.id);
		const joinedUsers: JoinedChannelI[] = await this.joinedChannelService.findByChannel(channel);
		}
	}


  private handleIncomingPageRequest(page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}