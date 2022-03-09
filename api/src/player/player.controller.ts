import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PlayerService } from './player.service'

@Controller('history')
export class PlayerController {
    constructor(
        private playerService: PlayerService,
        private userService: UserService) {}

    @Get('player/:playerId')
    async playerStat(@Param() params) {
        return this.playerService.getPlayer(params.playerId);
    }
    
    @Get(':userId')
    async UserHistory(@Param() params) {
        return this.playerService.getUserHistory(await this.userService.findOne(params.userId));
    }
}