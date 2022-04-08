<script setup lang="ts">
	import statsWindow from './statsWindow.vue'
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
				<div class="status" v-if="userData.status == 'online'" style="color: rgb(255, 228, 113);"> online </div>
				<div class="status" v-else-if="userData.status == 'offline'" style="color: rgb(255, 255, 255, 0.4);"> offline </div>
				<div class="status" v-else style="color: rgb(200, 192, 255);"> in game </div>
			</div>
			<div class="perso-info">
				<button @click="goToRoute('/settings')" title="settings" class="Edit"> Edit</button>
			</div>
		</div>
		<statsWindow :profId="userId"/>
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
			picture: "",
		}
	},

	emits:	['userIsOnline'],
	
	mounted() {
		this.userData;
		this.picture;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.picture = await this.getPicture();
	},

    async updated() {
        await this.$emit('userIsOnline', this.userId);
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
</style>
