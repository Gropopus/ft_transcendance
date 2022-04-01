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
	props:	{
		// userId:	{
		// 	type:	[Number, String],
		// 	default:	0
		// },
	},
	data:	function()	{
		return {
            channelId: 0,
            channel: [],
            listStatus: 0,
            userToMute: "",
            userToAdmin: "",
            error: "",
		}
	},

    mounted() {
        this.channel;
    },

    async created() {
        this.channelId = this.$route.params.id;
        this.channel = await fetchChannel();
        // this.users = await fetchusers();
    },

	methods:	{

        async fetchChannel() {
            const res = await fetch(`http://localhost:4200/api/channel/${this.channelId}/users`, {
                method: 'get',
                headers: { 'content-type': 'application/json' },
            });
            const data = await res.json();
            return data;
        },

        async fetchUsers() {
            const res = await fetch(
                `http://localhost:4200/api/channel/${this.channelId}/users`, {
                method: 'get',
                headers: { 'content-type': 'application/json' },
            });
            const data = await res.json();
            return data;
        },

        async muteUser() {
            // this.error = "";
            // if (!this.userToMute)
            //     return ;
            // const res = await fetch(
            //     `http://localhost:3000/api/users/find-by-username/${this.userToMute}`, {
            //     method: 'get',
            //    headers: { 'content-type': 'application/json' },
            // })
            // const user = await res.json();
            // if (user.length > 0)
            // {
            //     for (let username of this.userMutedList)
            //         if (username == this.userToMute)
            //             return ;
            //     this.userMutedList.push(this.userToMute);
            // }
            // else
            //     this.error = "user doesn't exist."
            // this.userToMute = "";
        },

        unmute(username: string) {
            // console.log(this.userMutedList[0])
            // for (let i in this.userMutedList)
            // {
            //     if (this.userMutedList[i] == username)
            //         this.userMutedList.splice(i, 1);
            // }
                    
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
