import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Socket, Server } from 'socket.io';
import { Iuser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { ChannelService } from '../channel.service';
import { ConnectedUserService } from '../service/connected-user.service';
import { Ichannel, ChannelType } from '../model/channel.interface';
import { ConnectedIuser } from '../model/connected-user.interface';
import { JoinedChannelService } from '../service/joined-channel.service';
import { MessageService } from '../service/message.service';
import { Imessage } from '../model/message.interface';
import { IjoinedChanel } from '../model/joined-channel.interface';
import { FriendService } from 'src/friend/friend.service';
import { Logger } from "@nestjs/common";

@WebSocketGateway(42070, {cors: {
  origin: "http://localhost:4200",
  methods: ["GET", "POST"],
  allowedHeaders: ["my-custom-header"],
  credentials: true
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private friendService: FriendService,
    private channelService: ChannelService,
    private connectedUserService: ConnectedUserService,
    private joinedChannelService: JoinedChannelService,
    private messageService: MessageService) { }

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedChannelService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    this.logger.log('client connected : ' + socket.id + ' userid : ' + socket.handshake.auth.userId);
    try {
      const user: Iuser = await this.userService.getOne(socket.handshake.auth.userId);
      if (!user) {
        return this.disconnect(socket);
      } else {
        const channels = await this.channelService.getChannelsForUser(user.id, { page: 1, limit: 10 });
        await this.connectedUserService.create({ socketId: socket.id, user });
        return ;
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log('clien disconnect : ' + socket.id)
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

	afterInit(server: Server) {
		this.logger.log('Init');
	}

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, channelId: number) {
    const channel = await this.channelService.findOne(channelId)
    const usr = await this.userService.findOne(socket.handshake.auth.userId)
    const messages = await this.messageService.findMessagesForChannel(channel, socket.handshake.auth.userId, { limit: 30, page: 1 });
    messages.meta.currentPage = messages.meta.currentPage - 1;
    await this.joinedChannelService.create({ socketId: socket.id, user: usr, Iuserid: socket.handshake.auth.userId, channel: channel, channelId: channelId});
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveJoinChannel')
  async onleaveJoinChannel(socket: Socket) {
    await this.joinedChannelService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: {msg: string, challengeId: number, channelId: number}) {
    const user = await this.userService.findOne(socket.handshake.auth.userId);
    const nb_mute: number = await this.channelService.boolUserMutedOnChannel(socket.handshake.auth.userId, message.channelId);
    if (nb_mute == 0) {
      const channel: Ichannel = await this.channelService.getChannel(message.channelId);
      const createdMessage: Imessage = await this.messageService.create({ type: 0, user: user, username: user.username,
                                                          text:message.msg, challengeId: message.challengeId,
                                                          channel: channel, created_at: new Date(), updated_at: new Date()});

      const joinedUsers: IjoinedChanel[] = await this.joinedChannelService.findByChannel(message.channelId);
      for(const user of joinedUsers) {
        const nu = null;
        if (!nu) 
        {
          this.server.to(user.socketId).emit('messageAdded', message.channelId,user.Iuserid);
        }
      }
    }
  }
}
