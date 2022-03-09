import { forwardRef, Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameEntity } from './model/game.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from 'src/player/player.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([GameEntity]),
		UserModule,
		
	],
	controllers: [GameController],
	providers: [GameService, GameGateway,]
})
export class GameModule {}
