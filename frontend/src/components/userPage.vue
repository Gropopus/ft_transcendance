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
			<div v-if="userId != userData.id" class="relation">
				<button @click="sendMessage()">send a message</button>
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
		<div class="StatsWin">
			<div class="StatsTabs">
				<button class="tab"  @click="changeCurrent(0)" :id="isCurrentTab(0)"> Statistics </button>
				<button class="tab middle" @click="changeCurrent(1)" :id="isCurrentTab(1)"> Achievements </button>
				<button class="tab"  @click="changeCurrent(2)" :id="isCurrentTab(2)"> History </button>
			</div>
			<div class="StatsArea">
				<div v-if="currentTab==0" class="stat">
					<div class="statElem">
						<h3>Rank</h3>
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
				<div v-if="currentTab==1" class="achievements">
					<div class="achievementsTable">
						<div class="achievementsCol">
							<div>hello</div>
							<div>hello</div>
							<div>hello</div>
							<div>hello</div>
						</div>
						<div class="achievementsCol">
							<div>hello</div>
							<div>hello</div>
							<div>hello</div>
							<div>hello</div>
						</div>
						<div class="achievementsCol">
							<div>hello</div>
							<div>hello</div>
							<div>hello</div>
							<div>hello</div>
						</div>
					</div>
				</div>
				<div v-if="currentTab==2" class="history">
					<div class="histCats">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
					<div class="histElem">
						<div> Result </div>
						<div> UserLogin </div>
						<div> Opponent </div>
						<div> score 1 </div>
						<div> score 2 </div>
					</div>
				</div>
			</div>
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
			challengeIcon: {img: "/src/assets/challenge.png", title:"challenge"},
			blockIcon: {img: "/src/assets/plain-cat.png", title:'block '},
			unblockIcon: {img: "/src/assets/plain-cat.png", title:'unblock '},
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
		await this.update();
		this.picture = await this.getPicture();
		this.ladder = await this.fetchLadderLevel();
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
			console.log(`---${this.$route.params.username}`);
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
    			headers: { 'content-type': 'application/json' }
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

		async sendMessage() {
			const res = await fetch(
				`http://localhost:3000/api/channel/direct-message/${this.userId}/${this.userData.id}`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const data = await res.json();
			if (!data.items.length) {
				await fetch(
					`http://localhost:3000/api/channel/direct-message/new/${this.userId}/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
			}
			this.$router.replace('/chat');
		}
	},
})
</script>


<style lang="css" scoped>

	/*** PROFILE STYLES ***/
.StatsWin
{
	width:	100%;
	min-height:	500px;
	display:	flex;
	flex-direction:	column;
}

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
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-right: 5%;
	margin-top: auto;
	margin-bottom: auto;
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

/* stat style */

.StatsArea
{
	width:	100%;
	min-height:	500px;
	border: solid white 3px;
	border-top: none;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}

.stat {
	width: 90%;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: auto;
	margin-left: auto;
	border: solid 3px white;
	max-height:	500px;
	display: flex;
	flex-direction: column;
	font-size: 150%;
	overflow-y:	scroll;
	height: 90%;
}

.stat > .statElem {
	display: flex;
	gap: 4%;
	text-align: center;
	align-items: center;
}

.stat > .statElem > h3 {
	flex: 1 0;
	background: rgb(203, 177, 233, 0.2);
}

.stat > .statElem > p {
	flex: 1 0;
	font-size: 1.17em;
	background: rgb(203, 177, 233, 0.2);

}
.StatsTabs
{
	display:	flex;
	flex-direction:	row;
	border:	solid 3px white;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	width: 100%;
	overflow: hidden;
}

.middle
{
	border-right: solid 3px white !important;
	border-left: solid 3px white !important;
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
	padding-top: 1%;
	font-weight:	bold;
}

.StatsTabs > button:hover
{
	background:	var(--deep-blue-10);
	cursor: pointer; 
}

.StatsTabs #CurrentTab
{
	background:	white;
	color:	var(--font-blue);
}

.achievementsTable
{
	width: 90%%;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: 5%;
	margin-left: 5%;
	border: solid white 3px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow: scroll;
}

.achievementsCol
{
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100%;
	margin-top: 1%;
	margin-bottom: 1%;
}

.achievementsCol > div
{
	flex: 1 1 0;
	border: solid white 3px;
	margin-right: 7%;
	margin-left: 7%;
	max-width: 100px;
	flex: 1 0 auto;
	aspect-ratio: 1 / 1;
	border-radius: 5px;
}

.history
{
	width: 90%;
	display: inline-block;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: auto;
	margin-left: auto;
	max-height:	500px;
	overflow-y: scroll;
	border: solid 3px white;
}

.histCats
{
	display: flex;
	flex-direction: row;
	width: 100%;
	text-align: center;
	background: var(--white-10);
}

.histCats > div
{
	flex: auto;
}

.histElem
{
	display: flex;
	flex-direction: row;
	width: 100%;
	text-align: center;
	border-bottom: solid 1px white;
}

.histElem > div
{
	flex: auto;
}


</style>
