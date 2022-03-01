import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from 'src/player/player.entity'
import { IPlayer, PlayerStatus, PlayerSide } from 'src/player/player.interface'
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(PlayerEntity)
        private playerRepository: Repository<PlayerEntity>)
        {}

    async create(user1: UserI, user2: UserI) {
        let player1 = {
            user: user1,
            opponent: {}
        }
        let player2 = {
            user: user2,
            opponent: player1,
            side: PlayerSide.RIGHT
        }
        player1.opponent = player2;
        const player = await this.playerRepository.save(this.playerRepository.create(player1));
        await this.playerRepository.save(this.playerRepository.create(player2));
        return this.playerRepository.find({id: player.id});
    }

    async setScores(pid: number, his_score: number, op_score: number) {
    }

    async playerStat(pid: number) {
        return this.playerRepository.find({ id: pid });
    }
}