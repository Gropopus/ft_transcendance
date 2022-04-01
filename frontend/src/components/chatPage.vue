<template>
	<div class="chatPage">
		<div class="chatSide">
		<div class="chatArea">
			<div class="channelName" v-if="channelsList.length > 0">
				<h2> {{ channelsList[getChannelIndex(channelId)].name }} : {{ channelsList[getChannelIndex(channelId)].description }}</h2>
			</div>
			<ul :key="mess.id" v-for="mess in channelMessages.slice().reverse()">
				<div v-if="mess.user.id != userId" class="otherUserMess">
					{{ mess.user.username}}: <br>
					{{ mess.text }} <br>
				</div>
				<div v-else class="currentUserMess">
					<p class="currentUserText">
					{{ mess.user.username }}: <br>
					{{ mess.text }}
					</p>
				</div>
			</ul>
		</div>
		<div class="writing-zone">
			<input type="text" v-model="message" placeholder="write a message ..." class="messageArea">
			<button @click="sendMessage(message)" class="sendButton">send</button>
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
		<button @click="createChannel()"> new channel</button>
	</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { io, Socket } from "socket.io-client";

export default	defineComponent ({
	name: 'chatPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	emits: ['save', 'addMessage'],

	data() {
		return {
			channelsList: [],
			channelId: 0,
			socket: Socket,
			channelMessages: [],
			message: "",
		}
	}, 

	sockets: {
		connect: function() {
			console.log('socket connected');
		},
	},

	async mounted() {
		/*this.channelsList;*/
		this.channelMessages;
		this.channelsList = await this.fetchChannelsList();

		if (this.channelsList.length > 0)
			this.channelId = this.channelsList[0].id;
		this.channelMessages = await this.fetchMessages();
		this.socket.auth = {userId: this.userId};
		this.socket.connect();
		if (this.channelId)
			this.socket.emit('joinChannel', this.channelId);
		this.socket.on('messageAdded', async () =>  {
			this.channelMessages = await this.fetchMessages();
		});
	},

	unmounted() {
		this.socket.disconnect();
	},

	created() {
		console.log('create');
		this.socket = io('http://localhost:42068', {
			withCredentials: true,
			extraHeaders: {
			"my-custom-header": "chat"
			},
			autoConnect: false});
			this.channelsList = this.fetchChannelsList();
	},


	methods: {
		async fetchChannelsList() {
			const res = await fetch(`http://localhost:3000/api/channel/all/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const data = await res.json()
			console.log(data.items);
			return data.items
		},

		async changeCurrentChan(id: number) {
			if (this.channelId != id)
			{
				this.socket.emit('leaveJoinChannel');
				this.channelId = id;
				this.socket.emit('joinChannel', this.channelId);
				this.channelMessages = await this.fetchMessages();
			}
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
			this.$router.replace({name: 'createChat'});
		},

		async deleteChannel(id: number) {
			const res = await fetch(`http://localhost:3000/api/channel/delete/${id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			const i = this.getChannelIndex(id);
			this.channelsList = await this.fetchChannelsList();
			if (this.channelId == id) {
				if (i >= this.channelsList.length)
					this.channelId = this.channelsList[i - 1].id;
				else
					this.channelId = this.channelsList[i].id;
				this.channelMessages = await this.fetchMessages();
			}
		this.channelsList = await this.fetchChannelsList();
		},

		async sendMessage(message: string)
		{
			this.socket.emit('addMessage', {msg: message, channelId: this.channelId});
			this.message = "";
		},

		async fetchMessages() {
			//console.log('fetch message')
			if (!this.channelId)
				return ;
			const res = await fetch(`http://localhost:3000/api/channel/${this.channelId}/messages/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const mess = await res.json();
			return mess.items;
		},
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

.chatSide {
	display: flex;
	flex-direction: column;
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
/*.channelname
{

}*/
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
	display: inline-block;
	text-align: left;
	overflow-x: hidden;
	padding-right: 2%;
	padding-left: 2%;
	padding-top: 	1%;
	padding-bottom: 1%;
	font-size: 130%;
	margin-right: 4%;
	border-radius: 20px;
	height: auto;
	max-width: 80%;
	background-color:	rgba(23, 61, 199, 0.103);
}

.currentUserMess
{
	display: flex;
	justify-content: right;
}

.currentUserText
{
	display: inline-block;
	text-align: left;
	overflow-x: hidden;
	padding-right: 2%;
	padding-left: 2%;
	padding-top: 	1%;
	padding-bottom: 1%;
	font-size: 130%;
	margin-right: 4%;
	border-radius: 20px;
	height: auto;
	max-width: 80%;
	background-color:	rgba(255, 255, 255, 0.24);

}

.writing-zone
{
	display: row;
}
</style>
