<script setup lang="ts">
	import statsWindow from './statsWindow.vue'
</script>

<template>
<div style="display: flex; flex-direction: column">
	<div class="searchBar" style="margin-right: 3%">
			<div style="display: flex; justify-content: right">
				<img style="height: 25px" src="../assets/magnifying-glass.png">
				<span style="font-size: 15px; text-align: right; margin-left: 1%"> Search a user</span>
			</div>
			<input type="text" v-model="search" v-on:keyup="searchUser()" class="textArea1" style="height: 15px;">
			<div class="friendFound" v-if="found.length"  :key="elem.id" v-for="elem in found">
				<p v-on:click="goToUserPage(elem.username)"> {{ elem.username }}</p>
            </div>
	</div>
	<div class="profilePage">
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
		<statsWindow :userId="userId" :profId="userId"/>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import searchBar from './searchBar.vue';

export default	defineComponent ({
	name: 'profilePage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0",
			required: true
		},
	},

	components: {
		searchBar,
	},

	data() {
		return {
			userData: [],
			picture: "",
			found: [],
            search: "",
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
			const res = await fetch(`http://kittypong.fr:3000/api/users/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const data = await res.json();
			return data;
		},

		async addfriend(targetId: number){
			await fetch(`http://kittypong.fr:3000/api/friends/1/add/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},

		async blockUser(targetId: number){
			await fetch(`http://kittypong.fr:3000/api/friends/${this.userId}/block/${targetId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		})
		},

		async getPicture()
		{
			const ret = await fetch(`http://kittypong.fr:3000/api/users/pictureById/${this.userId}`, {
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
		
		async goToUserPage(username: string) {
			this.$router.push(`/profile/${username}`)
		},

		async searchUser() {
			if (!this.search)
			{
				this.found = [];
				return [];
			}
			const res = await fetch(`http://localhost:3000/api/users/search/${this.search}`, {
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
	},
})
</script>


<style lang="css" scoped>

.StatsWin
{
	/* width:	100%; */
	min-height:	500px;
	display:	flex;
	flex-direction:	column;
}

.profilePage
{
	background:	linear-gradient(135deg, var(blue), var(--main-color-2))	fixed;
	flex-direction:	row;
	text-align: center;
	margin-right: 3%;
	margin-left: 3%;
	margin-bottom: 0%;
}

.profile-resume {
	display: flex;
	flex-direction: row;
	gap: 3%;
	/* flex: 1 1 0; */
	border: solid 3px white;
	min-width: 700px;
	margin-bottom: 2%;
	align-content: center;
	border: none;
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
	border-radius: 50%;
	overflow: hidden;
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
	object-fit:cover;
}
</style>
