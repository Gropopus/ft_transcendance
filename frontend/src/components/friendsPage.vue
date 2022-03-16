
<template>
	<div class="friendsPage">
		<div  class="friendsArea">
		 <!-- <ul v-if="!loading && data && data.length"> -->
		<ul :key="friend.id" v-for="friend in friendList">
				<li> {{ friend }} </li>
		</ul>
		</div>
		<div class="friendsToolSpace">
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'friendsPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	emits: ['save'],

	data() {
		return {
				friendList: []
		}
	},

	mounted() {
		this.friendList
		console.log(`the component is now mounted.`)
	},

	async created() {
		this.friendList = await this.fetchData()
		console.log('friends list created' + this.friendList)
	},

	methods: {
		async fetchData() {
			const res = await fetch(`http://localhost:3000/api/friends/1`, {
    			method: 'get',
    			headers: {
      				'content-type': 'application/json'
				}
    		})
			const data = await res.json()
			console.log(data)
			return data
		},
	},
})
</script>

<style lang="css">
.friendsArea
{
	float:	left;
	width:	70%;
	min-height:	500px;
	max-height:	500px;
	overflow-y:	scroll;
	border:	solid 3px white;
	border-radius: 5px;
}

.friendsToolSpace
{
	float:	right;
	width:	25%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.friendsToolNav
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}
</style>
