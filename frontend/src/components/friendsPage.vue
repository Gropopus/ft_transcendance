
<template>
<div style="width: 93%; display: flex; flex-direction: column">
	<div class="header-friends">
		<img style="width: 280px; height: 150px; margin-left: 5%; margin-top: 10px" src="/src/assets/header-id.png" />
		<div class="searchBar">
			<div style="display: flex; justify-content: right">
				<img style="width: 3%; min-height: 40px; min-width: 50px" src="../assets/magnifying-glass.png">
				<span style="font-size: 25px; text-align: right; margin-left: 1%"> Search a user</span>
			</div>
			<input type="text" v-model="search" v-on:keyup="searchUser()" class="textArea1">
			<div class="friendFound" v-if="found.length"  :key="elem.id" v-for="elem in found">
				<p v-on:click="goToUserPage(elem.username)"> {{ elem.username }}</p>
			</div>
		</div>
	</div>
	<div class="friendsPage">
		<div :key="relation.type" v-for="relation in all" class="friendsArea">
			<div class="listName">
				{{ relation.type }}
				<div class="icon">
					<img :src="relation.icon"/>
				</div>
				<button @click="setDiplayState(relation.type)"  class="arrow">
					<img v-if="relation.status==0" src="/src/assets/arrow-whitedown.png"/>
					<img v-else src="/src/assets/arrow-white-up.png" />
				</button>
			</div>
				<div v-if="relation.status == 1 && relation.list.length" class="listArea">
					<div  :key="elem.id"  v-for="elem in relation.list" class="elem">
						<div class="friend-username" @click="goToUserPage(elem.targetName)">
							{{ elem.targetName }}
						</div>
						<div class="replyButton">
							<button v-if="relation.type==all[1].type" @click="acceptRequest(elem.targetId)">accept</button>
							<button v-if="relation.type==all[1].type" @click="declineRequest(elem.targetId)">decline</button>
						</div>
					</div>
				</div>
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

	data() {
		return {
			search: "",
			found: [],
			all: [
				{type: "Your friends", icon: "/src/assets/your-friends01.png", list: [], status: 1},
				{type: "Friends requests", icon: "/src/assets/friends-requests.png", list: [], status: 1},
				{type: "Blocked users", icon: "/src/assets/muted-users.png", list: [], status: 1}
			]
		}
	},

	mounted() {
		this.all;
	},

	async created() {
		this.all[0].list = await this.fetchFriends();
		this.all[1].list = await this.fetchRequest();
		this.all[2].list = await this.fetchBlocked();
	},

	methods: {
		async fetchFriends() {
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
			this.all[0].list = await this.fetchFriends();
			this.all[1].list = await this.fetchRequest();
		},
		async declineRequest(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/decline/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.all[1].list = await this.fetchRequest();
		},
		async unfriend(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unfriend/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.all[0].list = await this.fetchFriends();
		},
		async unblock(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unblock/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.all[0].list = await this.fetchFriends();
			this.all[2].list = await this.fetchBlocked();
		},
		async goToUserPage(username: string) {
			this.$router.push(`/profile/${username}`)
		},

		async searchUser() {
			if (!this.search)
			{
				this.found = [];
				return [];
			}
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.search}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' }
			})
			.then(res => {
				return res.json();
			})
			.then((resJson) => {
				this.found = resJson;
				return resJson;
			})
			.catch(error => {
				this.found = [];
				return [];
			});
		},

		setDiplayState(type: string) {
			for (let elem of this.all)
				if (elem.type == type)
					elem.status = 1 - elem.status;
		}
	},

})
</script>

<style lang="css">

.friendsPage {
	display: flex;
	flex-direction: column;
	margin-top: 2%;
}

.header-friends {
	display: flex;
}

.searchBar {
	display: flex;
	flex: 1 0;
	flex-direction: column;
	justify-content: right;
}

.friendsArea
{
	float:	left;
	overflow-y:	scroll;
	margin-top: 5%;
	margin-left: 2%;
	margin-right: 2%;
	margin-bottom: 2%;
	font-family: MyanmarText;
	letter-spacing:	2px;
}

.friendsArea > .listName {
	display:flex;
	flex-direction: row;
	text-align: left;
	border-bottom: solid 2px white;
	margin-bottom: 0px;
	font-size: 30px;
	gap: 2%;
}

.icon > img {
	width: 50px;
}

.arrow {
	flex: 1 1 0;
	background: none;
	border: none;
	display: flex;
	justify-content: right;
}

.arrow > img {
	width: 40px;
}

.arrow > img:hover {
	cursor: pointer;
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

.textArea1
{
	float: left;
	margin-top: 0%;
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
	margin-left: auto;
	margin-right: 0px;
}

.friendFound {
	text-align: right;
	font-family: MyanmarText;
	letter-spacing:	2px;
}

.friendFound:hover {
	text-decoration: underline;
	cursor: pointer;
}

.listArea {
	font-family: MyanmarText;
	letter-spacing:	2px;
	border:	solid 2px white;
	/* border-top: none; */
}

.listArea > .elem {
	display: flex;
	flex-direction: row;
	margin-left: 3%;
	margin-right: 3%;
	margin-top: 1%;
	margin-bottom: 1%;
}

.listArea > .elem > .friend-username:hover {
	background:	var(--deep-blue-10);
}

.listArea > .elem > .friend-username {
	flex: 1 0;
}

.listArea > .elem > .replyButton {
	display: flex;
	flex-direction: row;
	justify-content: right;
}

.listArea > .elem > .replyButton > button {
	background:	none;
	border: none;
	border: solid 2px white;
	font-family: MyanmarText;
	letter-spacing:	2px;
	color: white;
	margin-left: 3%;
}

.listArea > .elem > .replyButton > button:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
}

</style>