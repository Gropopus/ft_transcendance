<template>
<div class="user-profile">
	<h1 class="username">{{ userData.username }}</h1>
		<div class="avatar">
		</div>
			<img src="/src/assets/profile-picture.png" alt="userDate.username" />
			<button @click="addfriend()" class="relationButton" v-if="!haveRelation">
				<img :src="friendIcon.img" alt="Salut" :title="friendIcon.title">
			</button>
	<div class="stat">
		Victories: {{ userData.victory }}
		Defeats: {{ userData.defeat }}
    </div>

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
			this.friendIcon = {img: "/src/assets/your-friends.png", title: "remove"};
			this.haveRelation = 1;

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

	/*** PROFILE STLES ***/

.user-profile {
	/* font-family: 'Dosis', sans-serif; */
	text-align: center;
	/* width: 793px; */
	/* max-width: 100%; */
	/* margin: 2rem auto; */
	margin-right: 5%;
	margin-left: 5%;
	margin-bottom: 0%;
}

.user {
	float: 
}

.username {
	margin-top: 0%;
	font-family: MyanmarText;
	font-size: 200%;
	color:	white;
	background-color: rgb(23, 61, 199);
	border: solid 3px white;
}

.stat {

}

.relationButton {
	background:	none;
	border: none;
}

.relationButton > img {
	max-width: 80px;
	max-height: 80px;
	/* height: 0%;
	weight: 0%; */
}

.relationButton:hover { 
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

</style>
