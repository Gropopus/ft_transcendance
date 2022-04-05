import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ChannelEntity } from './model/channel.entity';
import { ChannelService } from './channel.service';
import { ConnectedUserService } from './service/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user.entity';
import { MessageEntity } from './model/message.entity';
import { JoinedChannelEntity } from './model/joined-channel.entity';
import { JoinedChannelService } from './service/joined-channel.service';
import { MessageService } from './service/message.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { FriendService } from 'src/friend/friend.service';
import { FriendModule } from 'src/friend/friend.module';
import { UserHelperService } from 'src/user/user-helper/user-helper.service';
import { ChannelController } from './channel.controller';
import { FriendEntity } from 'src/friend/friend.entity';

@Module({
  imports: [
    UserModule,
    FriendModule,
    TypeOrmModule.forFeature([
      ChannelEntity,
      ConnectedUserEntity,
      MessageEntity,
      JoinedChannelEntity,
      UserEntity,
      FriendEntity,
    ]),
	AuthModule
  ],
  controllers: [ChannelController],
  providers: [ChatGateway, ChannelService, ConnectedUserService, JoinedChannelService, MessageService, UserService, UserHelperService, FriendService],
})
export class ChatModule { }
