import { Controller, Param, Get, Put } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { IFriend } from './friend.interface';
import { FriendService } from './friend.service'

@Controller('friends')
export class FriendController {
    constructor(
        private friendService: FriendService,
        private userService: UserService) {}

    @Put(':u1/add/:u2')
    async addFriend(@Param() params): Promise<IFriend> {
        return this.friendService.addFriend(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }
    
    @Put(':u1/unfriend/:u2')
    async unfriend(@Param() params): Promise<any> {
        return this.friendService.unfriend(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }
    
    @Put(':u1/accept/:u2')
    async acceptFriendRequest(@Param() params): Promise<IFriend> {
        return this.friendService.acceptFriendRequest(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Put(':u1/decline/:u2')
    async declineFriendRequest(@Param() params): Promise<any> {
        return this.friendService.declineFriendRequest(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Get(':user')
    async friendsList(@Param() params): Promise<IFriend[]> {
        return this.friendService.friendsList(
            await this.userService.findOne(params.user)
        );
    }

    @Get(':user/received-requests')
    async friendsRequests(@Param() params): Promise<IFriend[]>  {
        return this.friendService.friendsRequests(
            await this.userService.findOne(params.user)
        );
    }

    @Get(':u1/status/:u2')
    async friendsStatus(@Param() params): Promise<IFriend>  {
        return this.friendService.friendsStatus(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Put(':u1/block/:u2')
    async blockUser(@Param() params): Promise<IFriend> {
        return this.friendService.blockUser(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Put(':u1/unblock/:u2')
    async unblockUser(@Param() params): Promise<IFriend> {
        return this.friendService.unblockUser(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Get(':user/blocked-users')
    async getBlockedUsers(@Param() params) {
        return this.friendService.getBlockedUsers(
            await this.userService.findOne(params.user)
        );
    }
}
