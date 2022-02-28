import { Ichannel } from "src/chat/model/channel.interface";
import { IFriend } from "src/friends/friends.interface";

export interface UserI {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
	ban?: boolean;
    avatar?: string;
    level?: number;
    status?: UserStatus;
    role?: UserRole;
	nbWin?: number;
	school42id?: number;
	nbLoss?: number;
	twoFactorAuthEnabled?: boolean;
	twoFactorAuthenticationSecret?: string;
	chatOwner?: Ichannel[];
    friends?: IFriend[];
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
