export interface IFriend {
    id?: number,
    user?: number,
    target?: number;
    status?: FriendStatus;
}

export enum FriendStatus {
    WAITING = 'waiting-for-a-response',
    PENDING = 'pending-(no-response)',
    FRIEND = 'friends'
}
