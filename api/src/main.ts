import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'body-parser';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.enableCors();
  app.use((req, res, next) => {
    next();
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
  	.setTitle('ApiDetails')
	.setDescription('KittyPong Api details')
	.setVersion('1.0')
	.build()

  const document = SwaggerModule.createDocument(app, config, {
  include: [ Module,
				AppController,
				AppService,
				ConfigModule,
				TypeOrmModule,
				UserModule,
				AuthModule,
				AuthMiddleware,
				ChatModule,
				FriendModule,
				PlayerModule,
				GameModule,
			  ]});

  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
