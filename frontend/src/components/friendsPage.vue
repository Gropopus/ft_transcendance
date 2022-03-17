
<template>
	<div class="friendsPage">
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
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	emits: ['save'],

	data() {
		return {
			friendList: [],
			requestList: [],
			blockedList: []
		}
	},

	mounted() {
		this.friendList
		this.requestList
		this.blockedList
		console.log(`the component is now mounted.`)
	},

	async created() {
		this.friendList = await this.fetchFriends()
		this.requestList = await this.fetchRequest()
		this.blockedList = await this.fetchBlocked()
		console.log('created :')
		console.log(this.blockedList)
	},

	methods: {
		async fetchFriends() {
			const res = await fetch(`http://localhost:3000/api/friends/1`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data
		},

		async fetchRequest() {
			const res = await fetch(`http://localhost:3000/api/friends/1/received-requests`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data
		},

		async fetchBlocked() {
			const res = await fetch(`http://localhost:3000/api/friends/1/blocked-users`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data
		},

		async acceptRequest(targetId: number){
			await fetch(`http://localhost:3000/api/friends/1/accept/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},
		async declineRequest(targetId: number){
			await fetch(`http://localhost:3000/api/friends/1/decline/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},
		async unfriend(targetId: number){
			await fetch(`http://localhost:3000/api/friends/1/unfriend/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},
		async unblock(targetId: number){
			await fetch(`http://localhost:3000/api/friends/1/unblock/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},
	},
})
</script>

<style lang="css">
.friendsArea
{
	float:	left;
	width:	30%;
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
</style>
