import { http } from '@/http-common';
import { Iuser } from '../model/user/user.interface'

export class friendService {
    constructor(
    ) {}

    addFriend(u1: Iuser, u2: Iuser) {
        return http.put('api/friends/' + u1.id + '/add/' + u2.id);;
    }
    
    unfriends(u1: Iuser, u2: Iuser) {
        return http.put('api/friends/' + u1.id + '/remove/' + u2.id);
    }
    
    acceptFriendRequest(u1: Iuser, u2: Iuser) {
        return http.put('api/friends/' + u1.id + '/accept/' + u2.id);
    }

    declineFriendRequest(u1: Iuser, u2: Iuser) {
        return http.put('api/friends/' + u1.id + '/decline/' + u2.id);
    }
    
    friendsRelations(u: Iuser) {
        return http.get('api/friends/' + u.id);
    }
    
    friendsRequests(u: Iuser) {
        return http.get('api/friends/' + u.id + '/received-requests');
    }
    
    friendsStatus(u1: Iuser, u2: Iuser) {
        return http.get('api/friends/' + u1.id + '/status/' + u2.id);
    }
    
    blockUser(u1: Iuser, u2: Iuser) {
        return http.put('api/friends/' + u1.id + '/block/' + u2.id);
    }
    
    unblockUser(u1: Iuser, u2: Iuser) {
        return http.put('api/friends/' + u1.id + '/unblock/' + u2.id);
    }
    
    getBlockedUsers(u: Iuser) {
        return http.get('api/friends/' + u.id + '/blocked-users');
    }
}
