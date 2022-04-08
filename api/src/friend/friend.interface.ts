import { Iuser } from "src/user/model/user.interface";

export interface IFriend {
    id?: number,
    user?: Iuser,
    target?: Iuser,
    targetName?: string,
    targetId?: number,
    status?: FriendStatus;
}

export enum FriendStatus {
    WAITING = 'user-waiting-for-a-response',
    PENDING = 'resquest-pending',
    FRIEND = 'friends',
    BLOCKED= 'user-blocked'
}
