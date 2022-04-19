<template>
<div style="display: flex; flex-direction: column">
	<div class="searchBar" style="margin-right: 3%">
		<div style="display: flex; justify-content: right">
			<img style="height: 25px" src="../assets/magnifying-glass.png">
			<span style="font-size: 15px; text-align: right; margin-left: 1%"> Search a user</span>
		</div>
		<input type="text" v-model="search" v-on:keyup="searchUser()" class="textArea1" style="height: 15px;">
		<div class="friendFound" v-if="found.length"  :key="elem.id" v-for="elem in found">
			<p v-on:click="goToUserProfile(elem)"> {{ elem.username }}</p>
		</div>
	</div>
	<div v-if="userData != undefined" class="user-profile">
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="status" v-if="userData.status == 'online'" style="color: rgb(255, 228, 113);"> online </div>
				<div class="status" v-else-if="userData.status == 'offline'" style="color: rgb(255, 255, 255, 0.4);"> offline </div>
				<div class="status" v-else style="color: rgb(200, 192, 255);"> in game </div>
			</div>
			<div v-if="userId != userData.id" class="relation">
				<img v-if="!isBlocked()" @click="sendMessage()" src="/src/assets/message03.png" class="challengeButton" title="send a message"/>
				<img v-if="challengeIcon.img && userId != userData.id && !isBlocked()" :src="challengeIcon.img" class="challengeButton" @click="challenge()" :title="challengeIcon.title">
				<img v-if="friendIcon.img" :src="friendIcon.img"  @click="addOrRemovefriend()"  class="relationButton" :title="friendIcon.title" />
				<p v-else-if="relation=='resquest-pending'" class="pending">request <br> pending...</p>
				<div v-else-if="!isBlocked()" class="replyButton">
					<button @click="acceptRequest()">accept</button>
					<button @click="declineRequest()">decline</button>
				</div>
				<img v-if="blockIcon.img && !isBlocked()" :src="blockIcon.img" @click="blockUser()" class="blockButton" :title="blockIcon.title">
				<img v-else v-if="unblockIcon.img && this.userData" :src="unblockIcon.img" @click="unblock()" class="unblockButton" :title="unblockIcon.title">
			</div>
		</div>
		<div class="StatsWin">
			<div class="StatsTabs">
				<button class="tab"  @click="changeCurrent(0)" :id="isCurrentTab(0)"> Statistics </button>
				<button class="tab" @click="changeCurrent(1)" :id="isCurrentTab(1)"> Achievements </button>
				<button class="tab"  @click="changeCurrent(2)" :id="isCurrentTab(2)"> History </button>
				<button class="tab corner"  @click="changeCurrent(3)" :id="isCurrentTab(3)"> Ladder </button>
			</div>
			<div class="StatsArea">
				<div v-if="currentTab==0" class="stat">
					<div class="statElem">
						<h3>Rank</h3>
						<p> {{ userLadder.level }} / {{ userLadder.total }} </p>
					</div>
					<div class="statElem">
						<h3>Elo</h3>
						<p> {{ userData.level }}  </p>
					</div>
					<div class="statElem">
						<h3>Victories</h3>
						<p>{{ userData.victory }}</p>
					</div>
					<div class="statElem">
						<h3>Defeats</h3>
						<p>{{ userData.defeat }}</p>
					</div>
				</div>
				<div v-if="currentTab==1" class="achievements">
					<div class="achievementsTable">
						<div class="achievementsCol">
							<div :key="file.name" v-for="file in socialAchievements" :description="file.title + ': ' + file.description">
								<img v-if="file.status == 1" :src="file.iconOn">
								<img v-else :src="file.iconOff">
							</div>
						</div>
						<div class="achievementsCol">
							<div :key="file.title" v-for="file in victoryAchievements" :description="file.title + ':\n' + file.description">
								<img v-if="file.status == 1" :src="file.iconOn">
								<img v-else :src="file.iconOff">
							</div>
						</div>
						<div class="achievementsCol">
							<div :key="file.title" v-for="file in chanAchievements" :description="file.title + ':\n' + file.description">
								<img v-if="file.status == 1" :src="file.iconOn">
								<img v-else :src="file.iconOff">
							</div>
						</div>
						<div class="achievementsCol">
							<div :key="file.title" v-for="file in eloAchievements" :description="file.title + ':\n' + file.description">
								<img v-if="file.status == 1" :src="file.iconOn">
								<img v-else :src="file.iconOff">
							</div>
						</div>
					</div>
				</div>
				<div v-if="currentTab==2" class="history">
					<div class="histCats">
						<div> Result </div>
						<div> Mode </div>
						<div> Player Score </div>
						<div> Opponent Score </div>
						<div> Opponent </div>
					</div>
					<div :key="elem.id" v-for="elem in gameHistory">
						<div class="histElem" v-if="elem.player_left_id != undefined" v-bind:style='{"background" : (whoWon(elem.player_left_id) ? "none" : "rgb(224, 55, 55, 0.5)")}'>
							<div v-if="whoWon(elem.player_left_id)">
								Victory
							</div>
							<div v-else>
								Defeat
							</div>
							<div> {{ elem.mode }} </div>
							<div v-if="UserIsPlayer(elem.player_right_id.user.id)"> {{ elem.score_r }} </div>
							<div v-else> {{ elem.score_l }} </div>
							<div v-if="UserIsPlayer(elem.player_right_id.user.id)"> {{ elem.score_l }} </div>
							<div v-else> {{ elem.score_r }} </div>
							<div v-if="UserIsPlayer(elem.player_right_id.user.id)" class="userLink" @click="goToUserProfile(elem.player_left_id.user)"> {{ elem.player_left_id.user.username }} </div>
							<div v-else class="userLink" @click="goToUserProfile(elem.player_right_id.user)"> {{ elem.player_right_id.user.username }} </div>
						</div>
					</div>
				</div>
				<div v-if="currentTab==3 && ladder != undefined">
					<div class="ladder">
						<div class="ladderCats">
							<div> Rank </div>
							<div> User Name </div>
							<div> Elo score </div>
						</div>
						<div :key="elem.level" v-for="(elem, index) in ladder" class="laddElem" v-bind:style='{"background" : (UserIsPlayer(elem.id)) ? "var(--deep-blue-50)" : "none"}'>
							<div> {{ index + 1 }} </div>
							<div class="userLink" @click="goToUserProfile(elem)"> {{ elem.username }} </div>
							<div> {{ elem.level }} </div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'userPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0",
			required: true
		},
	},
	data() {
		return {
			friendIcon: {img: "/src/assets/friends-requests.png", title:"add"},
			challengeIcon: {img: "/src/assets/challenge01.png", title:"challenge"},
			blockIcon: {img: "/src/assets/plain-cat.png", title:'block'},
			unblockIcon: {img: "/src/assets/plain-cat.png", title:'unblock'},
			userData: [],
			relation: "",
			picture: "",
			relationIcon: "",
			picture: "",
			found: [],
            search: "",
			currentTab: 0,
			userData: [],
			userLadder: 0,
			ladder:	[],
			gameHistory: [],
			socialAchievements: [
                {name: "Social 1", title: "Ermit" , iconOn: "/src/assets/achievments/Friends_Bronze_ON.png", iconOff: "/src/assets/achievments/Friends_Bronze_OFF.png", status: 0, description: "Have one person in you friend list"},
                {name: "Social 2", title: "Social Butterfly" , iconOn: "/src/assets/achievments/Friends_Sivler_ON.png", iconOff: "/src/assets/achievments/Friends_Silver_OFF.png", status: 0, description: "Befriend 5 users"},
                {name: "Social 3", title: "I know people" , iconOn: "/src/assets/achievments/Friends_Gold_ON.png", iconOff: "/src/assets/achievments/Friends_Gold_OFF.png", status: 0, description: "Befriend 20 users"},
            ],
			victoryAchievements: [
                {name: "Victory 1", title: "Newbie" , iconOn: "/src/assets/achievments/Victory_Bronze_ON.png", iconOff: "/src/assets/achievments/Victory_Bronze_OFF.png", status: 0, description: "Win your first game"},
                {name: "Victory 2", title: "Commander" , iconOn: "/src/assets/achievments/Victory_Silver_ON.png", iconOff: "/src/assets/achievments/Victory_Silver_OFF.png", status: 0, description: "Win 10 games"},
                {name: "Victory 3", title: "Emperor" , iconOn: "/src/assets/achievments/Victory_Gold_ON.png", iconOff: "/src/assets/achievments/Victory_Gold_OFF.png", status: 0, description: "Win 50 games"},
            ],
			chanAchievements: [
                {name: "Chan 1", title: "Deputy" , iconOn: "/src/assets/achievments/Channel_Bronze_ON.png", iconOff: "/src/assets/achievments/Channel_Bronze_OFF.png", status: 0, description: "Join your first channel"},
                {name: "Chan 2", title: "Senator" , iconOn: "/src/assets/achievments/Channel_Silver_ON.png", iconOff: "/src/assets/achievments/Channel_Silver_OFF.png", status: 0, description: "Participate in 5 channels"},
                {name: "Chan 3", title: "Mr President" , iconOn: "/src/assets/achievments/Channel_Gold_ON.png", iconOff: "/src/assets/achievments/Channel_Gold_OFF.png", status: 0, description: "Participate in 10 channels"},
            ],
			eloAchievements: [
                {name: "Elo 1", title: "Rookie" , iconOn: "/src/assets/achievments/Elo_Bronze_ON.png", iconOff: "/src/assets/achievments/Elo_Bronze_OFF.png", status: 0, description: "Reach an Elo score of 1050"},
                {name: "Elo 2", title: "Veteran" , iconOn: "/src/assets/achievments/Elo_Silver_ON.png", iconOff: "/src/assets/achievments/Elo_Silver_OFF.png", status: 0, description:  "Reach an Elo score of 1200"},
                {name: "Elo 3", title: "GrandMaster" , iconOn: "/src/assets/achievments/Elo_Gold_ON.png", iconOff: "/src/assets/achievments/Elo_Gold_OFF.png", status: 0, description:  "Reach an Elo score of 1400"},
            ],
		}
	},

	emits:	['userIsOnline'],

	async mounted() {
		this.userData;
		this.relation;
		this.userLadder;
		this.gameHistory;
		this.ladder;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.picture = await this.getPicture();
		this.userLadder = await this.fetchLadderLevel();
		this.gameHistory = await this.fetchPlayerHistory();
		this.ladder = await this.fetchLadder();
		await this.setAchievementStatus();
		await this.update();
	},

    async updated() {
        await this.$emit('userIsOnline', this.userId);
    },

	methods: {
		changeCurrent(index: number) {
			this.currentTab = index;
		},

		isCurrentTab(tab: number) {
			if (this.currentTab == tab)
				return "CurrentTab";
			else
				return "notCurrentTab";
		},

		async update() {
			this.userData = await this.fetchUserData();
			this.relation = await this.fetchRelation();
			this.userLadder = await this.fetchLadderLevel();
			if (this.isFriend())
				this.friendIcon = {img: "/src/assets/muted-users.png", title: "remove friend"};
			else if (!this.relation)
				this.friendIcon = {img: "/src/assets/friends-requests.png", title:"add friend"};
			else
				this.friendIcon = {img: "", title: this.relation};
		},

		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/find-by-username/${this.$route.params.username}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const user = await res.json();
			return user;
		},

		async fetchRelation() {
			if (this.userData === undefined)
				this.userData = await this.fetchUserData();
			return await fetch(`http://localhost:3000/api/friends/${this.userId}/status/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			.then(res => {
				return res.json();
			})
			.then((resJson) => {
				return resJson.status;
			})
			.catch(error => {
				return "";
			});
		},

		async addOrRemovefriend(){
			if (this.isFriend()) {
				await fetch(`http://localhost:3000/api/friends/${this.userId}/unfriend/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
			}
			else if (!this.relation) {
				await fetch(`http://localhost:3000/api/friends/${this.userId}/add/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
			}
			this.update();
		},

		async blockUser(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/block/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		async unblock(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/unblock/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		async acceptRequest(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/accept/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		async declineRequest(){
			await fetch(`http://localhost:3000/api/friends/${this.userId}/decline/${this.userData.id}`, {
    			method: 'put',
    			headers: { 'content-type': 'application/json' }
    		});
			this.update();
		},

		isFriend() {
			if (this.relation == "friends")
				return true;
			return false;
		},

		isBlocked() {
			if (this.relation == "user-blocked")
				return true;
			return false;
		},

		async getPicture()
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userData.id}`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
    		return blobUrl;
		},

		async challenge() {
			const ret = await fetch(` http://localhost:3000/api/game/newchallengeid/`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const challengeId = await ret.json();
			
			let res = await fetch(
				`http://localhost:3000/api/channel/direct-message/${this.userId}/${this.userData.id}`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			let data = await res.json();
			if (!data.items.length) {
				res = await fetch(
					`http://localhost:3000/api/channel/direct-message/new/${this.userId}/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
				data = await res.json();
				this.$router.push({path: '/chat', query: {id: data.id, challengeId: challengeId}});
			}
			else
				this.$router.push({path: '/chat', query: {id: data.items[0].id, challengeId: challengeId}});

			return "";
		},

		async sendMessage() {
			let res = await fetch(
				`http://localhost:3000/api/channel/direct-message/${this.userId}/${this.userData.id}`, {
				method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			let data = await res.json();
			if (!data.items.length) {
				res = await fetch(
					`http://localhost:3000/api/channel/direct-message/new/${this.userId}/${this.userData.id}`, {
					method: 'put',
					headers: { 'content-type': 'application/json' }
				});
				data = await res.json();
				this.$router.push({path: '/chat', query: {id: data.id}});
			}
			else
				this.$router.push({path: '/chat', query: {id: data.items[0].id}});
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
				this.found = resJson;
				return resJson;
			})
			.catch(error => {
				this.found = [];
				return [];
			});
		},

		async fetchLadderLevel() {
			const res = await fetch(`http://localhost:3000/api/users/ladder-level/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const userLadder = await res.json();
			return userLadder;
		},

		async fetchPlayerHistory() {
			const res = await fetch(`http://localhost:3000/api/game/history/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const history = await res.json();
			return history.items;
		},

		async setSocialStatus() {
			const res = await fetch(`http://localhost:3000/api/friends/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const friends = await res.json();
			const size = friends.length;
			if (size >= 1)
				this.socialAchievements[0].status = 1;
			if (size >= 5)
				this.socialAchievements[1].status = 1;
			if (size >= 20)
				this.socialAchievements[2].status = 1;
		},

		setVictoryStatus() {
			if (this.userData.victory >= 1)
				this.victoryAchievements[0].status = 1;
			if (this.userData.victory >= 10)
				this.victoryAchievements[1].status = 1;
			if (this.userData.victory >= 50)
				this.victoryAchievements[2].status = 1;
		},

		async setChanStatus() {
			const res = await fetch(`http://localhost:3000/api/channel/all/${this.userData.id}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const channels = (await res.json()).items;
			let size = 0;
			for (const chan of channels)
				if (chan.type != 'direct-message')
					++size;
			if (size >= 1)
				this.chanAchievements[0].status = 1;
			if (size >= 5)
				this.chanAchievements[1].status = 1;
			if (size >= 10)
				this.chanAchievements[2].status = 1;
		},
		
		setEloStatus() {
			if (this.userData.level >= 1050)
				this.eloAchievements[0].status = 1;
			if (this.userData.level >= 1200)
				this.eloAchievements[1].status = 1;
			if (this.userData.level >= 1400)
				this.eloAchievements[2].status = 1;
		},
		
		async setAchievementStatus() {
			await this.setSocialStatus();
			await this.setChanStatus();
			this.setVictoryStatus();
			this.setEloStatus();
		},

		whoWon(playerStats)	{
 			if (playerStats.user.id === this.userData.id)
			{
				if (playerStats.status === 'lost-the-game')
					return (false);
				else
					return (true);
			}
			else
			{
				if (playerStats.status === 'lost-the-game')
					return (true);
				else
					return (false);
			}
		},

		UserIsPlayer(playerId)	{
			if (playerId === this.userData.id)
				return (true);
			return (false);
		},

		async fetchLadder() {
			const res = await fetch(`http://localhost:3000/api/users`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const ladder = await res.json();
			return ladder.items.sort((v1, v2) =>	{
				if (v1.level > v2.level)
					return -1;
				if (v1.level < v2.level)
					return 1;
				return 0;
			});
		},

		async goToUserProfile(userInfo) {
			this.$router.push(`/profile/${userInfo.username}`)
			this.userData = await this.fetchUserData();
			this.picture = await this.getPicture();
			this.userLadder = await this.fetchLadderLevel();
			this.gameHistory = await this.fetchPlayerHistory();
			this.ladder = await this.fetchLadder();
			await this.setAchievementStatus();
			await this.update();
		},

		getUserField(username: String)	{
			let laddList = document.getElementsByClassName("laddElem");
			if (typeof laddList === 'undefined')
				return ;
			for (let elem of laddList)	{
				if (elem.childNodes[1].innerHTML === username)	{
					return elem;
				}
			}
		},

		resetScroll(username: String)	{
			const user = this.getUserField(username);
			if (user != undefined)
				user.scrollIntoView(false, {block: "end", inline: "end"});
		},
	},
})
</script>

