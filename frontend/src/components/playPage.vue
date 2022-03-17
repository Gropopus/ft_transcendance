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

<script lang="ts">
import * as pong from './pong_right.js'
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
	mounted() { //import socketio
		let socketio = document.createElement('script')
		socketio.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js')
		document.head.appendChild(socketio)
	}
}
</script>


<style lang="css">
.GameArea
{
	float:	left;
	display:	flex;
	width:	100%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	flex-direction:	column;
}

#canvas
{
	width:	100%;
	height:	100%;
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
