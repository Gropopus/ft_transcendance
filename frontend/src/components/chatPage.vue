<template>
<div>
	<search-bar></search-bar>
	<div class="listName" @click="setDiplayState()">
		<div> All channels </div>
		<button>
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
		<div class="chatSide">
		<div class="channelName" v-if="channelsList.length > 0">
			<div v-if="channelsList[getChannelIndex(channelId)].type != 'direct-message'">
				<p style="font-size: 1.5em; margin-block-start: 0.60em;">
					{{ channelsList[getChannelIndex(channelId)].name }} </p>
				<p style="font-style: italic; color: rgb(255,255,255,0.7); margin-block-end: 0.60em;">
					{{ channelsList[getChannelIndex(channelId)].description }} </p>
			</div>
			<div v-else>
				<div style="display: flex; gap: 5%; justify-content: center;">
					<img :src="getOneDM(channelId).picture" class="picture1" />
					<div @click="goToUserProfile(getOneDM(channelId).name)" class="usernameButton"> {{ getOneDM(channelId).name }}</div>
				</div>
			</div>
			<img v-if="channelsList[getChannelIndex(channelId)].type != 'direct-message'&& settingsIcon.img" @click="goToSettings(channelId)" title="settings" :src="settingsIcon.img">
		</div>
		<div class="chatArea">
			<ul v-if="channelMessages != undefined" :key="mess.id" v-for="mess in channelMessages.slice().reverse()">
				<div v-if="mess.user.id != userId" class="otherUserMess">
					<button @click="goToUserProfile(mess.user.username)" class=linkButton > {{ mess.user.username}}: </button><br>
					<p v-if="mess.text != '!challenge'">{{ mess.text }}</p>
					<p v-else>
						<p style="color: rgb(73, 105, 219); margin: 0px;">Play with me !</p>
						<img  @click="acceptChallenge(mess.challengeId)" src="/src/assets/challenge.png" title="play" class="playButton">
					</p>
				</div>
				<div v-else class="currentUserMess">
					<p class="currentUserText">
						<p style="color: rgb(255,255,255, 0.7);">{{ mess.user.username }}:</p>
						<p v-if="mess.text != '!challenge'">{{ mess.text }}</p>
						<p v-else >
							<p style="color: rgb(73, 105, 219); margin: 0px;">Play with me !</p>
							<img  @click="acceptChallenge(mess.challengeId)" src="/src/assets/challenge.png" title="play" class="playButton">
						</p>
					</p>
				</div>
			</ul>
			</div>
		<div class="writing-zone">
			<input type="text" v-model="message" @keyup.enter="sendMessage(message)" class="messageArea">
			<img src="/src/assets/message012.png" @click="sendMessage(message)" title="Send" class="sendButton">
		</div>
		</div>
		<div class="chatToolSpace">
			<div class="chatHead">
				<div>Chats</div>
				<button @click="createChannel()"> new channel</button>
			</div>
			<div class="chanSearch">
				<input @keyup.enter="filterChans(searchKey)" placeholder="Search" type="text" v-model="searchKey">
				<img @click="filterChans(searchKey)" src="/src/assets/magnifying-glass.png"/>
			</div>
			<div class="chanList">
				<button :key="channel.id" v-for="channel in channelsList" class="chanNameButton" @click="changeCurrentChan(channel.id)"
					v-bind:style='{"background" : (isCurrent(channel.id) ? "var(--deep-blue-50)" : "none")}'>
					<div v-if="channel.type != 'direct-message'" class="dmInfo"> 
						<div style="flex: 1 1 1; aspect-ratio: 1 / 1;"></div>
						<div class="name"> {{ channel.name }} </div>
						<div style="color: rgb(255,255,255,0.5); flex: 3;"> {{ channel.type }} </div>
					</div>
					<div v-else class="dmInfo">
						<img style="flex: 0 0 1; aspect-ratio: 1 / 1;" :src="getOneDM(channel.id).picture" class="picture2" />
						<div style="flex: 3; text-align: left;">{{ getOneDM(channel.id).name }}</div>
						<div style="color: rgb(255,255,255,0.5); flex: 3"> {{ getOneDM(channel.id).status }} </div>
					</div>
				</button>
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { io, Socket } from "socket.io-client";
import searchBar from './searchBar.vue';