<style lang="css" scoped>

	/*** PROFILE STYLES ***/
.profilePage
{
	background:	linear-gradient(135deg, var(blue), var(--main-color-2))	fixed;
	flex-direction:	row;
	text-align: center;
	margin-bottom: 0%;
}

.profile-resume {
	display: flex;
	flex-direction: row;
	gap: 3%;
	min-width: 700px;
	border: solid 3px white;
	margin-bottom: 2%;
	align-content: center;
	border: none;
}

.info
{
	flex: 4;
	display: flex;
	flex-direction:	column;
	margin-top: 4%;
	margin-bottom: 2%;
	text-align: left;
	vertical-align: center;
	min-width: 350px;
}

.username {
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	300%;
	color: var(--font-blue);
	font-weight:	bold;
}

.usermail{
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
}

.perso-info
{
	flex: 1;
	margin-right: 3%;
	display: flex;
	flex-direction:	column;
	margin-top: 2%;
	margin-bottom: 2%;
	vertical-align: center;
}

.status {
	flex: 1;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
	color: green;
}

.perso-info > button
{
	flex: 5;
	background: none;
	border: solid 3px white;
	padding-top: 2%;
	margin: 20%;
	margin-top: 30%;
}

.perso-info > button:hover
{
	background: rgba(255, 255, 255, 0.5);
	cursor: pointer; 
}

