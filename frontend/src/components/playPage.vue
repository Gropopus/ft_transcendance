<template>
		<div class="GameArea">
			<canvas id="canvas" width="1600" height="1200"></canvas>
		</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { load, unload, observe } from '../script/pong.js'
export default	defineComponent ({
	name: 'gamePage',
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
		load(this.userId);
	},
	unmounted() {
		unload(this.userId);
	},

	methods: {
		goToRoute(id) {
			this.$router.replace(`/watch/${id}`);
		},
		run() {
			load(this.userId);
		},
		obs(game) {
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

})
</script>


<style lang="css">
	.GameArea
	{
		float:	left;
		display:	flex;
		width:	70%;
		min-height:	500px;
		border:	solid 3px white;
		border-radius: 5px;
		flex-direction:	column;
	}
</style>
