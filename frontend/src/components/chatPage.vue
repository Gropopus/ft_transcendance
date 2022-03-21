<template>
	<div class="chatPage">
		<div class="chatArea">
			{{ channelsList[channelId] }}
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
		</div>
		<div class="chatToolSpace">
		<ul :key="channel.id" v-for="channel in channelsList">
			<li >
				<!-- <button class="chanNameButton" @click="changeCurrentChan(channel.name)" v-bind:style='{"background" : (isCurrent() ? "white" : "none")}'></button> -->
				{{ channel.name }}
			</li>
		</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		},
		channelId: {
			type: [Number],
			default: 0
		},
	},

	emits: ['save'],

	data() {
		return {
			channelsList: [],
		}
	},

	mounted() {
		this.channelsList
	},

	async created() {
		this.channelsList = await this.fetchChannelsList()
	},

	methods: {
		async fetchChannelsList() {
			const res = await fetch(`http://localhost:3000/api/channel/all/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		})
			const data = await res.json()
			return data.items
		},
		// changeCurrentChan(id: number) {
		// 	this.channelId = id;
		// }
	},
})
</script>

<style lang="css">
.chatArea
{
	float:	left;
	width:	70%;
	min-height:	500px;
	max-height:	500px;
	overflow-y:	scroll;
	border:	solid 3px white;
	border-radius: 5px;
}

.chatToolSpace
{
	float:	right;
	width:	25%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.chatToolNav
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}
</style>
