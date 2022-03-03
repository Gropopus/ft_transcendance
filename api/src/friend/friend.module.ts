import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendEntity } from './friend.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendEntity]),
    forwardRef(() => UserModule)
  ],
  controllers: [FriendController],
  providers: [FriendService, UserEntity],
  exports: [FriendService]
})
export class FriendModule {}
