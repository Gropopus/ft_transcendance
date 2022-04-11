<template>
	<div class="history">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name:	'scoreBoard',
	props:	{
		profId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	data() {
		return {
			gameHistory: [],
		}
	},

	async mounted() {
		this.gameHistory;
	},

	async created() {
		this.gameHistory = await this.fetchPlayerHistory();
	},

	methods: {
		async fetchPlayerHistory() {
			const res = await fetch(`https://localhost:3000/api/game/history/${this.profId}`, {
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
		}
	},
})
</script>

<style lang="css" scoped>
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
