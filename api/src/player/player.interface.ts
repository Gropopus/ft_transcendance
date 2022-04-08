import { Iuser } from "src/user/model/user.interface";

export interface IPlayer {
    id?: number,
    user?: Iuser,
    username?: string,
    points?: number,
    status?: PlayerStatus,
    opponentId?: number,
    side?: PlayerSide,
    gameId?: number
}

export enum PlayerStatus {
    PLAYING = "game-in-progress",
    WINNER = "won-the-game",
    LOSER = "lost-the-game",
    CANCELLED = "cancelled-game"
}

export enum PlayerSide {
    LEFT = "left-player",
    RIGHT = "right-player",
}
