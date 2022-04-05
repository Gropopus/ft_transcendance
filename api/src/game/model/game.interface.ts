import { IPlayer } from "src/player/player.interface";

export interface Igame {
	id?: number;
	
	player_left_id?: IPlayer;
	player_right_id?: IPlayer;

	score_l?: number;
	score_r?: number;

	status?: gameStatus;
	mode?: gameMode;
}
export enum gameStatus {
    PLAYING = "playing",
    CANCEL = "cancel",
	FINISH = "finish"
}
export enum gameMode {
    NORMAL = "normal",
    HARD = "hard"
}