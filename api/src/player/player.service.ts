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
        let iplayer1: IPlayer = {
            user: user1,
        }
        let iplayer2: IPlayer = {
            user: user2,
            side: PlayerSide.RIGHT
        }
        let player1 = this.playerRepository.create(iplayer1);
        let player2 = this.playerRepository.create(iplayer2);
        await this.playerRepository.save(player1);
        await this.playerRepository.save(player2);
        player1.opponentId = player2.id;
        player2.opponentId = player1.id;
        await this.playerRepository.save(player1);
        await this.playerRepository.save(player2);
        return player1;
    }

    async setScores(pid: number, his_score: number, op_score: number) {
        await this.playerRepository.update({id: pid}, {
                points: his_score
            });
        const op_id = (await this.playerRepository.findOne({ id: pid})).opponentId;
        await this.playerRepository.update( {id: op_id}, {
            points: op_score
        });
        return this.playerRepository.findOne({ id: pid });
    }

    async setFinalScores(pid: number, his_score: number, op_score: number) {
        await this.playerRepository.update({id: pid}, {
                points: his_score,
                status: (his_score > op_score ? PlayerStatus.WINNER : PlayerStatus.LOSER)
            });
        const op_id = (await this.playerRepository.findOne({ id: pid})).opponentId;
        await this.playerRepository.update( {id: op_id}, {
            points: op_score,
            status:  (op_score > his_score ? PlayerStatus.WINNER : PlayerStatus.LOSER)
        });
        // return this.playerRepository.findOne({ id: pid });
    }

    async getPlayer(pid: number) {
        return this.playerRepository.findOne({ id: pid });
    }
}
