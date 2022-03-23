<template>
	<div class="chatPage">
		<button @click="createChannel()"> new channel</button>
		<div class="chatArea">
			<div class="channelName" v-if="channelsList.length > 0">
				<h3> {{ channelsList[getChannelIndex(channelId)].name }} </h3>
			<ul :key="mess.id" v-for="mess in channelMessages">
				<p v-if="mess.user.id != userId" class="otherUserMess">
					{{ mess.user.username }} <br>
					{{ mess.text }} <br>
				</p>
				<p v-else class="currentUserMess">
					{{ mess.user.username }} <br>
					{{ mess.text }} <br>
				</p>
			</ul>
		<input type="text" v-model="message" placeholder="write a message ..." class="messageArea">
		<button @click="sendMessage(message)" class="sendButton">send</button>
		<br>
			</div>
		</div>
		<div class="chatToolSpace">
		<ul :key="channel.id" v-for="channel in channelsList">
			<div>
				<button class="chanNameButton" @click="changeCurrentChan(channel.id)"
					v-bind:style='{"background" : (isCurrent(channel.id) ? "white" : "none")}'>
				{{ channel.name }} <br>
				</button>
				<button class="deleteButton" @click="deleteChannel(channel.id)">x</button>
			</div>
		</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { io, Socket } from "socket.io-client";

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

	emits: ['save', 'update:currentPage', 'addMessage'],

	data() {
		return {
			channelsList: [],
			channelId: 0,
			// socket: Socket,
			channelMessages: [],
			message: "",
		}
	},

	sockets: {
		connect: function() {
			console.log('socket connected');
		},
	},

	mounted() {
		this.channelsList;
		this.channelMessages;
		// this.socket;
	},


	async created() {
		this.channelsList = await this.fetchChannelsList();
		if (this.channelsList.length > 0)
			this.channelId = this.channelsList[0].id;
		this.channelMessages = await this.fetchMessages();
		// this.socket = io('http://localhost:3000');
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

		async deleteChannel(id: number) {
			const res = await fetch(`http://localhost:3000/api/channel/delete/${id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
		},

		async sendMessage(message: string)
		{
			// console.log(this.socket);
			this.$socket.emit('addMessage', message);
		},

		async fetchMessages() {
			if (!this.channelId)
				return ;
			const res = await fetch(`http://localhost:3000/api/channel/${this.channelId}/messages/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const mess = await res.json();
			console.log(mess.items);
			return mess.items;
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

.messageArea
{
	position: relative;
	bottom: 0;
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	left ;
	min-width:	450px;
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

.otherUserMess
{
	text-align: left;
}

.currentUserMess
{
	text-align: right;
}
</style>
