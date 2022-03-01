import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PlayerService } from './player.service'

@Controller('player')
export class PlayerController {
    constructor(
        private playerService: PlayerService) {}
}