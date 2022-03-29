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
                <select class="chatType">
                    <option>public</option>
                    <option>protected</option>
                    <option>private</option>
                </select> <br>
                <!-- <input type="checkbox" v-model="chatType" placeholder="type" class="textArea">	<br> -->
            </div>
            

            <div class="formElem">
                <label for="password"> Password </label>	<br>
                <input type="password" v-model="chatPassword" placeholder="password" class="textArea">
            </div>
            
            <div class="formElem">
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
            </div>
            
			<!-- <div class="submitBar"> -->
				<button @click="createChat()" class="submitButton">
					Create
				</button>
			<!-- </div> submitBar end -->
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
	},
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
                this.$router.replace({name: 'chat'});
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

        async addUsername() {
            this.error = "";
            if (!this.userToAdd)
                return ;
            const res = await fetch(
                `http://localhost:3000/api/users/find-by-username/${this.userToAdd}`, {
                method: 'get',
               headers: { 'content-type': 'application/json' },
            })
            const user = await res.json();
            if (user.length > 0)
            {
                for (let username of this.usernameList)
                    if (username == this.userToAdd)
                        return ;
                this.usernameList.push(this.userToAdd);
            }
            else
                this.error = "user doesn't exist."
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
	/* border:	solid 3px white; */
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
	margin-top:	4%;
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

.error
{
    color:red;
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
