import { IPlayer } from "src/player/player.interface";
import { Iuser } from "src/user/model/user.interface";

export interface Igame {
	id?: number;
	
	player_left_id?: IPlayer;
	player_right_id?: IPlayer;

	score_l?: number;
	score_r?: number;

	status?: gameStatus;
}
export enum gameStatus {
    PLAYING = "playing",
    CANCEL = "cancel",
	FINISH = "finish"
}