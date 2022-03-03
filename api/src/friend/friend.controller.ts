import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { FriendService } from './friend.service'

@Controller('friends')
export class FriendController {
    constructor(
        private friendService: FriendService,
        private userService: UserService) {}

    @Put(':u1/add/:u2')
    async addFriend(@Param() params) {
        this.friendService.addFriend(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }
    
    @Put(':u1/remove/:u2')
    async unfriends(@Param() params) {
        this.friendService.unfriends(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }
    
    @Put(':u1/accept/:u2')
    async acceptFriendRequest(@Param() params) {
        this.friendService.acceptFriendRequest(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Put(':u1/decline/:u2')
    async declineFriendRequest(@Param() params) {
        this.friendService.declineFriendRequest(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }

    @Get(':user')
    async friendsRelations(@Param() params) {
        return this.friendService.friendsRelations(
            await this.userService.findOne(params.user)
        );
    }

    @Get(':user/received-requests')
    async friendsRequests(@Param() params) {
        return this.friendService.friendsRequests(
            await this.userService.findOne(params.user)
        );
    }

    @Get(':u1/status/:u2')
    async friendsStatus(@Param() params) {
        return this.friendService.friendsStatus(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2)
        );
    }
}
