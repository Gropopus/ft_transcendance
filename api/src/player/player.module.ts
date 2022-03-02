import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerEntity } from './player.entity';
import { UserEntity } from 'src/user/model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerEntity, UserEntity])
  ],
  controllers: [PlayerController],
  providers: [PlayerService, UserEntity],
  // exports: [PlayerService]
})
export class PlayerModule {}
