import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FriendService } from './friend.service'

@Controller('friends')
export class FriendController {
    constructor(
        private friendService: FriendService) {}

    @Put(':u1/add/:u2')
    async addFriend(@Param() params) {
        this.friendService.addFriend(params.u1,params.u2);
    }
    
    @Put(':u1/remove/:u2')
    async unfriends(@Param() params) {
        this.friendService.unfriends(params.u1, params.u2);
    }
    
    @Put(':u1/accept/:u2')
    async acceptFriendRequest(@Param() params) {
        this.friendService.acceptFriendRequest(params.u1, params.u2);
    }

    @Put(':u1/decline/:u2')
    async declineFriendRequest(@Param() params) {
        this.friendService.declineFriendRequest(params.u1, params.u2);
    }

    @Get(':user')
    async friendsRelations(@Param() params) {
        return this.friendService.friendsRelations(params.user);
    }

    @Get(':user/received-requests')
    async friendsRequests(@Param() params) {
        return this.friendService.friendsRequests(params.user);
    }

    @Get(':u1/status/:u2')
    async friendsStatus(@Param() params) {
        return this.friendService.friendsStatus(params.u1, params.u2);
    }
}
