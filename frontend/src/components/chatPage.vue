<template>
<div>
	<div class="listName">
		All channels
		<button @click="setDiplayState()"  class="arrow">
			<img v-if="listStatus==0" src="/src/assets/arrow-whitedown.png"/>
			<img v-else src="/src/assets/arrow-white-up.png" />
		</button>
	</div>
	<div v-if="listStatus" >
		<div :key="chan.id"  v-for="chan in all" class="elemChanList">
			<div class="chanName">{{ chan.name }} </div>
			<div class="chanType">{{ chan.type }} </div>
            <div v-if="chan.type=='protected' && !isInChannel(chan.id)">
                <input type="password" v-model="joinPassword" placeholder="password" class="joinPass">
            </div>
			<button v-if="!isInChannel(chan.id)" @click="joinChannel(chan.id)" class="joinButton" >join channel</button>
		</div>
	</div>
	<div class="chatPage">
		<div class="allChan">
		</div>
		<div class="chatSide">
		<div class="channelName" v-if="channelsList.length > 0">
			<h2 v-if="channelsList[getChannelIndex(channelId)].type != 'direct-message'"> {{ channelsList[getChannelIndex(channelId)].name }} : {{ channelsList[getChannelIndex(channelId)].description }}</h2>
			<h2 v-else> {{ getUserMessageName(channelId) }}</h2>
			<button v-if="hasSettingsRights()" @click="goToSettings(channelId)"> Settings </button>
		</div>
		<div class="chatArea">
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
			<input type="text" v-model="message" @keyup.enter="sendMessage(message)" class="messageArea">
			<button @click="sendMessage(message)" class="sendButton">send</button>
		</div>
		</div>
		<div class="chatToolSpace">
		<div class="chanList">
			<ul :key="channel.id" v-for="channel in channelsList">
				<div>
					<button class="chanNameButton" @click="changeCurrentChan(channel.id)"
						v-bind:style='{"background" : (isCurrent(channel.id) ? "white" : "none")}'>
					<div v-if="channel.type != 'direct-message'"> {{ channel.name }}</div>
					<div v-else> {{ getUserMessageName(channel.id) }}</div> <br>
					</button>
				</div>
			</ul>
		</div>
		<button @click="createChannel()"> new channel</button>
	</div>
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
			listStatus: 0,
			all: [],
			joinPassword: "",
			tmpUsername: "",
		}
	}, 

	async mounted() {
		/*this.channelsList;*/
		this.all = await this.fetchAllChannels();
		this.channelMessages;
		this.channelsList = await this.fetchChannelsList();
			console.log(this.channelsList);
		this.all;
		if (this.channelsList.length > 0)
			this.channelId = this.channelsList[0].id;
		this.channelMessages = await this.fetchMessages();
		this.resetScroll();
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

	async created() {
		console.log('create');
		this.socket = io('http://localhost:42070', {
			withCredentials: true,
			extraHeaders: {
				"my-custom-header": "chat"
			},
			autoConnect: false});
			// this.channelsList = this.fetchChannelsList();
			// console.log(this.channelsList);
	},


	methods: {
		async fetchAllChannels() {
			const res = await fetch(`http://localhost:3000/api/channel/all`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const data = await res.json()
			return data.items;
		},

		async fetchChannelsList() {
			const res = await fetch(`http://localhost:3000/api/channel/all/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const data = await res.json()
			return data.items;
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

		resetScroll()	{
			let lastMsg = document.getElementsByClassName("chatArea")[0];
			if (typeof lastMsg === 'undefined')
				return ;
			lastMsg = lastMsg.children[lastMsg.children.length - 1];
			if (typeof lastMsg === 'undefined')
				return ;
			lastMsg.scrollIntoView(false, {block: "end", inline: "end"});
		},

		async sendMessage(message: string)
		{
			this.socket.emit('addMessage', {msg: message, channelId: this.channelId});
			this.message = "";
		},

		async fetchMessages() {
			if (!this.channelId)
				return ;
			const res = await fetch(`http://localhost:3000/api/channel/${this.channelId}/messages/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
    		});
			const mess = await res.json();
			return mess.items;
		},

		goToSettings(id: number) {
			this.$router.replace(`/channel-setting/${id}`)
		},

		async hasSettingsRights()	{
			return (true);
		},

		setDiplayState() {
            this.listStatus = 1 - this.listStatus;
		},

		async joinChannel(chanId: number) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.userId}/join/${chanId}`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' ,
                    'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({password: this.joinPassword}),
            });
			this.joinPassword = "";
			this.channelsList = await this.fetchChannelsList();
		},

		isInChannel(chanId: number) {
			for (let chan of this.channelsList)
			{
				if (chan.id == chanId)
					return true;
			}
			return false;
		},

		getUserMessageName(id: number){
			const chan = this.channelsList[this.getChannelIndex(id)];
			if (chan.type != 'direct-message' || chan.admin.length != 2)
				return "error";
				console.log(chan);
			if (chan.admin[0].id == this.userId)
				return chan.admin[1].username;
			else
				return chan.admin[0].username;
		}
	},
})
</script>

<style lang="css" scoped>

.listName {
	display:flex;
	flex-direction: row;
	text-align: left;
	border-bottom: solid 2px white;
	margin-bottom: 0px;
	font-size: 30px;
	gap: 2%;
}

.elemChanList {
	display: flex;
	gap: 5%;
	font-size: 20px;
	margin-top: 1%;
}

.elemChanList > .chanType {
	width: 20%;
    color: rgb(255, 255, 255, 0.6);
}

.elemChanList > .chanName {
	width: 20%;
}
.elemChanList > .joinButton {
    padding: 6px;
	font-size:	20px;
    margin-left: 1%;
	border:	solid 2px white;
    background: none;
    color: white;
}
.elemChanList > .joinButton:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;

}

.joinPass {
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	20px;
}
.chatPage
{
	margin-top: 2%;
	display: flex;
	flex-direction: row;
}

.chatSide {
	display: flex;
	flex: 7;
	flex-direction: column;
	min-height:	500px;
	max-height:	45em;
	width: 100%;
	margin-right: 3%;
}

.chatArea
{
	overflow-y:	scroll;
	border:	solid 3px white;
	width: 100%;
	min-height:	300px;
}

.chatToolSpace
{
	flex: 3;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	width: 100%;
}

.chatToolSpace > button
{
	flex: 1;
	margin-top: auto;
	margin-bottom: auto;
	margin-right: 1%;
	background: none;
	border: solid 3px white;
	border-radius: 5px;
	font-size: 120%;
	font-style: Myanmar;
	color: white;
}

.chatToolSpace > button:hover
{
	cursor: pointer;
	background: rgb(255, 255, 255, 0.5);
}

.chanList
{
	overflow-y: scroll;
	max-height:	45em;
}

.chatToolNav
{
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
}

.channelName
{
	display: flex;
	flex-direction: row;
	text-align: center;
	border-top: solid white 3px;
	border-right: solid white 3px;
	border-left: solid white 3px;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	width: 100%;
}

.channelName > h2
{
	flex: 9;
}

.channelName > button
{
	flex: 1;
	margin-top: auto;
	margin-bottom: auto;
	margin-right: 1%;
	height:	42px;
	background: none;
	border: solid 3px white;
	border-radius: 5px;
	font-size: 120%;
	font-style: Myanmar;
	color: white;
}

.channelName > button:hover
{
	cursor: pointer;
	background: rgb(255, 255, 255, 0.5);
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
	border: solid 3px white;
	border-top: none;
	display: flex;
	flex-direction:	row;
	width:		100%;
}

.writing-zone > input
{
	flex: 9;
	border-radius: 40px;
	margin: 2%;
	margin-top: 1%;
	margin-bottom: 1%;
	padding-top: 1%;
	padding-right: 2%;
	padding-left: 2%;
	font-style: Myanmar;
	color: white;
	font-size: 120%;
	background: var(--white-10);
}

.writing-zone > input:focus
{
	outline: solid rgb(255, 255, 255, 0.4) 2px;
	caret-color: rgb(255, 255, 255, 0.6);
}

.sendButton
{
	flex: 1;
	margin-top: auto;
	margin-bottom: auto;
	margin-right: 1%;
	width: 9%;
	height:	42px;
	background: none;
	border: solid 3px white;
	border-radius: 5px;
	font-size: 120%;
	font-style: Myanmar;
	color: white;
}

.sendButton:hover
{
	cursor: pointer;
	background: rgb(255, 255, 255, 0.5);
}

</style>
