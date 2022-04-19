<template>
		 <div class="chatForm"> 
             <button @click="goBack()" class="BackButton">go back</button>
            <h1> 
                <div>{{ channelData.name }}</div>
                <div style="color: rgb(255,255,255,0.6);">settings</div>
            </h1>
            <div class="userList">
                <div class="listName">
                    List of users
                </div>
                <div :key="user.id" v-for="user in channelData.users">
                    <div class="displayUser">
                        <div class="role" v-if="user.status == 'online'" style="color: rgb(255, 228, 113);"> online </div>
                        <div class="role" v-else-if="user.status == 'offline'" style="color: rgb(255, 255, 255, 0.4);"> offline </div>
                        <div class="role" v-else style="color: rgb(200, 192, 255);"> in game </div>
                        <div @click="goToProfile(user.username)" class="username">{{ user.username }}</div>
                        <div v-if="role=='owner' && userId != user.id" class="buts">
                            <button v-if="!isAdmin(user.id)" @click="setAdmin(user.id)" class="addButton">set admin</button>
                            <button v-else @click="unsetAdmin(user.id)" class="addButton"> unset admin</button>
                            <button v-if="!isMute(user.id)" @click="muteUser(user.id)" class="addButton">mute</button>
                            <button v-if="!isBan(user.id)" @click="banUser(user.id)" class="addButton">ban</button>
                            <!-- <button v-else @click="unmuteUser(user.id)" class="addButton">unmute</button> -->
                            <button @click="removeUser(user.id)" class="addButton">remove</button>
                        </div>
                        <div v-if="isOwner(user.id)" class="role"> owner </div>
                        <div v-else-if="isAdmin(user.id)" class="role"> admin </div>
                        <div v-if="role=='admin' && userId != user.id && !isOwner(user.id) && !isAdmin(user.id)" class="buts">
                            <button v-if="!isBan(user.id)" @click="banUser(user.id)" class="addButton">ban</button>
                            <button v-if="!isMute(user.id)" @click="muteUser(user.id)" class="addButton">mute</button>
                            <button @click="removeUser(user.id)" class="addButton">remove</button>
                        </div>
                         <button v-if="isBan(user.id) && (role == 'owner' || (role == 'admin'))" @click="unbanUser(user.id)" class="addButton">unban</button>
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
                <p v-if="error" class="error"> {{ error }} </p>
                <label for="users">Add users</label> <br>
                <input type="text" v-model="search" v-on:keyup="searchUser()" placeholder="username" class="textArea">
                <div v-if="found.length" :key="user.id" v-for="user in found">
                    {{ user.username }}
                    <button @click="addUser(user)" class="addButton">
                        Add
                    </button>
                </div>
                <div v-if="role == 'owner'" style="margin-top:5%; margin-botton: 6%">
                    Change channel type:
                    <select class="selector" @change="changeType()">
                        <option :selected="isProtected(channelData.type)">protected</option>
                        <option :selected="!isProtected(channelData.type)">not protected</option>
                    </select>
                </div>
            </div>
            <div class="formElem" v-if="this.protected == 1 && role == 'owner'">
                <label for="password">Change channel password </label>	<br>
                <input type="password" v-model="chatPassword" class="textArea">
                <button @click="changePassword()" class="addButton">
                        update
                    </button> <br>
            </div>
            <div v-if="channelData.ban != undefined && channelData.ban.length" class="banList">
                <h3> Banned users </h3>
                <div :key="user.id" v-for="user in channelData.ban" class="banUser">
                    <p> {{ user.username }} </p>
                    <button v-if="role == 'owner' || role == 'admin'" @click="unbanUser(user.id)" class="addButton" style="margin-top: 3%; margin-bottom: 3%;"> unban </button>
                </div>
            </div>
            <button v-if="role=='owner'" @click="deleteChannel()" class="delButton">Delete channel</button>
            <button v-else @click="quitChannel()" class="delButton">Leave channel</button>
            </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent ({
    name: 'channelSetting',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0,
            required: true
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
            users: [],
            role: "",
            error: "",
            new_type: "",
            found: [],
            search: "",
            protected: 0,
		}
	},

	emits:	['userIsOnline'],

    mounted() {
        this.channelData;
    },

    async created() {
        this.channelId = this.$route.params.id;
        this.channelData = await this.fetchChannel();
        this.protected = this.channelData.type == 'protected' ? 1 : 0;
        this.setRole();
    },

    async updated() {
        await this.$emit('userIsOnline', this.userId);
    },

	methods:	{
        async goBack()
		{
			this.$router.replace({name: 'chat'});
		},
        async fetchChannel() {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/info`, {
                method: 'get',
                headers: { 'content-type': 'application/json' },
            });
            const data = await res.json();
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

        isBan(id: number) {
            for (let user of this.channelData.ban)
                if (user.id == id)
                    return true;
            return false;
        },

        isOwner(id: number) {
            return (id == this.channelData.owner.id);
        },

        isProtected(type: string)
        {
            if (type == 'protected')
                return (1);
            else
                return (0);
        },

        async changePassword()
        {
            if (!this.chatPassword)
                return ;
            const ret = await fetch(`http://localhost:3000/api/channel/${this.channelId}/changetype/protected`, {
                method: 'put',
                headers: { 'content-type': 'application/json' },
            });
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/update-password`, {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({password: this.chatPassword})
            });
            this.chatPassword = "";
            this.channelData = await this.fetchChannel();
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

        async banUser(id: number)
        {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/ban/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async unbanUser(id: number) { 
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/unban/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
            this.channelData = await this.fetchChannel();
        },

        async addUser(user: any) {
            let found = 0;
            this.error = "";
            if (!user)
                return ;
            if (this.isBan(user.id) == true)
                this.unbanUser(user.id);
            await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/adduser/${user.username}`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' ,
                    'Access-Control-Allow-Origin': '*'},
                    body: JSON.stringify({password: this.chatPassword, isAdd: 1}),
            });
            this.channelData = await this.fetchChannel();
            this.search = "";
            this.found = [];
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
            this.$router.push('/chat');
        },

        async quitChannel() {
            const res = await fetch(
                `http://localhost:3000/api/channel/${this.channelId}/remove/${this.userId}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            });
            this.$router.push('/chat');
        },
        async changeType(){
            if (this.isProtected(this.channelData.type) == 1)
            {
                const res = await fetch(`http://localhost:3000/api/channel/${this.channelId}/changetype/public`, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' },
                });
            }
            if (this.protected == 1)
                this.protected = 0;
            else
                this.protected = 1;
            this.channelData = await this.fetchChannel();
        },

        isInChannel(id: number) {
            for (let user of this.channelData.users)
                if (user.id == id)
                    return true;
            return false;
        },

		goToProfile(username: string) {
            this.$router.push(`/profile/${username}`)
        },

        filterList(list: any) {
            let newList = [];
            for (const user of list)
                if (!this.isInChannel(user.id))
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
})
</script>

<style lang="css" scoped>

.BackButton {
    width: 10%;
    min-width: 20px;
    padding: 6px;
	font-size:	20px;
    margin-left: 1%;
	border:	solid 2px white;
    background: none;
    color: white;
    cursor: pointer;
}
.BackButton:hover {
	background:	var(--deep-blue-10);
}

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
    min-width: 800px;
	height:	100%;
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
}

.displayUser > .username:hover {
    text-decoration: underline;
    cursor: pointer;
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
    display: flex;
    flex-direction: column;
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

.error {
	margin-top: auto;
	margin-bottom: 1%;
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
    max-width: 50px;
}

.selector {
	padding-top: 1%;
    margin-left: 10%;
	width: 20%;
	background:	white;
	border:	solid rgb(238, 220, 220);
	font-size:	100%;
	color:	rgb(236, 100, 151);
	border-radius: 4px;
	font-family: MyanmarText;
}

.banUser {
    display: flex;
    margin-left: 3%;
    gap: 10%;
}

.banList {
    margin-bottom: 5%;
    width: 50%;
}

.banList > h3 {
    border-bottom: solid 1px white;
}

</style>