export default	defineComponent ({
	name: 'chatPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0",
			required: true
		},
	},

	components: {
		searchBar,
	},

	emits: ['addMessage', 'userIsOnline'],

	data() {
		return {
			channelsList: [],
			channelId: 0,
			socket: Socket,
			channelMessages: [],
			mess: "",
			message: "",
			searchKey: "",
			listStatus: 0,
			all: [],
			joinPassword: "",
			tmpUsername: "",
			dmList: [],
			settingsIcon: {img: "/src/assets/settings-icon.png", title:"settings"},
		}
	},
	
	async mounted() {
		this.all = await this.fetchAllChannels();
		this.channelsList = await this.fetchChannelsList();
		this.dmList = await this.getDMList();
		this.all;
		const chanId = this.$route.query.id;
		if (chanId)
			this.channelId = chanId;
		else if (this.channelsList.length > 0)
			this.channelId = this.channelsList[0].id;
		this.socket.auth = {userId: this.userId};
		this.socket.connect();
		const challengeId = this.$route.query.challengeId;
		this.channelMessages = await this.fetchMessages();
		this.resetScroll();
		if (this.channelId)
			this.socket.emit('joinChannel', this.channelId);
		this.socket.on('messageAdded', async () =>  {
			this.channelMessages = await this.fetchMessages();
		});
		if (challengeId)
			await this.socket.emit('addMessage', {msg: '!challenge', challengeId: challengeId, channelId: this.channelId});
	},

	unmounted() {
		this.socket.disconnect();
	},

	async created() {
		this.socket = io('http://localhost:42070', {
			withCredentials: true,
			extraHeaders: {
				"my-custom-header": "chat"
			},
			autoConnect: false});
		this.resetScroll();
	},

    async updated() {
		await this.$emit('userIsOnline', this.userId);
		this.resetScroll();
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
			this.searchKey = "";
			this.channelsList = await this.fetchChannelsList();
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
			this.$router.push({name: 'createChat'});
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
			let challengeId = 0
			if (message == '!challenge')
				challengeId = await this.createChallenge();
			this.socket.emit('addMessage', {msg: message, challengeId: challengeId, channelId: this.channelId});
			this.message = "";
			if (challengeId)
				this.$router.push('/challenge/normal/' + challengeId);
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
			this.$router.push(`/channel-setting/${id}`)
		},

		goToUserProfile(userInfo) {
			this.$router.push(`/profile/${userInfo}`)
		},

		async hasSettingsRights()	{
			return (true);
		},

		setDiplayState() {
            this.listStatus = 1 - this.listStatus;
		},

		async joinChannel(chanId: number) {
			let i;
			for (i in this.all)
				if (this.all[i].id == chanId)
					break ;
			if (this.joinPassword == "" && this.all[i].type == "protected")
				return ;
			const res = await fetch(
                `http://localhost:3000/api/channel/${this.userId}/join/${chanId}`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' ,
                    'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({password: this.joinPassword}),
            });
			const ret = await res.json();
			if (ret.error == "Bad password")
				return ;
			this.joinPassword = "";
		/*	await this.changeCurrentChan(chanId);*/
			this.channelsList = await this.fetchChannelsList();
			await this.changeCurrentChan(chanId);
		},

		isInChannel(chanId: number) {
			for (let chan of this.channelsList)
			{
				if (chan.id == chanId)
					return true;
			}
			return false;
		},

		matchKey(value: string, searchKey: string)	{
			return (value.name.toString().toLowerCase().startsWith(searchKey));
		},

		async filterChans(searchKey: string)	{
			this.channelsList = await this.fetchChannelsList();
			if (this.channelsList != undefined)	{
				if (searchKey.trim() == "")	{
					this.searchKey = "";
					return ;
				}
				let tmpList = this.channelsList.filter(value => this.matchKey(value, searchKey.toLowerCase()));
				this.channelsList = tmpList;
			}
		},

		async getPicture(id: number)
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${id}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
    		return blobUrl;
		},

		async getDMInfo(chan : any) {
			if (chan.owner.id != this.userId) {
				return {
					chanId: chan.id,
					id: chan.owner.id,
					name: chan.owner.username,
					status: chan.owner.status,
					picture: await this.getPicture(chan.owner.id)
				};
			}
			else {
				return {
					chanId: chan.id,
					id: chan.admin[0].id,
					name: chan.admin[0].username,
					status: chan.admin[0].status,
					picture: await this.getPicture(chan.admin[0].id)
				};
			}
		},

		async getDMList() {
			let list = [];
			for (let chan of this.channelsList)
				if (chan.type == 'direct-message')
					list.push(await this.getDMInfo(chan));
			return list;

		},

		getOneDM(id: number) {
			for (let dm of this.dmList)
				if (dm.chanId == id)
					return dm;
			return {};
		},

		async createChallenge() {
			const ret = await fetch(` http://localhost:3000/api/game/newchallengeid/`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const challengeId = await ret.json();

			return challengeId;
		},

		acceptChallenge(challengeId: number) {
			this.$router.push('/challenge/normal/' + challengeId);
		}
	},
})
</script>

