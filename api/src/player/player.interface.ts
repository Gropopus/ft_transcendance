import { UserI } from "src/user/model/user.interface";

export interface IPlayer {
    id?: number,
    user?: UserI,
    points?: number,
    status?: PlayerStatus,
    opponent?: IPlayer,
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
