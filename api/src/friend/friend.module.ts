import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendEntity } from './friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendEntity])
  ],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
