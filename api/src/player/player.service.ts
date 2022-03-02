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
        let player1: IPlayer = {
            user: user1,
        }
        let player2: IPlayer = {
            user: user2,
            opponent: player1.id,
            side: PlayerSide.RIGHT
        }
        player1.opponent = player2.id;
        await this.playerRepository.save(this.playerRepository.create(player1));
        await this.playerRepository.save(this.playerRepository.create(player2));
        return this.playerRepository.find({id: player1.id});
    }

    async setScores(pid: number, his_score: number, op_score: number) {
        await this.playerRepository.update({id : pid}, {
                points: his_score,
                status: (his_score > op_score ? PlayerStatus.WINNER : PlayerStatus.LOSER)
            });
        await this.playerRepository.update( {id : this.playerRepository.find({ id: pid})[0].opponent.id}, {
            points: op_score,
            status:  (op_score > his_score ? PlayerStatus.WINNER : PlayerStatus.LOSER)
        });
    }

    async playerStatistics(pid: number) {
        return this.playerRepository.find({ id: pid })[0];
    }
}
