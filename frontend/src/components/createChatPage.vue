<template>
		<div class="chatForm">
            <h1> Create a new channel </h1>
            <div class="formElem">
                <label for="chatName"> Name </label>	<br>
                <input type="text" v-model="chatName" placeholder="Name" class="textArea">
            </div>

            <div class="formElem">
                <label for="description"> Description </label>	<br>
                <input type="text" v-model="chatDescription" placeholder="description" class="textArea">
            </div>

            <div class="formElem">
                <label for="type"> Type </label>	<br>
                <select class="chatType" v-model="chatType">
                    <option selected>public</option>
                    <option>protected</option>
                    <option>private</option>
                </select> <br>
            </div>
            

            <div v-if="chatType=='protected'" class="formElem">
                <label for="password"> Password </label>	<br>
                <input type="password" v-model="chatPassword" placeholder="password" class="textArea">
            </div>
            
            <div class="formElem">
                <label for="users">Add users</label> <br>
                <div :key="username" v-for="username in usernameList">
                    {{ username }}
                    <button @click="deleteUsername(username)" class="deleteButton1">
                        x
                    </button>
                </div>
                <input type="text" v-model="search" v-on:keyup="searchUser()" placeholder="username" class="textArea">
                <div v-if="found.length" :key="user.id" v-for="user in found">
                    {{ user.username }}
                    <button @click="addUsernameToList(user)" class="addButton">
                        Add
                    </button>
                </div>
                <p v-if="error" class="error"> {{ error }} </p>
            </div>
            
				<button @click="createChat()" class="submitButton">
					Create
				</button>
		</div> <!-- RegisterForm end -->
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0,
            required: true
		},
	},
	data:	function()	{
		return {
			chatName:	"",
			chatPassword:	"",
			chatDescription:	"",
            chatType: "",
            usernameList: [],
			found: [],
            search: "",
            error: "",
		}
	},

	emits:	['userIsOnline'],

    async updated() {
        await this.$emit('userIsOnline', this.userId);
    },

	methods:	{
		async createChat()	{
            this.error = "";
            if (!this.chatName || !this.chatDescription || !this.chatType)
                this.error = "Incomplete";
            else if (this.chatType == "protected" && (!this.chatPassword || this.chatPassword.length > 42))
            {
                this.error = "Invalid password";
                return ;
            }
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
                this.$router.push({name: 'chat'});
            }
		},

        async addUserToChannel(channelId: number, username: string) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${channelId}/adduser/${username}`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' ,
                    'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({password: this.chatPassword}),
            });
        },

        deleteUsername(username: string) {
            for (let i in this.usernameList)
            {
                if (this.usernameList[i] == username)
                    this.usernameList.splice(i, 1);
            }
                    
        },

		isInChan(user: any)	{
			if (user.id == this.userId)
				return (true);
			if (this.usernameList.length != 0)	{
				for (const elem of this.usernameList)	{
					if (elem == user.username)
						return (true);
				}
			}
			return (false);
		},

		addUsernameToList(user: any) {
			this.usernameList.push(user.username);
			this.found.splice(user, 1);
		},

        filterList(list: any) {
            let newList = [];
            for (const user of list)
                if (!this.isInChan(user))
                    newList.push(user);
            return newList;
        },

		async searchUser() {
			if (!this.search)
			{
				this.found = [];
				return [];
			}
			const res = await fetch(`http://localhost:3000/api/users/search/${this.search}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' }
			})
			.then(res => {
				return res.json();
			})
			.then((resJson) => {
				this.found = this.filterList(resJson);
				return resJson;
			})
			.catch(error => {
				this.found = [];
				return [];
			});
		},
	}
}
</script>

<style lang="css" scoped>

.chatForm
{
    display: flex;
    flex-direction: column;
	border-radius: 5px;
	margin-top:	2%;
	margin-bottom:	5%;
	margin-left:	auto;
	margin-right:	auto;
	padding-top:	2%;
	padding-left:	5%;
	width:	50%;
	height:	100%;
	font-size:	20px;
	font-family: MyanmarText;
	font-weight:	bold;
}

.chatForm > h1 {
    text-align: center;
    border-bottom : solid 1px white;
}

.chatForm > .formElem {
    margin-left: 0%;
    margin-bottom: 3%;
}

.chatForm > .formElem > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
}

.chatForm > .submitButton
{
	margin-top:	3%;
	display: flex;
	justify-content: center;
	align-items:	center;
    text-align: center;
	background:	none;
	border:	solid 3px white;
	font-size:	24px;
	color:	white;
	font-family: MyanmarText;
    width: 20%;
}

.chatForm > .submitButton:hover {
	background:	var(--deep-blue-10);
}
.error {
	margin-top: 3%;
	margin-bottom: 0px;
	justify-content: top;
	text-align: center;
	border: solid 1px rgb(240, 69, 69);
	background: rgb(255, 0, 0, 0.06);
	color: rgb(255, 255, 255, 0.7);
}
.addButton {
    padding: 6px;
	font-size:	20px;
    margin-left: 1%;
	border:	solid 2px white;
    background: none;
    color: white;
}

.addButton:hover {
	background:	var(--deep-blue-10);
}

.searchButton {
    padding: 6px;
	font-size:	20px;
    margin-left: 1%;
	border:	solid 2px white;
    background: none;
    color: white;
}

.searchButton:hover {
	background:	var(--deep-blue-10);
}

.deleteButton1 {
    background: none;
    border: solid 2px rgb(236, 100, 151);
    background: white;
    color: rgb(236, 100, 151);
}

.deleteButton1:hover {
	background:	var(--deep-blue-10);
}

.chatType {
	padding-top: 1%;
	width: 50%;
	background:	white;
	border:	solid rgb(238, 220, 220);
	font-size:	100%;
	color:	rgb(236, 100, 151);
	border-radius: 4px;
	font-family: MyanmarText;
}
</style>
