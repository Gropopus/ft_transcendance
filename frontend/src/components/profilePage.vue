<script setup lang="ts">
	import scoreBoard from './scoreBoard.vue'
</script>

<template>
	<div class="profilePage">
		<!-- <button @click="reload()"> reload </button> -->
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="usermail"> {{ userData.email }} </div>
				<div class="status"> {{ userData.status }} </div>
			</div>
			<div class="perso-info">
				<button @click="goToRoute('/settings')" title="settings" class="Edit"> Edit</button>
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
						<p> {{ ladder.level }} / {{ ladder.total }} </p>
					</div>
					<div class="statElem">
						<h3>Elo</h3>
						<p> {{ userData.level }}  </p>
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
					<scoreBoard :userId="userId"/>
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

		goToRoute(path: string) {
			this.$router.push(path);
		},
	},
})
</script>


<style lang="css" scoped>

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
	min-width: 800px;
	width: 100%;
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
	max-height: 60px;
	min-width: 150px;
	width:		50%;
	margin-top: auto;
	margin-bottom: auto;	
	padding-top: 2%;
	/*margin: 20%;*/
	margin-top: auto;
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
/* stat style */

.StatsArea
{
	width:	100%;
	min-width: 800px;
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
	min-width: 800px;
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
	font-size: 120%;
	color: white;
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
</style>
