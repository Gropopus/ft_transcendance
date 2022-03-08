import { Iuser } from "../user/user.interface";

export interface IPlayer {
    id?: number,
    user?: Iuser,
    points?: number,
    status?: PlayerStatus,
    opponentId?: number,
    side?: PlayerSide
}

export enum PlayerStatus {
    PLAYING = "game-in-progress",
    WINNER = "won-the-game",
    LOSER = "lost-the-game"
}

export enum PlayerSide {
    LEFT = "left-player",
    RIGHT = "right-player",
}
