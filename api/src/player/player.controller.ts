import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PlayerService } from './player.service'

@Controller('player')
export class PlayerController {
    constructor(
        private playerService: PlayerService,
        private userService: UserService) {}

    @Get(':pid/stat')
    async playerStat(@Param() params) {
        return this.playerService.playerStatistics(params.pid);
    }

    @Put(':u1/:u2/newP')
    async create_players(@Param() params) {
        return this.playerService.create(
            await this.userService.findOne(params.u1),
            await this.userService.findOne(params.u2))
    }

    @Put(':pid/scores')
    async setScores(@Param() params) {
        return this.playerService.setScores(params.pid, 1, 2);
    }
}