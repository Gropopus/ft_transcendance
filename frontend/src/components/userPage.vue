<template>
	<div class="profilePage">
		<img :src="userData.picture" alt="picture" class="profilePicture">
		<h1>
			{{ userData.username }} | {{ userData.id }} [{{ userData.status }}]
			<img v-if="haveRelation" :src="relationIcon" alt="relation">
		</h1>
		<div class="buttons">
				<button @click="addfriend()" class="relationButton" v-if="!haveRelation">
					<img :src="friendIcon" alt="Salut">
				</button>
				<button @click="blockUser()" class="relationButton" v-if="!isBlock()">
					<img :src="blockIcon" alt="Bye">
				</button>
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
			friendIcon: "/src/assets/friends-requests.png",
			blockIcon: "/src/assets/your-friends.png",
			relationIcon: "",
			haveRelation: 0,
		}
	},

	mounted() {
		this.userData;
		this.relation;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.relation = await this.fetchRelation();
		if (this.isFriend())
		{
			this.relationIcon = "/src/assets/friends.png";
			this.haveRelation = 1;

		}
		else if (this.isBlock())
		{
			this.haveRelation = 1;
			this.relationIcon = "/src/assets/your-friends.png";
		}
	},

	methods: {
		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.$route.params.username}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const data = await res.json();
			console.log(data);
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

		async addfriend(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/add/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
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
	},
})
</script>


<style lang="css">
.profilePage
{
	background:	green;
}
</style>
