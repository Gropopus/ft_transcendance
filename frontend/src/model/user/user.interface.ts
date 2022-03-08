import { Ichannel } from "../chat/channel.interface";
import { IFriend } from "../friend/friend.interface";
import { IPlayer } from "../player/player.interface";

export interface Iuser {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
	ban?: boolean;
    picture?: string;
    level?: number;
    status?: UserStatus;
    role?: UserRole;
	victory?: number;
	id42?: number;
	defeat?: number;
	twoFactorAuthEnabled?: boolean;
	twoFactorAuthenticationSecret?: string;
	chatOwner?: Ichannel[];
    friends?: IFriend[];
    history?: IPlayer[];
}

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    USER = 'user',
}

export enum UserStatus {
    ON = 'online',
    OFF = 'offline',
    GAME = 'in-game'
}