.picture {
	flex: 1;
	width: calc(33.333% - 1rem);
    vertical-align: center;
	margin-left: 3%;
	margin-top: 2%;
	margin-bottom: 2%;
}

.picture > img {
	border-radius: 50%;
	overflow: hidden;
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
	object-fit:cover;
}

.relation {
	flex: 2;
	display: flex;
	flex-direction: row;
	justify-content: center;
	min-width: 100px;
	margin-right: 5%;
	margin-top: auto;
	margin-bottom: auto;
}

.relation > img	{
	object-fit: contain;
}

.challengeButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	display: flex;
	align-items: center;
	border-radius: 50%;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	max-height: 70px;
	height: auto;
	width: auto;
	padding: 3%;
	border: solid 2px white;
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}

.challengeButton:hover {
	background:	var(--deep-blue-10);
	color: white;
	cursor: pointer;
}

.relationButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	border-radius: 50%;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	max-height: 70px;
	height: auto;
	width: auto;
	padding: 3%;
	border: solid 2px white;
}

.relationButton:hover {
	background:	var(--deep-blue-10);
	color: white;
	cursor: pointer;

}

.user-profile {
	flex-direction:	row;
	text-align: center;
	margin-right: 3%;
	margin-left: 3%;
	margin-bottom: 0%;
}

