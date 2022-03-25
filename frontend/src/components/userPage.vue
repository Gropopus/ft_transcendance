<template>
	<div class="profilePage">
		<h1> {{ userData.username }} | {{ userData.id }} [{{ userData.status }}]</h1>
		<h2> Liste de users (Page provisoire)</h2>
		<ul :key="user.id" v-for="user in userList">
			<li> {{ user.username }}
				<button @click="addfriend(user.id)">
					add
				</button>
				<button @click="blockUser(user.id)">
					block
				</button>
			</li>
		</ul>
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
			userList: [],
			userData: [],
		}
	},

	mounted() {
		this.userList
		this.userData
		console.log(`the component is now mounted.`)
	},

	async created() {
		this.userList = await this.fetchUsers()
		this.userData= await this.fetchUserData()
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

		async fetchUsers() {
			const res = await fetch(`http://localhost:3000/api/users`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const data = await res.json()
			return data.items
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
	},
})
</script>


<style lang="css">
.profilePage
{
	background:	green;
}
</style>
