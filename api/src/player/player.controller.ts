import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PlayerService } from './player.service'

@Controller('player')
export class PlayerController {
    constructor(
        private playerService: PlayerService,
        private userService: UserService) {}

    @Get(':pid')
    async playerStat(@Param() params) {
        return this.playerService.getPlayer(params.pid);
    }

    @Put('create/:u1/:u2')
    async create_players(@Param() params) {
        return this.playerService.create(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2))
    }

    @Put(':pid/setscores')
    async setScores(@Param() params) {
        return this.playerService.setScores(params.pid, 1, 2);
    }

    @Put(':pid/finalscores')
    async setFinalScores(@Param() params) {
        return this.playerService.setScores(params.pid, 5, 6);
    }
}