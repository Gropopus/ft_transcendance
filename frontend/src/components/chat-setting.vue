<template>
		<div class="chatForm">
            <h1> Channel settings </h1>
			<div class="listName">
				List of users
				<!-- <div class="icon">
					<img :src="relation.icon"/>
				</div> -->
				<button @click="setDiplayState()"  class="arrow">
					<img v-if="listStatus == 0" src="/src/assets/arrow-whitedown.png"/>
					<img v-else src="/src/assets/arrow-white-up.png" />
				</button>
			</div>
            <div v-if="listStatus">
                <div :key="user.id" v-for="user in channelData.users">
                    <div class="displayUser">
                        {{ user.username }}
                        <div v-if="isOwner(user.id)"> owner </div>
                        <div v-else-if="isAdmin(user.id)"> admin </div>
                        <div v-else-if="isMute(user.id)"> mute </div>
                        <div v-if="role=='owner' && userId != user.id">
                            <button v-if="!isMute(user.id)" @click="muteUser(user.id)">mute</button>
                            <button v-else @click="unmuteUser(user.id)">unmute</button>
                            <button>x</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="formElem" v-if="protected">
                <label for="password">Change channel password </label>	<br>
                <input type="password" v-model="chatPassword" class="textArea">
                <button @click="changePassword()" class="addButton">
                        update
                    </button> <br>
            </div>
            
            <div class="formElem">
                <label for="users">mute users:</label> <br>
                <input type="text" v-model="userToMute" class="textArea">
                    <button @click="muteUser()" class="addButton">
                        Mute
                    </button> <br>
                <div :key="userToMute" v-for="userToMute in userMutedList">
                    {{ userToMute }}
                    <button @click="unmute(userToMute)" class="deleleButton">
                        x
                    </button>
                </div>
            </div>
            <div class="formElem">
                <label for="users">manage administrators: </label> <br>
                <input type="text" v-model="userToAdmin" class="textArea">
                    <button @click="promoteAdmin()" class="addButton">
                        add
                    </button> <br>
                <div :key="username" v-for="username in adminList">
                    {{ username }}
                    <button @click="fireAdmin(username)" class="deleleButton">
                        x
                    </button>
                </div>
            </div> -->
            <!-- <div class="formElem" v-if="owner" >
                <label for="users">Delete channel: </label>
                    <button @click="deleteChannel()" class="addButton">
                        delete
                    </button> <br>
            </div> -->
            <p class="error"> {{ error }} </p>
		</div> <!-- RegisterForm end -->
</template>

<script lang="ts">

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
                `http://localhost:3000/api/channel/:id/mute/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
        },

        async unmuteUser(id: number) { 
            const res = await fetch(
                `http://localhost:3000/api/channel/:id/unmute/${id}`, {
                method: 'put',
               headers: { 'content-type': 'application/json' },
            })
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

.displayUser {
    display: flex;
    gap: 2%;
}
.chatForm > .listName {
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
