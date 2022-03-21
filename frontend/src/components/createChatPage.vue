<template>
		<div class="chatForm">
            <h1> Create a new channel </h1>
			<label for="chatName"> Name </label>	<br>
			<input type="text" v-model="chatName" placeholder="Name" class="textArea">	<br>

			<label for="description"> Description </label>	<br>
			<input type="text" v-model="chatDescription" placeholder="description" class="textArea">	<br>

            <label for="type"> Type </label>	<br>
            <select v-model="chatType">
                <option>public</option>
                <option>protected</option>
                <option>private</option>
            </select> <br>
			<!-- <input type="checkbox" v-model="chatType" placeholder="type" class="textArea">	<br> -->

			<label for="password"> Password </label>	<br>
			<input type="password" v-model="chatPassword" placeholder="password" class="textArea">	<br>
            <label for="users">Add users</label> <br>
            <input type="text" v-model="userToAdd" placeholder="username" class="textArea">
                <button @click="addUsername()" class="addButton">
                    add
                </button> <br>
            <div :key="username" v-for="username in usernameList">
                {{ username }}
                <button @click="deleteUsername(username)" class="deleleButton">
                    x
                </button>
            </div>
			<div class="submitBar">
				<button @click="createChat()" class="submitButton">
					Create
				</button>
			</div> <!-- submitBar end -->
            <p class="error"> {{ error }} </p>
		</div> <!-- RegisterForm end -->
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		},
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		}
	},
	emits:	['update:currentPage'],
	data:	function()	{
		return {
			chatName:	"",
			chatPassword:	"",
			chatDescription:	"",
            chatType: "",
            usernameList: [],
            userToAdd: "",
            error: "",
		}
	},

	methods:	{
		async createChat()	{
            this.error = "";
            if (!this.chatName || !this.chatDescription)
                this.error = "incomplete.";
            else if (this.chatType != "public" && !this.chatPassword)
                this.error = "Password needed.";
            else
            {
                const req = {
                    name: this.chatName,
                    description: this.chatDescription,
                    password: this.chatPassword,
                    type: this.chatType,
                    users: [],
                    muted: [],
                    admin: []
                }
                const res = await fetch(`http://localhost:3000/api/channel/new/${this.userId}`, {
                    method: 'put',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(req)
                })
                const chan = await res.json();
                for (let username of this.usernameList)
                    this.addUserToChannel(chan.id, username);
                this.$emit('update:currentPage', "1");
            }
		},

        async addUserToChannel(channelId: number, username: string) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${channelId}/adduser/${username}/${this.chatPassword}`, {
                    method: 'put',
                        headers: { 'content-type': 'application/json' },
                })
            console.log((await res.json()))
        },

        addUsername() {
            if (!this.userToAdd)
                return ;
            for (let username of this.usernameList)
                if (username == this.userToAdd)
                    return ;
            this.usernameList.push(this.userToAdd);
            this.userToAdd = "";
        },

        deleteUsername(username: string) {
            console.log(this.usernameList[0])
            for (let i in this.usernameList)
            {
                if (this.usernameList[i] == username)
                    this.usernameList.splice(i, 1);
            }
                    
        },
	}
}
</script>

<style>

.chatForm
{
	border-radius: 5px;
	margin-top:	2%;
	margin-bottom:	5%;
	margin-left:	auto;
	margin-right:	auto;
	padding-top:	2%;
	padding-left:	5%;
	width:	100%;
	height:	100%;
	/* border:	solid 3px white; */
	font-size:	20px;
	font-family: MyanmarText;
	font-weight:	bold;
}

.chatForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
}

.chatForm > .submitBar
{
	margin-top:	4%;
	display:	flex;
	margin-right:	auto;
	margin-left:	auto;
	flex-direction:	row;
}

.chatForm > .submitBar > .submitButton
{
	display:	block;
	background:	none;
	flex:	0 0 auto;
	margin-bottom:	5%;
	margin-right:	auto;
	padding-top:	1%;
	padding-bottom:	1%;
	padding-left:	3%;
	padding-right:	3%;
	background:	none;
	border:	solid 3px white;
	font-size:	24px;
	color:	white;
	font-family: MyanmarText;
}

.error
{
    color:red;
}
</style>
