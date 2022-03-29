<template>
	<div class="user-profile">
		<!-- <button @click="reload()"> reload </button> -->
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="status"> {{ userData.status }} </div>
			</div>
			<div class="challengeButton">
				<p @click="challenge()" >challenge</p>
			</div>
			<div class="relation">
				<img v-if="friendIcon.img" :src="friendIcon.img"  @click="addOrRemovefriend()"  class="relationButton"/>
				<p v-else-if="relation=='resquest-pending'" class="pending">request in <br> pending...</p>
				<div v-else class="replyButton">
					<button @click="acceptRequest()">accept</button>
					<button @click="declineRequest()">decline</button>
				</div>
			</div>
		</div>
		<div class="StatsWin">
			<div class="StatsTabs">
				<button class="tab" @click="changeCurrent(0)" :id="isCurrentTab(0)"> Achievements </button>
				<button class="tab"  @click="changeCurrent(1)" :id="isCurrentTab(1)"> Ladder </button>
				<button class="tab"  @click="changeCurrent(2)" :id="isCurrentTab(2)"> History </button>
			</div>
			<div class="StatsArea">
				<br>
			</div>
		</div>
	<!-- <div class="stat">
		Victories: {{ userData.victory }}
		Defeats: {{ userData.defeat }}
    </div> -->

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
		}
	},

	mounted() {
		this.userData;
		this.relation;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.picture =await this.getPicture();
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
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.$route.params.username}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const data = await res.json();
			return data[0]
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
		},

		async blockUser(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/block/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
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

		isBlock() {
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


<style lang="css">

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

.picture {
	margin-left: 4%;
	margin-bottom: 2%;
	margin-top: 2%;
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
	background-color: #FFFFFF;
	border-radius: 40em;
	border-style: none;
	box-shadow: #ADCFFF 0 -12px 6px inset;
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

.challengeButton > p:active {
  transform: scale(1.025);
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
	border-bottom:	solid 2px white;
}

.tab
{
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

.StatsTabs > button
{
	background: none;
	border: none;
	border-right:	solid 2px white;
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

.replyButton {
	display: flex;
	flex-direction: column;
	justify-content: right;
}

.replyButton > button {
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

</style>
