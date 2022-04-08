<template>
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
						<div :key="file.name" v-for="file in socialAchievements">
							<img v-if="file.status == 1" :src="file.iconOn">
							<img v-else :src="file.iconOff">
						</div>
					</div>
					<div class="achievementsCol">
						<div :key="file.name" v-for="file in victoryAchievements">
							<img v-if="file.status == 1" :src="file.iconOn">
							<img v-else :src="file.iconOff">
						</div>
					</div>
					<div class="achievementsCol">
						<div :key="file.name" v-for="file in chanAchievements">
							<img v-if="file.status == 1" :src="file.iconOn">
							<img v-else :src="file.iconOff">
						</div>
					</div>
					<div class="achievementsCol">
						<div :key="file.name" v-for="file in eloAchievements">
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
				<div v-for="elem in gameHistory">
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
					<div :key="elem.level" v-for="(elem, index) in ladder" class="laddElem" v-bind:style='{"background" : (UserIsPlayer(elem.id)) ? "rgb(37, 46, 131, 0.6)" : "none"}'>
						<div> {{ index + 1 }} </div>
						<div class="userLink" @click="goToUserProfile(elem)"> {{ elem.username }} </div>
						<div> {{ elem.level }} </div>
					</div>
				</div>
				<button class="jumpTo" @click="resetScroll(userData.username)"> See User </button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'statsWindow',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
		profId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	emits:	['profId'],

	data() {
		return {
			currentTab: 0,
			userData: [],
			userLadder: 0,
			ladder:	[],
			gameHistory: [],
			socialAchievements: [
                {name: "Social 1", iconOn: "/src/assets/Achievement_Social_1.png", iconOff: "", status: 0},
                {name: "Social 2", iconOn: "/src/assets/Achievement_Social_2.png", iconOff: "", status: 0},
                {name: "Social 3", iconOn: "/src/assets/Achievement_Social_3.png", iconOff: "", status: 0},
            ],
			victoryAchievements: [
                {name: "Victory 1", iconOn: "/src/assets/Achievement_Social_1.png", iconOff: "", status: 0},
                {name: "Victory 2", iconOn: "/src/assets/Achievement_Social_2.png", iconOff: "", status: 0},
                {name: "Victory 3", iconOn: "/src/assets/Achievement_Social_3.png", iconOff: "", status: 0},
            ],
			chanAchievements: [
                {name: "Chan 1", iconOn: "/src/assets/Achievement_Social_1.png", iconOff: "", status: 0},
                {name: "Chan 2", iconOn: "/src/assets/Achievement_Social_2.png", iconOff: "", status: 0},
                {name: "Chan 3", iconOn: "/src/assets/Achievement_Social_3.png", iconOff: "", status: 0},
            ],
			eloAchievements: [
                {name: "Elo 1", iconOn: "/src/assets/Achievement_Social_1.png", iconOff: "", status: 0},
                {name: "Elo 2", iconOn: "/src/assets/Achievement_Social_2.png", iconOff: "", status: 0},
                {name: "Elo 3", iconOn: "/src/assets/Achievement_Social_3.png", iconOff: "", status: 0},
            ],
		}
	},

	mounted() {
		this.userData;
		this.userLadder;
		this.gameHistory;
		this.ladder;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.userLadder = await this.fetchLadderLevel();
		this.gameHistory = await this.fetchPlayerHistory();
		this.ladder = await this.fetchLadder();
		await this.setAchievementStatus();
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

		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const data = await res.json();
			return data;
		},

		async fetchLadderLevel() {
			const res = await fetch(`http://localhost:3000/api/users/ladder-level/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const userLadder = await res.json();
			return userLadder;
		},

		async fetchPlayerHistory() {
			const res = await fetch(`http://localhost:3000/api/game/history/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const history = await res.json();
			return history.items;
		},

		async setSocialStatus() {
			const res = await fetch(`http://localhost:3000/api/friends/${this.profId}`, {
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
			if (this.userData.victory >= 5)
				this.victoryAchievements[1].status = 1;
			if (this.userData.victory >= 20)
				this.victoryAchievements[2].status = 1;
		},

		async setChanStatus() {
			const res = await fetch(`http://localhost:3000/api/channel/all/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const channels = (await res.json()).items;
			const size = channels.length;
			if (size >= 1)
				this.chanAchievements[0].status = 1;
			if (size >= 5)
				this.chanAchievements[1].status = 1;
			if (size >= 20)
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
 			if (playerStats.user.id === this.profId)
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
			if (playerId === this.profId)
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
			if (userInfo.id === this.userId)
				this.$router.push(`/profile`)
			else
			{
				this.$emit('profId', this.profId);
				await this.profId;
				this.$router.push(`/profile/${userInfo.username}`)
			}
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

.StatsWin
{
	/* width:	100%; */
	min-height:	500px;
	display:	flex;
	flex-direction:	column;
}
/* stat style */

.StatsArea
{
	/* width:	100%; */
	/* min-width: 1300px; */
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
	border: solid white 3px;
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
