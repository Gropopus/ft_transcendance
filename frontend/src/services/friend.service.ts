import axios from 'axios'
// import { url } from 'inspector';

export class FriendService {
    constructor(
        private axiosFriend = axios.create({ baseURL: 'http://localhost:4200/api/friends'}),
    ) {}

    async addFriend(userId1: number, userId2: number) {
        return await this.axiosFriend.put(`/${userId1}/add/${userId2}`);
    }
    
    async unfriends(userId1: number, userId2: number) {
        return await this.axiosFriend.put(`/${userId1}/remove/${userId2}`);
    }
    
    async acceptFriendRequest(userId1: number, userId2: number) {
        return await this.axiosFriend.put(`/${userId1}/accept/${userId2}`);
    }
    
    async declineFriendRequest(userId1: number, userId2: number) {
        return await this.axiosFriend.put(`/${userId1}/decline/${userId2}`);
    }
    
    async friendsRelations(userId: number) {
        return await this.axiosFriend.get(`/${userId}`);
    }
    
    async friendsRequests(userId: number) {
        return await this.axiosFriend.get(`/${userId}/received-requests`);
    }
    
    async friendsStatus(userId1: number, userId2: number) {
        return await this.axiosFriend.get(`/${userId1}/status/${userId2}`);
    }
    
    async blockUser(userId1: number, userId2: number) {
        return await this.axiosFriend.put(`/${userId1}/block/${userId2}`);
    }
    
    async unblockUser(userId1: number, userId2: number) {
        return await this.axiosFriend.put(`/${userId1}/unblock/${userId2}`);
    }
    
    async getBlockedUsers(userId: number) {
        return await this.axiosFriend.get(`/${userId}/blocked-users`);
    }
}

export const friendService = new FriendService();
