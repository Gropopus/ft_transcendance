import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameEntity } from './model/game.entity'

@Module({
	imports: [GameEntity],
	controllers: [GameController],
	providers: [GameService, GameGateway]
})
export class GameModule {}
