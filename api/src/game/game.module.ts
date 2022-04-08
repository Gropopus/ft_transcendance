import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameEntity } from './model/game.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from 'src/player/player.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([GameEntity]),
		UserModule,
		PlayerModule,
		AuthModule
	],
	controllers: [GameController],
	providers: [GameService, GameGateway,]
})
export class GameModule {}
