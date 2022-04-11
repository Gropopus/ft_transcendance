import { Iuser } from "src/user/model/user.interface";

export interface IFriend {
    id?: number,
    user?: Iuser,
    target?: Iuser,
    status?: FriendStatus;
}

export enum FriendStatus {
    WAITING = 'user-waiting-for-a-response',
    PENDING = 'resquest-pending',
    FRIEND = 'friends',
    BLOCKED= 'user-blocked'
}
