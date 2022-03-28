<template>
	<div class="profilePage">
		<!-- <button @click="reload()"> reload </button> -->
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="status"> {{ userData.status }} </div>
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
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'profilePage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	data() {
		return {
			userData: [],
			currentTab: 0,
			picture: "",
		}
	},

	mounted() {
		this.userData;
	},

	async created() {
		this.userData= await this.fetchUserData();
		this.picture =await this.getPicture();
	},

	methods: {
		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const data = await res.json()
			return data
		},

		async addfriend(targetId: number){
			await fetch(`http://localhost:3000/api/friends/1/add/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},

		async blockUser(targetId: number){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/block/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
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
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userId}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
    		return blobUrl;
		},
	},
})
</script>


<style lang="css">
.profilePage
{
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

.picture > img {
	margin-left: 2%;
	margin-bottom: 2%;
	margin-top: 2%;
	min-height: 150px;
	min-width: 150px;
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