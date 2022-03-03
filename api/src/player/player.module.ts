import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { UserService } from 'src/user/user.service';
import { PlayerEntity } from './player.entity';
import { UserEntity } from 'src/user/model/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerEntity]),
    forwardRef(() => UserModule)
  ],
  controllers: [PlayerController],
  providers: [PlayerService, UserEntity],
  exports: [PlayerService]
})
export class PlayerModule {}