<style lang="css" scoped>

.linkButton {
	background: none;
	border: none;
	margin-top: auto;
	margin-bottom: auto;
	cursor: pointer;
	font-style: Myanmar;
	color: white;
	font-size: 100%;
	letter-spacing: 2px;
}

.listName {
	display:flex;
	flex-direction: row;
	text-align: left;
	border-bottom: solid 2px white;
	margin-top: 5%;
	margin-bottom: auto;
	margin-left: 3%;
	font-size: 150%;
	cursor: pointer;
	gap: 2%;
}

.listName > div	{
	flex: 14;
	user-select: none;
}

.listName > button	{
	flex: 1;
	background: none;
	border: none;
	margin-top: auto;
	margin-bottom: auto;
}

.listName > button > img	{
	object-fit: contain;
	height: 30%;
	width: 30%;
}

.elemChanList {
	min-width: 300px;
	display: flex;
	gap: 5%;
	font-size: 20px;
	margin-left: 3%;
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
	margin-top: 5%;
	margin-left: 3%;
	display: flex;
	flex-direction: row;
	border:	solid 3px white;
	border-radius: 5px;
	height: 45em;
	/* min-width: 900px; */
}

.chatSide {
	display: flex;
	flex: 6;
	flex-direction: column;
	/* max-height:	45em;
	min-width: 500px; */
	/* width: 100%; */
	/* margin-right: 3%;
	margin-left: 3%; */
	min-height:	100%;
}

.chatArea
{
	display: block;
	overflow-y:	scroll;
	height:	100%;
}

.chatArea > ul {
	margin: 0px;
}
.chatToolSpace
{
	flex: 3;
	display: flex;
	flex-direction: column;
	min-height:	500px;
	border-left: solid white 1px;
	border-radius: 5px;
}

.chatHead {
	flex: 1;
	display: flex;
	flex-direction: row;

}

.chatHead > div {
	flex: 9;
	font-weight: bold;
	text-align: center;
	font-style: Myanmar;
	color: white;
	font-size: 200%;
	margin-top: 2%;
}

.chatHead > button
{
	flex: 1;
	margin-top: 2%;
	margin-bottom: 2%;
	margin-right: 2%;
	background: none;
	border: solid 1px white;
	border-radius: 5px;
	font-size: 120%;
	font-style: Myanmar;
	color: white;
}

.chatHead > button:hover
{
	cursor: pointer;
	background: rgb(255, 255, 255, 0.5);
}
.chanSearch
{
	display: flex;
	border-top: solid rgb(255, 255, 255, 0.4) 1px;
	padding: 2%;
	gap: 2%;
	margin-bottom: 2%;
}

.chanSearch > input
{
	flex: 3;
	border-radius: 40px;
	font-style: Myanmar;
	font-size: 120%;
	border: none;
	max-height: 40px;
    background-color: var(--input-fields);
    opacity: 50%;
}

