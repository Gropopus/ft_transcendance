<template>
	<div class="chatPage">
		<button @click="createChannel()"> new channel</button>
		<div class="chatArea">
			{{ channelsList[getChannelIndex(channelId)].name }}
		</div>
		<div class="chatToolSpace">
		<ul :key="channel.id" v-for="channel in channelsList">
			<div>
				<button class="chanNameButton" @click="changeCurrentChan(channel.id)" v-bind:style='{"background" : (isCurrent(channel.id) ? "white" : "none")}'>
				{{ channel.name }}
				</button>
				<button class="deleteButton" @click="deleteChannel(channel.id)">x</button>
			</div>
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
	},

	emits: ['save', 'update:currentPage'],

	data() {
		return {
			channelsList: [],
			channelId: 0,
		}
	},

	mounted() {
		this.channelsList;
	},

	async created() {
		this.channelsList = await this.fetchChannelsList();
	},

	methods: {
		async fetchChannelsList() {
			const res = await fetch(`http://localhost:3000/api/channel/all/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const data = await res.json()
			return data.items
		},

		changeCurrentChan(id: number) {
			this.channelId = id;
		},

		getChannelIndex(id: number) {
			for (let i in this.channelsList)
				if (this.channelsList[i].id == id)
					return i;
			if (this.channelsList.length)
				this.channelId = this.channelsList[0].id;
			return 0;
		},

		isCurrent(id: number) {
			if (this.channelId == id)
				return true;
			return false;
		},

		createChannel() {
			this.$emit('update:currentPage', "7")
		},

		async deleteChannel(channelId: number) {
			const res = await fetch(`http://localhost:3000/api/channel/delete/${channelId}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
		}
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

.chanNameButton
{
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	min-width:	150px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	border:	none;
}

.deleteButton
{
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	min-width:	50px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	border:	none;
}

.chanNameButton:hover
{
	background:	var(--deep-blue-10);
}

.deleteButton:hover
{
	background:	var(--deep-blue-10);
}

</style>
