<template>
	<div class="user-profile">
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
			<div v-if="userId != userData.id && !isBlocked()" class="challengeButton">
				<p @click="challenge()" >challenge</p>
			</div>
			<div v-if="userId != userData.id" class="relation">
				<img v-if="friendIcon.img" :src="friendIcon.img"  @click="addOrRemovefriend()"  class="relationButton" :title="friendIcon.title" />
				<p v-else-if="relation=='resquest-pending'" class="pending">request <br> pending...</p>
				<div v-else-if="!isBlocked()" class="replyButton">
					<button @click="acceptRequest()">accept</button>
					<button @click="declineRequest()">decline</button>
				</div>
			</div>
		</div>
		<div class="StatsWin">
			<div class="StatsTabs">
				<button class="tab"  @click="changeCurrent(0)" :id="isCurrentTab(0)"> Statistics </button>
				<button class="tab middle" @click="changeCurrent(1)" :id="isCurrentTab(1)"> Achievements </button>
				<button class="tab"  @click="changeCurrent(2)" :id="isCurrentTab(2)"> History </button>
			</div>
			<div class="StatsArea">
				<div v-if="currentTab==0" class="stat">
					<div class="statElem">
						<h3>Ladder level</h3>
						<p>{{ ladder.level }} / {{ ladder.total }}</p>
					</div>
					<div class="statElem">
						<h3>Victories</h3>
						<p>{{ userData.victory }}</p>
					</div>
					<div class="statElem">
						<h3>Defeats</h3>
						<p>{{ userData.defeat }}</p>
					</div>
				</div>
			</div>
		</div>
		<div v-if="userId != userData.id && !isBlocked()" @click="blockUser()" class="blockButton">
			block {{ userData.username}}
		</div>
		<div v-else-if="userId != userData.id" @click="unblock()" class="blockButton">
			unblock {{ userData.username}}
		</div>
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

	emits: ['save'],

	data() {
		return {
			userData: [],
			relation: "",
			friendIcon: {img: "/src/assets/friends-requests.png", title:"add"},
			blockIcon: "/src/assets/your-friends.png",
			relationIcon: "",
			currentTab: 0,
			picture: "",
			ladder: 0,
		}
	},

	mounted() {
		this.userData;
		this.relation;
		this.ladder;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.picture = await this.getPicture();
		this.ladder = await this.fetchLadderLevel();
	},

	async updated() {
		this.relation = await this.fetchRelation();
		if (this.isFriend())
			this.friendIcon = {img: "/src/assets/muted-users.png", title: "remove friend"};
		else if (!this.relation)
			this.friendIcon = {img: "/src/assets/friends-requests.png", title:"add friend"};
		else
			this.friendIcon = {img: "", title: this.relation};
	},

	methods: {
		async fetchUserData() {
			console.log(`---${this.$route.params.username}`);
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.$route.params.username}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const data = await res.json();
			for (let elem of data)
				if (this.$route.params.username == elem.username)
					return elem;
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

		async fetchLadderLevel() {
			const res = await fetch(`http://localhost:3000/api/users/ladder-level/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const ladder = await res.json();
			return ladder;
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
		},

		async blockUser(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/block/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.userData = await this.fetchUserData();
		},

		async unblock(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unblock/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.userData = await this.fetchUserData();
		},

		async acceptRequest(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/accept/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
		},

		async declineRequest(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/decline/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
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

		changeCurrent(index: number) {
			this.currentTab = index;
		},

		isCurrentTab(tab: number) {
			if (this.currentTab == tab)
				return "CurrentTab";
			else
				return "notCurrentTab";
		},

		async getPicture()
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userData.id}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
			console.log(blobUrl);
    		return blobUrl;
		},

		async challenge() {
			return "";
		},
	},
})
</script>


<style lang="css" scoped>

	/*** PROFILE STYLES ***/

.user-profile {
	flex-direction:	row;
	text-align: center;
	margin-right: 5%;
	margin-left: 5%;
	margin-bottom: 0%;
}

.profile-resume {
	display: flex;
	flex-direction:	row;
	gap: 3%;
	/* flex: 1 1 0; */
	border: solid 3px white;
	margin-bottom: 2%;
	align-content: center;
}

.info {
	display: flex;
	flex-direction:	column;
	margin-bottom: 2%;
	margin-top: 2%;
	height: 50%;
}

.username {
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	300%;
	color: var(--font-blue);
	font-weight:	bold;
	margin-top: 10%;
}

.status {
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	100%;
}

/*.picture {
	margin-left: 4%;
	margin-bottom: 2%;
	margin-top: 2%;
}*/

.picture {
	margin-top: 2%;
	width: calc(33.333% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3rem;
	margin-bottom: 15%;
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
	display: flex;
	justify-content: right;
}

.challengeButton {
	flex:	1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.challengeButton > p {
	appearance: none;
	border-radius: 40em;
	background-color: white;
	box-shadow: rgb(225, 198, 228) 0 -12px 6px inset;
	border-style: none;
	box-sizing: border-box;
	color: var(--font-blue);
	cursor: pointer;
	display: inline-block;
	font-family: -apple-system,sans-serif;
	font-size: 1.2rem;
	font-weight: 700;
	letter-spacing: -.24px;
	margin: 0;
	outline: none;
	padding: 1rem 1.3rem;
	quotes: auto;
	text-align: center;
	text-decoration: none;
	transition: all .15s;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}

.challengeButton > p:hover {
	background-color: rgb(255, 228, 113);
	box-shadow: rgb(250, 168, 120) 0 -6px 8px inset;
	transform: scale(1.125);
}


.relation {
	margin-right: 5%;
	display: flex;
	align-items: center;
}

.relationButton {
	border-radius: 8px;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	height: 70px;
	border: solid 2px white
}

.relationButton:hover {
	background:	var(--deep-blue-10);
	color: white;
	cursor: pointer;

}

/* stat style */

.StatsArea
{
	/* width:	100%;
	min-height:	500px;
	border-radius: 5px; */
	overflow-y:	scroll;
	/* max-height:	500px; */
}

.StatsTabs
{
	display:	flex;
	flex-direction:	row;
	border:	solid 3px white;
	border-top-right-radius: 20px;
	border-top-left-radius: 20px;
	width: 100%;
	overflow: hidden;
}

.StatsTabs > button
{
	background: none;
	border: none;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
}

.middle
{
	border-right: solid 3px white !important;
	border-left: solid 3px white !important;
}

.StatsTabs > button:hover
{
	background:	var(--deep-blue-10);
}

.StatsTabs #CurrentTab
{
	background:	white;
	color:	var(--font-blue);
	font-weight:	bold;
}

.stat {
	display: flex;
	flex-direction: column;
	font-size: 150%;
}

.stat > .statElem {
	display: flex;
	gap: 4%;
	text-align: center;
	align-items: center;
	margin-left: 5%;
	margin-right: 5%;
}
.stat > .statElem > h3 {
	flex: 1 0;
	margin-bottom:6%;
	margin-top: 6%;
	height: 100%;
	background: rgb(203, 177, 233, 0.2);
}

.stat > .statElem > p {
	flex: 1 0;
	height: 100%;
	margin-top: 6%;
	margin-bottom:6%;
	font-size: 1.17em;
	background: rgb(203, 177, 233, 0.2);

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
	display: flex;
	justify-content: center;
	margin-top: 5%;
	color: red;
	border: solid 3px white;
}

.blockButton:hover {
	text-decoration: underline;
	cursor: pointer;
}

</style>
