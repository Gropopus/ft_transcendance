import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import { RelationshipModule } from './relationship/relationship.module';

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
    RelationshipModule,
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
        {path: '/api/users', method: RequestMethod.GET},
        {path: '/api/users/:id', method: RequestMethod.GET},
        {path: '/api/users/login', method: RequestMethod.POST},
        {path: '/api/users/logout', method: RequestMethod.POST},
        {path: '/api/users/upload', method: RequestMethod.POST},
        {path: '/api/users/:id/role', method: RequestMethod.PUT},
        {path: '/api/users/avatarById/:id', method: RequestMethod.GET},
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
		{path: '/api/channel/:id/admin/destroy', method: RequestMethod.PUT},
		{path: '/api/channel/:id/admin/give', method: RequestMethod.PUT},
		{path: '/api/channel/:id/admin/remove', method: RequestMethod.PUT},
		{path: '/api/channel/:idChannel/:idUser', method: RequestMethod.GET},
    // relationship
    {path: 'api/relationship/:u1/add/:u2', method: RequestMethod.PUT},
    {path: 'api/relationship/:u1/unfriend/:u2', method: RequestMethod.PUT},
    {path: 'api/relationship/:u1/accept/:u2', method: RequestMethod.PUT},
    {path: 'api/relationship/:u1/refuse/:u2', method: RequestMethod.PUT},
    {path: 'api/relationship/:u1/block/:u2', method: RequestMethod.PUT},
    {path: 'api/relationship/:user/friends', method: RequestMethod.GET},
    {path: 'api/relationship/:user/requests', method: RequestMethod.GET},

      )
      .forRoutes('')
  }
}