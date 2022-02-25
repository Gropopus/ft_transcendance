import { Ichannel } from "src/chat/model/channel.interface";
import { Irelationship } from "src/relationship/relationship.interface";

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
    relationships?: Irelationship[];
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
