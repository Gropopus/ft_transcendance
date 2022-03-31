<template>
	<div class="profilePage">
		<!-- <button @click="reload()"> reload </button> -->
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="status"> {{ userData.email }} </div>
			</div>
			<div class="perso-info">
			</div>
		</div>
		<div class="StatsWin">
			<div class="StatsTabs">
				<button class="tab"  @click="changeCurrent(0)" :id="isCurrentTab(0)"> Statistics </button>
				<button class="tab" @click="changeCurrent(1)" :id="isCurrentTab(1)"> Achievements </button>
				<button class="tab"  @click="changeCurrent(2)" :id="isCurrentTab(2)"> History </button>
			</div>
			<div class="StatsArea">
				<div v-if="currentTab==0" class="stat">
					<div class="statElem">
						<h3>Ladder level</h3>
						<p> {{ ladder.level }} / {{ ladder.total }} </p>
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
			ladder: 0,
		}
	},

	mounted() {
		this.userData;
		this.picture;
		this.ladder;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.picture = await this.getPicture();
		this.ladder = await this.fetchLadderLevel();
	},

	methods: {
		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const data = await res.json();
			return data;
		},

		async fetchLadderLevel() {
			const res = await fetch(`http://localhost:3000/api/users/ladder-level/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const ladder = await res.json();
			return ladder;
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
	background:	linear-gradient(135deg, var(blue), var(--main-color-2))	fixed;
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
	border-radius: 30px;
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
	border-radius: 35px;
}

.tab
{
	border-radius: 35px;
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