
<template>
<div>
	<img style="width:3%; height:3%; vertical-align: middle;" src="../assets/magnifying-glass.png">
	<span style="vertical-align:middle; font-size: 25px "> Search for a friend:<br></span>
	<input type="text" v-model="search" v-on:keyup="searchUser()" class="textArea">
	<p class="friendFound" v-if="found" v-on:click="goToUserPage(found)"> {{ found }}</p>
	<div class="friendsPage">
		<br>
		<div  class="friendsArea">
			<h2>FRIENDS LIST</h2>
			<ul :key="friend.id" v-for="friend in friendList">
				<li> {{ friend.targetName }}
					<button @click="unfriend(friend.targetId)">
						delete
					</button>
				</li>
			</ul>
		</div>
		<div class="friendsArea">
			<h2>FRIENDS REQUESTS</h2>
			<ul :key="request.id" v-for="request in requestList">
				<li> {{ request.targetName }}
					<button @click="acceptRequest(request.targetId)">
						accept
					</button>
					<button @click="declineRequest(request.targetId)">
						decline
					</button>
				</li>
			</ul>
		</div>
		<div class="friendsArea">
			<h2>BLOCKED USERS</h2>
			<ul :key="blocked.id" v-for="blocked in blockedList">
				<li> {{ blocked.targetName }}
					<button @click="unblock(blocked.targetId)">
						unblock
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'friendsPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	emits: ['save'],

	data() {
		return {
			search: "",
			found: "",
			friendList: [],
			requestList: [],
			blockedList: []
		}
	},

	mounted() {
		this.friendList
		this.requestList
		this.blockedList
	},

	async created() {
		this.friendList = await this.fetchFriends()
		this.requestList = await this.fetchRequest()
		this.blockedList = await this.fetchBlocked()
	},

	methods: {
		async fetchFriends() {
			console.log('user id: ' + this.userId);
			const res = await fetch(`http://localhost:3000/api/friends/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data
		},

		async fetchRequest() {
			const res = await fetch(`http://localhost:3000/api/friends/${this.userId}/received-requests`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data
		},

		async fetchBlocked() {
			const res = await fetch(`http://localhost:3000/api/friends/${this.userId}/blocked-users`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data
		},

		async acceptRequest(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/accept/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.friendList = await this.fetchFriends();
			this.requestList = await this.fetchRequest();
		},
		async declineRequest(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/decline/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.requestList = await this.fetchRequest();
		},
		async unfriend(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unfriend/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.friendList = await this.fetchFriends();
		},
		async unblock(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unblock/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.friendList = await this.fetchFriends();
			this.blockedList = await this.fetchBlocked();
		},
		async goToUserPage(username: string) {
			this.$router.replace(`/${username}`)
		},

		async searchUser() {
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.search}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' }
			})
			const user = await res.json();
			console.log(user);
			if (res.status != 500)
				this.found = user[0].username;
			else
				this.found = "";	
		}
	},

})
</script>

<style lang="css">
.friendsArea
{
	float:	left;
	width:	32%;
	margin-left: 2%;
	min-height:	500px;
	max-height:	500px;
	overflow-y:	scroll;
	border:	solid 3px white;
	border-radius: 5px;
}

.friendsToolSpace
{
	float:	right;
	width:	25%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.friendsToolNav
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.textArea
{
	margin-top: 1%;
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
}
</style>
