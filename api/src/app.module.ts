import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { PlayerModule } from './player/player.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    ChatModule,
    FriendModule,
  	PlayerModule,
    GameModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
		// users
        {path: '/api/users', method: RequestMethod.POST},
        {path: '/api/users/update/:id', method: RequestMethod.POST},
        {path: '/api/users', method: RequestMethod.GET},
        {path: '/api/users/:id', method: RequestMethod.GET},
        {path: '/api/users/login', method: RequestMethod.POST},
        {path: '/api/users/logout', method: RequestMethod.POST},
        {path: '/api/users/upload', method: RequestMethod.POST},
        {path: '/api/users/find-by-email/:email', method: RequestMethod.GET},
        {path: '/api/users/find-by-username/:name', method: RequestMethod.GET},
        {path: '/api/users/:id/role', method: RequestMethod.PUT},
        {path: '/api/users/pictureById/:id', method: RequestMethod.GET},
        {path: '/api/users/ladder-level/:id', method: RequestMethod.GET},
		// 2fa 
        {path: '/api/2fa/generate', method: RequestMethod.POST},
        {path: '/api/2fa/authenticate', method: RequestMethod.POST},
        {path: '/api/2fa/turn-on', method: RequestMethod.POST},
        {path: '/api/2fa/turn-off', method: RequestMethod.POST},
        {path: '/api/2fa/secret', method: RequestMethod.GET},
        {path: '/api/2fa/qrcode', method: RequestMethod.GET},
		// oauth
        {path: '/api/oauth2/school42', method: RequestMethod.GET},
        {path: '/api/oauth2/school42/callback', method: RequestMethod.GET},
		// channel
      {path: '/api/channel/:idChannel', method: RequestMethod.GET},
      {path: '/api/channel/:idChannel/users', method: RequestMethod.GET},
      {path: '/api/channel/new/:creatorId', method: RequestMethod.PUT},
      {path: '/api/channel/delete/:id', method: RequestMethod.PUT},
      {path: '/api/channel/all/:user', method: RequestMethod.GET},
      {path: '/api/channel/:id/admin/destroy', method: RequestMethod.PUT},
      {path: '/api/channel/:id/admin/give', method: RequestMethod.PUT},
      {path: '/api/channel/:id/admin/remove', method: RequestMethod.PUT},
      {path: '/api/channel/:idChannel/:idUser', method: RequestMethod.GET},
      {path: '/api/channel/:channelId/adduser/:username', method: RequestMethod.PUT},
      {path: '/api/channel/:channelId/adduser/:username', method: RequestMethod.PUT},
      {path: '/api/channel/:channelId/messages/:userId', method: RequestMethod.GET},
    // friends
      {path: 'api/friends/:u1/add/:u2', method: RequestMethod.PUT},
      {path: 'api/friends/:u1/unfriend/:u2', method: RequestMethod.PUT},
      {path: 'api/friends/:u1/accept/:u2', method: RequestMethod.PUT},
      {path: 'api/friends/:u1/decline/:u2', method: RequestMethod.PUT},
      {path: 'api/friends/:u1/status/:u2', method: RequestMethod.GET},
      {path: 'api/friends/:user', method: RequestMethod.GET},
      {path: 'api/friends/:user/received-requests', method: RequestMethod.GET},
      {path: 'api/friends/:u1/block/:u2', method: RequestMethod.PUT},
      {path: 'api/friends/:u1/unblock/:u2', method: RequestMethod.PUT},
      {path: 'api/friends/:user/blocked-users', method: RequestMethod.GET},
    // history
      {path: 'api/history/player/:playerId', method: RequestMethod.GET},
      {path: 'api/history/:userId', method: RequestMethod.GET},  
		// game
      {path: 'api/game/create', method: RequestMethod.PUT},
      {path: 'api/game/delete/:gameID', method: RequestMethod.PUT},
      {path: 'api/game/stat/:gameID', method: RequestMethod.GET},
      {path: 'api/game/stat/', method: RequestMethod.GET},
      {path: 'api/game/playinglist/', method: RequestMethod.GET},
      )
      .forRoutes('')
  }
}