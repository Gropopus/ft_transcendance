import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from 'src/player/player.entity'
import { IPlayer, PlayerStatus, PlayerSide } from 'src/player/player.interface'
import { Iuser } from 'src/user/model/user.interface';

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(PlayerEntity)
        private playerRepository: Repository<PlayerEntity>)
        {}

    //user1 is left, user2 is right
    async createGame(user1: Iuser, user2: Iuser, gid: number) {
        let iplayer1: IPlayer = {
            user: user1,
            username: user1.username,
            side: PlayerSide.LEFT,
            gameId: gid
        }
        let iplayer2: IPlayer = {
            user: user2,
            username: user2.username,
            side: PlayerSide.RIGHT,
            gameId: gid
        }
        let player1 = this.playerRepository.create(iplayer1);
        let player2 = this.playerRepository.create(iplayer2);
        await this.playerRepository.save(player1);
        await this.playerRepository.save(player2);
        player1.opponentId = player2.id;
        player2.opponentId = player1.id;
        await this.playerRepository.save(player1);
        await this.playerRepository.save(player2);
        return { p1: player1, p2: player2 };
    }

    async setScores(pid: number, his_score: number, op_score: number) {
        await this.playerRepository.update({id: pid}, {
                points: his_score,
                status: PlayerStatus.CANCELLED
            });
        const op_id = (await this.playerRepository.findOne({ id: pid})).opponentId;
        await this.playerRepository.update( {id: op_id}, {
            points: op_score,
            status: PlayerStatus.CANCELLED
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

    async getUserHistory(user: Iuser) {
        return this.playerRepository.find({ user: user })
    }

}