.replyButton {
	display: flex;
	flex-direction: column;
	justify-content: right;
}

.replyButton > button {
	border-radius: 8px;
	background:	none;
	border: none;
	border: solid 2px white;
	font-family: MyanmarText;
	letter-spacing:	2px;
	color: white;
	margin-top: 5%;
}

.replyButton > button:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
}

.blockButton {
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	border-radius: 50%;
	max-height: 70px;
	height: auto;
	width: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	background: linear-gradient(135deg, transparent 49%, white 49% 51%, transparent 51% 100%);
	padding: 3%;
	border: solid 2px white
}

.blockButton:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
	background: linear-gradient(135deg, var(--deep-blue-10) 49%, white 49% 51%, var(--deep-blue-10) 51% 100%);
}


.unblockButton {
	width: calc(33.333% - 1rem);
    vertical-align: center;
	margin-right: 3%;
	margin-left: 3%;
	flex: auto;
	border-radius: 50%;
	max-height: 70px;
	height: auto;
	width: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
	padding: 3%;
	border: solid 2px white;
	max-width: 80px;
}

.unblockButton:hover {
	background:	var(--deep-blue-10);
	cursor: pointer;
}

.StatsWin
{
	min-width: 700px;
	min-height:	500px;
	display:	flex;
	flex-direction:	column;
}
/* stat style */

