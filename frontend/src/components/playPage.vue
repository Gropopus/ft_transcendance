<template>
	<div>
		<button @click="run()" >Play</button>

		<div class="GameArea">
			<canvas id="canvas" width="640" height="500"></canvas>
		</div>

		<div class="UserRecap">
			<p>Joueur 1 : <em id="player-score">0</em> - Joueur 2 : <em id="computer-score">0</em></p>
		</div>

		<div class="SocialRecap">
			<p>Live game :
				<button @click="fectGameList()" >Refresh</button>
			</p>
		<ul id="v-for-object" class="gameList">
			<li v-for="value in gameList">
				{{ value.player_left_id.username }} vs {{ value.player_right_id.username }}
				<button @click="obs(value)"> Observe </button>
			</li>
		</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { load, unload, observe } from '../script/pong.js'
	export default	{
		props:	{
			userId:	{
				type:	[Number, String],
				default:	"0"
			},
		},

		data() {
			return {
				gameList: [],
				gameListPlaying: [],
			}
		},

		mounted() {	
			this.gameList;
			this.gameListPlaying;
			console.log('user id: ' + this.userId);
			// load(this.userId);
		},
		unmounted() {
			unload(this.userId);
			console.log('unmounted');
		},

		methods: {
			run() {
				load(this.userId);
			},
			obs(game) {
				console.log("go observe game id " + game.id);
				observe(this.userId, game.id);
			},
			async formatGameList() {
				var i = 0;
				while (this.gameList[i])
				{
					this.gameListPlaying.push(	this.gameList[i].player_left_id.username + ' vs ' + 
											this.gameList[i].player_right_id.username + ' room: ' + this.gameList[i].id);
					++i;
				}
			},
			async fectGameList() {
				const res = await fetch('http://localhost:3000/api/game/playinglist/', {
					method: 'get',
				});
				this.gameList = await res.json();
				await this.formatGameList()
			},

		}

	}
</script>


<style lang="css">
	.GameArea
	{
	}

	#canvas
	{
	}

	.UserRecap
	{
		float:	right;
		width:	25%;
		min-height:	225px;
		border:	solid 3px white;
		border-radius: 5px;
		margin-bottom:	min(22px);
	}

	.SocialRecap
	{
		float:	right;
		width:	25%;
		min-height:	225px;
		border:	solid 3px white;
		border-radius: 5px;
		margin-top:	min(22px);
	}
</style>
