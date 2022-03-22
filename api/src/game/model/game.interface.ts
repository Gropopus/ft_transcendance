import { IPlayer } from "src/player/player.interface";
import { Iuser } from "src/user/model/user.interface";

export interface Igame {
	id?: number;
	
	player_left?: number;
	player_right?: number;

	score_l?: number;
	score_r?: number;
}