.StatsArea
{
	min-height:	500px;
	border: solid white 3px;
	border-top: none;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}

.StatsTabs
{
	min-width: 20%;
	display:	flex;
	flex-direction:	row;
	border:	solid 3px white;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	/* width: 100%; */
	overflow: hidden;
}

.StatsTabs > .corner
{
	border-right: none;
}

.StatsTabs > button
{
	background: none;
	border: none;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size: 120%;
	color: white;
	padding-top: 1%;
	font-weight:	bold;
	border-right: solid 3px white;
}

.StatsTabs > button:hover
{
	background:	var(--deep-blue-10);
	cursor: pointer; 
}

.StatsTabs #CurrentTab
{
	background:	rgb(255, 255, 255, 0.3);
	color:	var(--font-blue);
}

.stat {
	width: 90%;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: auto;
	margin-left: auto;
	border: solid 3px white;
	max-height:	500px;
	display: flex;
	flex-direction: column;
	font-size: 150%;
	overflow-y:	scroll;
	height: 90%;
}

.stat > .statElem {
	display: flex;
	gap: 4%;
	text-align: center;
	align-items: center;
}

.stat > .statElem > h3 {
	flex: 1 0;
	background: rgb(203, 177, 233, 0.2);
}

.stat > .statElem > p {
	flex: 1 0;
	font-size: 1.17em;
	background: rgb(203, 177, 233, 0.2);

}

