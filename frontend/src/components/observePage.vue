<template>
	<div>
		<div class="ObserveArea">
			<canvas id="canvasObs" width="640" height="500"></canvas>
		</div>
		<div class="UserRecap">
			<p>Joueur 1 : <em id="player-score">0</em> - Joueur 2 : <em id="computer-score">0</em></p>
		</div>
		<div class="SocialRecap">
			<p>Osef</p>
		</div>
	</div>
</template>

<script lang="ts">
import { load } from '../script/pong.js'
	export default	{
		props:	{
			userId:	{
				type:	[Number, String],
				default:	"0"
			},
		},
		mounted() {	
			console.log('user id: ' + this.userId);
			load(this.userId);
		},
		// unmounted() {d
		// }

	}
</script>
