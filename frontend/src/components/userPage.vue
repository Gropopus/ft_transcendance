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
			<div class="relation">
				<button @click="addOrRemovefriend()" class="relationButton" :title="friendIcon.title">
					<img :src="friendIcon.img" />
				</button>
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
<!-- Run Pen

Resources
	<div class="profilePage">
		<img :src="userData.picture" alt="picture" class="profilePicture">
		<h1>
			{{ userData.username }} | {{ userData.id }} [{{ userData.status }}]
			<img v-if="haveRelation" :src="relationIcon" alt="relation">
		</h1>
	</div> -->
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
			haveRelation: 0,
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
		{
			this.friendIcon = {img: "/src/assets/muted-users.png", title: "remove friend"};
			this.haveRelation = 1;

		}
		else
		{
			this.friendIcon = {img: "/src/assets/friends-requests.png", title:"add friend"};
			this.haveRelation = 0;
		}
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
			else {
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
	margin-left: 2%;
	margin-bottom: 2%;
	margin-top: 2%;
}

.relation {
	flex:	1 1 0;
	display: flex;
	justify-content: right;
}
.relationButton {
	margin-right: 5%;
	background:	none;
	border: none;
}

.relationButton > img {
	max-width: 80px;
	max-height: 80px;
}

.relationButton:hover { 
	background: rgba(255, 255, 255, 0.5);
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

</style>
