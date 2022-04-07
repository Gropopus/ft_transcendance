<script setup lang="ts">
	import statsWindow from './statsWindow.vue'
</script>

<template>
	<div v-if="userData != undefined" class="user-profile">
		<!-- <button @click="reload()"> reload </button> -->
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="usermail"> {{userData.email }} </div>
				<div class="status"> {{ userData.status }} </div>
			</div>
			<div v-if="userId != userData.id" class="relation">
				<img v-if="!isBlocked()" @click="sendMessage()" src="/src/assets/message03.png" class="challengeButton"/>
				<img v-if="challengeIcon.img && userId != userData.id && !isBlocked()" :src="challengeIcon.img" class="challengeButton" @click="challenge()" :title="challengeIcon.title">
				<img v-if="friendIcon.img" :src="friendIcon.img"  @click="addOrRemovefriend()"  class="relationButton" :title="friendIcon.title" />
				<p v-else-if="relation=='resquest-pending'" class="pending">request <br> pending...</p>
				<div v-else-if="!isBlocked()" class="replyButton">
					<button @click="acceptRequest()">accept</button>
					<button @click="declineRequest()">decline</button>
				</div>
				<img v-if="blockIcon.img && !isBlocked()" :src="blockIcon.img" @click="blockUser()" class="blockButton" :title="blockIcon.title">
				<img v-else v-if="unblockIcon.img && this.userData" :src="unblockIcon.img" @click="unblock()" class="unblockButton" :title="unblockIcon.title">
			</div>
		</div>
		<statsWindow v-if="userData.id != undefined" :profId="userData.id"/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'userPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
	},
	data() {
		return {
			userData: [],
			relation: "",
			friendIcon: {img: "/src/assets/friends-requests.png", title:"add"},
			challengeIcon: {img: "/src/assets/challenge01.png", title:"challenge"},
			blockIcon: {img: "/src/assets/plain-cat.png", title:'block '},
			unblockIcon: {img: "/src/assets/plain-cat.png", title:'unblock '},
			relationIcon: "",
			picture: "",
		}
	},

	emits:	['userIsOnline'],

	async mounted() {
		this.userData;
		this.relation;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.picture = await this.getPicture();
		await this.update();
	},

    async updated() {
        await this.$emit('userIsOnline', this.userId);
    },

	methods: {
		async update() {
			this.userData = await this.fetchUserData();
			this.relation = await this.fetchRelation();
			if (this.isFriend())
				this.friendIcon = {img: "/src/assets/muted-users.png", title: "remove friend"};
			else if (!this.relation)
				this.friendIcon = {img: "/src/assets/friends-requests.png", title:"add friend"};
			else
				this.friendIcon = {img: "", title: this.relation};
		},

		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.$route.params.username}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const data = await res.json();
			for (let elem of data)
				if (this.$route.params.username == elem.username)
				{
					this.blockIcon.title += elem.username;
					this.unblockIcon.title += elem.username;
					return elem;
				}
		},

		async fetchRelation() {
			return await fetch(`http://localhost:3000/api/friends/${this.userId}/status/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			.then(res => {
				return res.json();}
			)
			.then((resJson) => {
				return resJson.status;
			})
			.catch(error => {
				return "";
			});
		},

		async addOrRemovefriend(){
			if (this.isFriend()) {
				await fetch(`http://localhost:3000/api/friends/${this.userId}/unfriend/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
			}
			else if (!this.relation) {
				await fetch(`http://localhost:3000/api/friends/${this.userId}/add/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
			}
			this.update();
		},

		async blockUser(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/block/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		async unblock(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unblock/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		async acceptRequest(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/accept/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		async declineRequest(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/decline/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		isFriend() {
			if (this.relation == "friends")
				return true;
			return false;
		},

		isBlocked() {
			if (this.relation == "user-blocked")
				return true;
			return false;
		},

		async getPicture()
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userData.id}`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
    		return blobUrl;
		},

		async challenge() {
			// /challenge/:challengeMode/:challengeId
			const ret = await fetch(` http://localhost:3000/api/game/newchallengeid/`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const challengeId = await ret.json();
			this.$router.push('/challenge/normal/' + challengeId);

			return "";
		},

		async sendMessage() {
			let res = await fetch(
				`http://localhost:3000/api/channel/direct-message/${this.userId}/${this.userData.id}`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			let data = await res.json();
			if (!data.items.length) {
				res = await fetch(
					`http://localhost:3000/api/channel/direct-message/new/${this.userId}/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
				data = await res.json();
				this.$router.push({path: '/chat', query: {id: data.id}});
			}
			else
				this.$router.push({path: '/chat', query: {id: data.items[0].id}});
		},
	},
})
</script>

<style lang="css" scoped>

	/*** PROFILE STYLES ***/
.profilePage
{
	background:	linear-gradient(135deg, var(blue), var(--main-color-2))	fixed;
	flex-direction:	row;
	text-align: center;
	margin-right: 5%;
	margin-left: 5%;
	margin-bottom: 0%;
}

.profile-resume {
	display: flex;
	flex-direction: row;
	gap: 3%;
	/* flex: 1 1 0; */
	min-width: 1300px;
	border: solid 3px white;
	margin-bottom: 2%;
	align-content: center;
	border-radius: 5px;
}

.info
{
	flex: 4;
	display: flex;
	flex-direction:	column;
	margin-top: 4%;
	margin-bottom: 2%;
	text-align: left;
	vertical-align: center;
	min-width: 350px;
}

.username {
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	300%;
	color: var(--font-blue);
	font-weight:	bold;
}

.usermail{
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
}

.perso-info
{
	flex: 1;
	margin-right: 3%;
	display: flex;
	flex-direction:	column;
	margin-top: 2%;
	margin-bottom: 2%;
	vertical-align: center;
}

.status {
	flex: 1;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
	color: green;
}

.perso-info > button
{
	flex: 5;
	background: none;
	border: solid 3px white;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
	color: white;
	padding-top: 2%;
	margin: 20%;
	margin-top: 30%;
}

.perso-info > button:hover
{
	background: rgba(255, 255, 255, 0.5);
	cursor: pointer; 
}

.picture {
	flex: 1;
	width: calc(33.333% - 1rem);
    vertical-align: center;
	margin-left: 3%;
	margin-top: 2%;
	margin-bottom: 2%;
}

.picture > img {
	/*margin-left: 2%;
	margin-bottom: 2%;
	margin-top: 2%;
	min-height: 150px;
	min-width: 150px;*/
	border-radius: 50%;
	overflow: hidden;
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
	object-fit:cover;
}

.relation {
	flex: 2;
	display: flex;
	flex-direction: row;
	justify-content: center;
	min-width: 400px;
	margin-right: 5%;
	/*margin-left:auto;*/
	margin-top: auto;
	margin-bottom: auto;
}

.relation > img	{
	object-fit: contain;
}

.challengeButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	display: flex;
	align-items: center;
	border-radius: 50%;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	max-height: 70px;
	height: auto;
	width: auto;
	padding: 3%;
	border: solid 2px white;
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}

.challengeButton:hover {
	background:	var(--deep-blue-10);
	color: white;
	cursor: pointer;
}

.relationButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	border-radius: 50%;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	max-height: 70px;
	height: auto;
	width: auto;
	padding: 3%;
	border: solid 2px white
}

.relationButton:hover {
	background:	var(--deep-blue-10);
	color: white;
	cursor: pointer;

}

.user-profile {
	flex-direction:	row;
	text-align: center;
	margin-right: 5%;
	margin-left: 5%;
	margin-bottom: 0%;
}

.replyButton {
	display: flex;
	flex-direction: column;
	justify-content: right;
}

.replyButton > button {
	border-radius: 8px;
	background:	none;
	border: none;
	border: solid 2px white;
	font-family: MyanmarText;
	letter-spacing:	2px;
	color: white;
	margin-top: 5%;
}

.replyButton > button:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
}

.blockButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	border-radius: 50%;
	max-height: 70px;
	height: auto;
	width: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	background: linear-gradient(135deg, transparent 49%, white 49% 51%, transparent 51% 100%);
	padding: 3%;
	border: solid 2px white
}

.blockButton:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
	background: linear-gradient(135deg, var(--deep-blue-10) 49%, white 49% 51%, var(--deep-blue-10) 51% 100%);
}


.unblockButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	border-radius: 50%;
	max-height: 70px;
	height: auto;
	width: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	padding: 3%;
	border: solid 2px white
}

.unblockButton:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
}
</style>