.achievementsTable
{
	width: 90%;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: 5%;
	margin-left: 5%;
	/* border: solid white 3px; */
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding: 2%;
}

.achievementsCol
{
	flex: 1 1 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
}

.achievementsCol > div
{
	position: relative;
	/* border: solid white 3px; */
	margin-top: 3%;
	margin-bottom: 3%;
	/* min-width: 120px; */
	flex: 1 1 1;
	aspect-ratio: 1 / 1;
	border-radius: 5px;
}

.achievementsCol > div > img
{
	max-width: 120px;
	object-fit: contain;
	display: block;
	width: 100%;
	height: 100%;
	margin-left: auto;
	margin-right: auto;
}

.achievementsCol > div:before
{
	content: attr(description);
	visibility: hidden;
	opacity: 0;
	width: 140px;
	background-color: black;
	color: #fff;
	text-align: center;
	border-radius: 2px;
	padding: 5px 0;
	transition: opacity 1s ease-in-out;
	font-style: Myanmar;
	color:	var(--font-blue);
	background: rgb(255, 255, 255, 0.3);

	position: absolute;
	z-index: 1;
	left: 110%;
	top: 10%;
}

.achievementsCol > div:hover:before
{
	opacity: 1;
	visibility: visible;
}

.history
{
	width: 90%;
	display: inline-block;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: auto;
	margin-left: auto;
	max-height:	500px;
	overflow-y: scroll;
	border: solid 3px white;
}

.histCats
{
	display: flex;
	flex-direction: row;
	width: 100%;
	text-align: center;
	background: var(--white-10);
	font-size: 120%;
}

.histCats > div
{
	flex: 1 1 0;
}

.histElem
{
	display: flex;
	flex-direction: row;
	width: 100%;
	text-align: center;
	border-bottom: solid 1px white;
	font-size: 120%;
}

.histElem > div
{
	flex: 1 1 0;
}

.ladder
{
	width: 90%;
	display: inline-block;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: auto;
	margin-left: auto;
	max-height:	500px;
	overflow-y: scroll;
	border: solid 3px white;
}

.ladderCats
{
	display: flex;
	flex-direction: row;
	width: 100%;
	text-align: center;
	background: var(--white-10);
	font-size: 120%;
}

.ladderCats > div
{
	flex: 1 1 0;
}

.laddElem
{
	display: flex;
	flex-direction: row;
	width: 100%;
	text-align: center;
	border-bottom: solid 1px white;
	font-size: 120%;
}

.laddElem > div
{
	flex: 1 1 0;
}

.userLink
{
	cursor: pointer;
}

.jumpTo 
{
	background: none;
	border: solid 3px white;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
	color: white;
	width:		10%;
}

.jumpTo:hover
{
	background: rgba(255, 255, 255, 0.5);
	cursor: pointer; 
}
</style>
