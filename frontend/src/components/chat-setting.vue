<template>
		 <div class="chatForm"> 
            <h1> {{ channelData.name }}: settings </h1>
            <div class="userList">
                <div class="listName">
                    List of users
                </div>
                <div :key="user.id" v-for="user in channelData.users">
                    <div class="displayUser">
                        <div class="username">{{ user.username }}</div>
                        <div v-if="role=='owner' && userId != user.id" class="buts">
                            <button v-if="!isAdmin(user.id)" @click="setAdmin(user.id)" class="addButton">set admin</button>
                            <button v-else @click="unsetAdmin(user.id)" class="addButton"> unset admin</button>
                            <button v-if="!isMute(user.id)" @click="muteUser(user.id)" class="addButton">mute</button>
                            <!-- <button v-else @click="unmuteUser(user.id)" class="addButton">unmute</button> -->
                            <button @click="removeUser(user.id)" class="addButton">remove</button>
                        </div>
                        <div v-if="isOwner(user.id)" class="role"> owner </div>
                        <div v-else-if="isAdmin(user.id)" class="role"> admin </div>
                        <div v-if="role=='admin' && userId != user.id && !isOwner(user.id) && !isAdmin(user.id)" class="buts">
                            <button v-if="!isMute(user.id)" @click="muteUser(user.id)" class="addButton">mute</button>
                            <button @click="removeUser(user.id)" class="addButton">remove</button>
                        </div>
                        <img
                            v-if="isMute(user.id) && (role == 'owner' || (role == 'admin' && !isAdmin(user.id)))"
                            title="unmute"
                            @click="unmuteUser(user.id)"
                            class="muteIcon"
                            src="/src/assets/muted-users.png" />
                        <img v-else-if="isMute(user.id)" class="muteIcon" src="/src/assets/muted-users.png" />
                    </div>
                </div>
            </div>
            <div v-if="role == 'admin' || role == 'owner'" class="formElem">
                <label for="users">Add users</label> <br>
                <input type="text" v-model="userToAdd" placeholder="username" class="textArea">
                    <button @click="addUser()" class="addButton">
                        add
                    </button> <br>
            </div>
            <div class="formElem" v-if="channelData.type == 'protected'">
                <label for="password">Change channel password </label>	<br>
                <input type="password" v-model="chatPassword" class="textArea">
                <button @click="changePassword()" class="addButton">
                        update
                    </button> <br>
            </div>
            <button v-if="role=='owner'" @click="deleteChannel()" class="delButton">Delete channel</button>
            <p class="error"> {{ error }} </p>
            </div>
</template>

<script lang="ts">

// import { labeledStatement } from '@babel/types';
import { defineComponent } from 'vue';

export default defineComponent ({
    name: 'channelSetting',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		},
	},
	data:	function()	{
		return {
            channelId: 0,
            channelData: {},
            listStatus: 0,
            userToMute: "",
            userToAdmin: "",
            chatPassword: "",
            userToAdd: "",
            users: [],
            role: "",
            error: "",
		}
	},

    mounted() {
        this.channel;
    },

    async created() {
        this.channelId = this.$route.params.id;
        this.channelData = await this.fetchChannel();
        this.setRole();
    },

	methods:	{

        async fetchChannel() {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/info`, {
                method: 'get',
                headers: { 'content-type': 'application/json' },
            });
            const data = await res.json();
            console.log(data.items[0])
            return data.items[0];
        },

        setRole() {
            if (this.isOwner(this.userId))
                this.role = "owner";
            else if (this.isAdmin(this.userId))
                this.role = "admin";
            else
                this.role = "user"
        },

        isAdmin(id: number) {
            for (let user of this.channelData.admin)
                if (user.id == id)
                    return true;
            return false;
        },

        isMute(id: number) {
            for (let user of this.channelData.muted)
                if (user.id == id)
                    return true;
            return false;
        },

        isOwner(id: number) {
            return (id == this.channelData.owner.id);
        },

        async muteUser(id: number) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/mute/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async unmuteUser(id: number) { 
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/unmute/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async addUser() {
            let found = 0;
            this.error = "";
            if (!this.userToAdd)
                return ;
            const res = await fetch(
                `http://localhost:3000/api/users/find-by-username/${this.userToAdd}`, {
                    method: 'get',
               headers: { 'content-type': 'application/json' },
            })
            const user = await res.json();
            for (let elem of user)
            {
                if (elem.username == this.userToAdd)
                {
                    if (!this.isInChannel(elem.id))
                    {
                        console.log('OKKKKKK')
                        await fetch(
                            `http://localhost:3000/api/channel/${this.channelId}/adduser/${this.userToAdd}`, {
                                method: 'put',
                                headers: { 'content-type': 'application/json' ,
                                'Access-Control-Allow-Origin': '*'},
                                body: JSON.stringify({password: this.chatPassword}),
                        });
                        this.userToAdd = "";
                        this.channelData = await this.fetchChannel();
                    }
                    else
                        this.error = "User already in the channel.";
                    return ;
                }
            }
            this.error = "User doesn't exist.";
            this.userToAdd = "";
        },

        async removeUser(id: number) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/remove/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async setAdmin(id: number) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/admin/give/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async unsetAdmin(id: number) {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/admin/remove/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async deleteChannel() {
            const res = await fetch(
                `http://localhost:3000/api/channel/delete/${this.channelId}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            });
            this.$router.replace('/chat');
        },

        isInChannel(id: number) {
            for (let user of this.channelData.users)
                if (user.id == id)
                    return true;
            return false;
        },

		setDiplayState() {
            this.listStatus = 1 - this.listStatus;
		},
	}
})
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
	/* border:	solid 3px white; */
	font-size:	20px;
	font-family: MyanmarText;
	font-weight:	bold;
}

.userList {
    margin-bottom: 5%;

}
.displayUser {
    display: flex;
    gap: 2%;
    border-bottom: solid 1px white;
}

.displayUser > .username {
    margin-left: 2%;
    margin-top: 2%;
    margin-bottom: 2%;    
    width: 25%;
    /* color:rgb(37, 46, 131) */
}

.role {
    margin-right: 2%;
    font-size: 15px;
    margin-top: 2%;
    margin-bottom: 2%;
    color: rgb(255, 255, 255, 0.6);
}
.displayUser > .buts {
    flex: 1 1 0;
    margin-top: 2%;
    margin-bottom: 2%;
}
.chatForm > .userList > .listName {
    display:flex;
    flex-direction: row;
    text-align: left;
    border-bottom: solid 2px white;
    margin-bottom: 0px;
    font-size: 30px;
    gap: 2%;
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

.chatForm > .submitButton:hover {
	background:	var(--deep-blue-10);
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


.delButton {
    padding: 6px;
	font-size:	20px;
    margin-left: 1%;
	border:	solid 1px red;
    background: rgb(255,255,255, 0.2);
    color: white;
    color: red;

}

.delButton:hover {
    text-decoration: underline;
    cursor: pointer;
}

.muteIcon {
    margin-top: 2%;
    margin-bottom: 2%;
    height: 7%;
    width: 7%;
}

</style>
