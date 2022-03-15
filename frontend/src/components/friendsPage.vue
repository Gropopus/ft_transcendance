
<template>
	<div class="friendsPage">
		<div  class="friendsArea">
		 <ul v-if="!loading && data && data.length">
			<li :key="friend.id" v-for="friend in data">
				<p> hello </p>
			</li>
		</ul>
		</div>
		<div class="friendsToolSpace">
		</div>
	</div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default	{
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
	setup() {
		const data = ref(null);
		const loading = ref(true);

		function fetchData() {
			return fetch('http://localhost:3000/api/friends/1', {
    			method: 'get',
    			headers: {
      				'content-type': 'application/json'
    			}
  			})
			  .then(res => { return res.json(); })
			  .then(json => { data.value = json.data; })
			  .then(() => { loading.value = false; });
		}

		onMounted(() => {
			fetchData();
		});

		return {
			data,
			loading
		};
	},
	// data() {
	// 	return {
		// 		friendsList: Array
	// 	}
	// },
	// methods: {
	// 		friendsList: Array
	// 	mounted() {
	// 		console.log(`the component is now mounted.`)
	// 	},
	// 	async fetchFriends() {
	// 		const res = await fetch(`http://localhost:3000/api/friends/1`)
	// 		const data = await res.json()
	// 		return data
	// 	},
	// 	async created() {
	// 		console.log('friends list created')
	// 		this.friendsList = await this.fetchFriends()
	// 	},
	// },
	// console: () => console
}
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
