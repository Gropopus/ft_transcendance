import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FriendsService } from 'src/friends/friends.service'

@Controller('friends')
export class FriendsController {
    constructor(
        private rsService: FriendsService) {}

    @Put(':u1/add/:u2')
    async addFriend(@Param() params) {
        this.rsService.addFriend(params.u1,params.u2);
    }
    
    @Put(':u1/remove/:u2')
    async unfriends(@Param() params) {
        this.rsService.unfriends(params.u1, params.u2);
    }
    
    @Put(':u1/accept/:u2')
    async acceptFriendRequest(@Param() params) {
        this.rsService.acceptFriendRequest(params.u1, params.u2);
    }

    @Put(':u1/decline/:u2')
    async declineFriendRequest(@Param() params) {
        this.rsService.declineFriendRequest(params.u1, params.u2);
    }

    @Get(':user')
    async friendsRelations(@Param() params) {
        return this.rsService.friendsRelations(params.user);
    }

    @Get(':user/received-requests')
    async friendsRequests(@Param() params) {
        return this.rsService.friendsRequests(params.user);
    }

    @Get(':u1/status/:u2')
    async friendsStatus(@Param() params) {
        return this.rsService.friendsStatus(params.u1, params.u2);
    }
}
