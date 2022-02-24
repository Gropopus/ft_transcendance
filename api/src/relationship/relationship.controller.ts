import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RelationshipService } from 'src/relationship/relationship.service'
@Controller('relationship')
export class RelationshipController {
    constructor(
        private rsService: RelationshipService) {}

    @Get(':u1/add/:u2')
    async addFriend(@Param() params) {
        this.rsService.addFriend(params.u1,params.u2);
    }
    
    @Get(':u1/unfriend/:u2')
    async unfriend(@Param() params) {
        this.rsService.unfriend(params.u1, params.u2);
    }
    
    @Get(':u1/accept/:u2')
    async acceptFriendRequest(@Param() params) {
        this.rsService.acceptFriendRequest(params.u1, params.u2);
    }

    @Get(':u1/refuse/:u2')
    async refuseFriendRequest(@Param() params) {
        this.rsService.refuseFriendRequest(params.u1, params.u2);
    }

    @Get(':u1/block/:u2')
    async blockUser(@Param() params) {
        this.rsService.blockUser(params.u1, params.u2);
    }

    @Get(':user/friendList')
    async getFriendList(@Param() params) {
        this.rsService.getFriendList(params.user);
    }
    @Get(':user/blockList')
    async getBlockList(@Param() params) {
        this.rsService.getBlockList(params.user);
    }
    @Get(':user/RequestList')
    async getRequestList(@Param() params) {
        this.rsService.getRequestList(params.user);
    }
}
