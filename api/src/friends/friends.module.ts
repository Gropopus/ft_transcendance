import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendEntity } from './friends.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendEntity])
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendModule {}
