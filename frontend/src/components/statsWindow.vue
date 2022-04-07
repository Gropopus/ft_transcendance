<template>
	<div class="StatsWin">
		<div class="StatsTabs">
			<button class="tab"  @click="changeCurrent(0)" :id="isCurrentTab(0)"> Statistics </button>
			<button class="tab middle" @click="changeCurrent(1)" :id="isCurrentTab(1)"> Achievements </button>
			<button class="tab"  @click="changeCurrent(2)" :id="isCurrentTab(2)"> History </button>
		</div>
		<div class="StatsArea">
			<div v-if="currentTab==0" class="stat">
				<div class="statElem">
					<h3>Rank</h3>
					<p> {{ ladder.level }} / {{ ladder.total }} </p>
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
						<div :key="file.icon" v-for="file in socialAchievements">
							<img :src="file.icon">
						</div>
					</div>
					<div class="achievementsCol">
						<div :key="file.icon" v-for="file in socialAchievements">
							<img :src="file.icon">
						</div>
					</div>
					<div class="achievementsCol">
						<div :key="file.icon" v-for="file in socialAchievements">
							<img :src="file.icon">
						</div>
					</div>
					<div class="achievementsCol">
						<div :key="file.icon" v-for="file in socialAchievements">
							<img :src="file.icon">
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
						<div v-if="UserIsPlayer(elem.player_right_id.user.id)"> {{ elem.player_left_id.user.username }} </div>
						<div v-else> {{ elem.player_right_id.user.username }} </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'statsWindow',
	props:	{
		profId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	data() {
		return {
			currentTab: 0,
			userData: [],
			ladder: 0,
			gameHistory: [],
			socialAchievements: [
                {name: "Social 1", icon: "/src/assets/Achievement_Social_1.png"},
                {name: "Social 2", icon: "/src/assets/Achievement_Social_2.png"},
                {name: "Social 3", icon: "/src/assets/Achievement_Social_3.png"},
            ],
		}
	},

	mounted() {
		this.userData;
		this.ladder;
		this.gameHistory;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.ladder = await this.fetchLadderLevel();
		this.gameHistory = await this.fetchPlayerHistory();
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
			const ladder = await res.json();
			return ladder;
		},

		async fetchPlayerHistory() {
			const res = await fetch(`http://localhost:3000/api/game/history/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const history = await res.json();
			return history.items;
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
	},
})
</script>


<style lang="css" scoped>

.StatsWin
{
	width:	100%;
	min-height:	500px;
	display:	flex;
	flex-direction:	column;
}
/* stat style */

.StatsArea
{
	width:	100%;
	min-width: 800px;
	min-height:	500px;
	border: solid white 3px;
	border-top: none;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}

.StatsTabs
{
	min-width: 800px;
	display:	flex;
	flex-direction:	row;
	border:	solid 3px white;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	width: 100%;
	overflow: hidden;
}

.middle
{
	border-right: solid 3px white !important;
	border-left: solid 3px white !important;
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
	width: 90%%;
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
	border: solid white 3px;
	margin-top: 3%;
	margin-bottom: 3%;
	min-width: 120px;
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
</style>
