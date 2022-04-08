import { Ichannel } from "src/chat/model/channel.interface";
import { IFriend } from "src/friend/friend.interface";
import { IPlayer } from "src/player/player.interface";

export interface Iuser {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
	ban?: boolean;
    picture?: string;
    level?: number;
    status?: UserStatus;
	victory?: number;
	id42?: number;
	defeat?: number;
    lastTask?: number;
	twoFactorAuthEnabled?: boolean;
	twoFactorAuthenticationSecret?: string;
	chatOwner?: Ichannel[];
    friends?: IFriend[];
    target?: IFriend[];
    history?: IPlayer[];
}

export enum UserStatus {
    ON = 'online',
    OFF = 'offline',
    GAME = 'in-game'
}