.chanSearch > input:focus
{
	outline: solid rgb(255, 255, 255, 0.4) 2px;
	caret-color: rgb(255, 255, 255, 0.6);
}
.chanSearch > img
{
	margin-right: 4%;
	width: auto;
	max-height: 40px;
	background: none;
}

.chanSearch > img:hover
{
	cursor: pointer;
	background: rgb(255, 255, 255, 0.5);
}

.chanList
{
	flex: 9;
	border-bottom: none;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	margin-top: 0%;
	margin-bottom: 0;
	padding: 0;
	overflow-y:	scroll;
}

.channelName
{
	display: flex;
	flex-direction: row;
	text-align: center;
	border-bottom: solid white 1px;
	border-bottom-right-radius: 5px;
	border-bottom-left-radius: 5px;
	/* width: 100%; */
}

.channelName > div
{
	flex: 9;
	font-weight: bold;
}

.channelName > div > p {
	margin-top: 0px;
	margin-bottom: 0px;

}

.channelName > img
{
	margin-right: 3%;
	margin-left: 3%;
	flex: 1 1 1;
	border-radius: 50%;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	max-height: 70px;
	height: auto;
	width: auto;
	border: solid 2px white;
	object-fit: contain;
	margin-top: auto;
	margin-bottom: auto;
}

.channelName > img:hover
{
	background:	var(--deep-blue-10);
	color: white;
	cursor: pointer;
}

.chanNameButton
{
	width: 100%;
	height:	42px;
	text-align:	center;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	25px;
	color: white;
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
	font-size: 130%;
	margin-right: 4%;
	border-radius: 20px;
	height: auto;
	max-width: 80%;
	background-color:	rgba(23, 61, 199, 0.103);
}

.otherUserMess > p {
	margin: 0px;
}

.otherUserMess > button {
	margin: 0px;
	color: rgb(255,255,255, 0.7)
}

.currentUserMess
{
	display: flex;
	justify-content: right;
}

.currentUserMess > p
{
	margin: 7px;
}

.currentUserText
{
	display: inline-block;
	text-align: left;
	overflow-x: hidden;
	padding-right: 2%;
	padding-left: 2%;
	padding-top: 	1%;
	font-size: 130%;
	margin-right: 4%;
	border-radius: 20px;
	height: auto;
	max-width: 80%;
	background-color:	rgba(255, 255, 255, 0.24);
}

.currentUserText > p {
	margin: 0px;
}

.writing-zone
{
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top: none;
	display: flex;
	flex-direction:	row;
	width:		100%;
}

.writing-zone > input
{
	flex: 15;
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

.sendButton > img 
{
	object-fit: contain;
}
.sendButton
{
	flex: 1;
	margin-top: auto;
	margin-bottom: auto;
	margin-right: 1%;
	width: 70px;
	height:	70px;
	background: none;
}

.usernameButton {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}
.usernameButton:hover {
	text-decoration: underline;
	cursor: pointer;
}

.sendButton:hover
{
	border-radius: 5px;
	cursor: pointer;
	background: rgb(255, 255, 255, 0.2);
}

.watchButton {
	flex: 1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10px;
}


.playButton {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0, rgb(221, 172, 226) 0, rgb(73, 105, 219) 100%);
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 80px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

.playButton:hover {
  box-shadow: rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
  transform: translateY(-2px);
}

.playButton:active {
  box-shadow: rgb(23, 61, 199) 0 3px 7px inset;
  transform: translateY(2px);
}

.dmInfo {
	display: flex;
	gap: 15px;
	height: 42px;
	margin-top: 0px;
	margin-bottom: 0px;
	margin-left: 4%;
	letter-spacing:	1px;
	font-size: 85%;
	overflow: hidden;
}

.picture1 {
    width: 70px;
    height: 70px;
    border-radius: 35px;
	overflow: hidden;
	object-fit:cover;
	margin-top: 7px;
}

.picture2 {
    width: 35px;
    height: 35px;
    border-radius: 20px;
	overflow: hidden;
	object-fit:cover;
	margin-top: 3px;
}

.dmInfo > .name {
	flex: 3;
	text-align: left;
}
</style>
