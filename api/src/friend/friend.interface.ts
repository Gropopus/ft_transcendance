import { Iuser } from "src/user/model/user.interface";

export interface IFriend {
    id?: number,
    user?: Iuser,
    targetId?: number;
    status?: FriendStatus;
}

export enum FriendStatus {
    WAITING = 'waiting-for-a-response',
    PENDING = 'pending-(no-response)',
    FRIEND = 'friends'
}
