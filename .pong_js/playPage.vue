<template>
<ul>
	<div class="GameArea">
		<canvas id="canvas" width="640" height="500"></canvas>
	</div>
	<div class="UserRecap">
		<p>Joueur 1 : <em id="player-score">0</em> - Joueur 2 : <em id="computer-score">0</em></p>
	</div>
	<div class="SocialRecap">
		<p>Osef</p>
	</div>
	</ul>
</template>

<script lang="ts" type="module">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		}
	},
	mounted() {
		let game = document.createElement('script')
		game.setAttribute('src', 'src/script/pong.js')
		game.setAttribute('type', 'module')
		document.head.appendChild(game);	
	}
}
</script>


<style lang="css">
.GameArea
{
	margin-left: 10%;
	margin-right: 10%;
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
