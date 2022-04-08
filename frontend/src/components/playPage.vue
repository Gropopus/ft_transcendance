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

	mounted() {	
		load(this.userId, 0);
	},
	unmounted() {
		unload(this.userId);
	},
})
</script>


<style lang="css" scoped>
	.GameArea
	{
		display:	flex;
		width:	50%;
		height: 50%;
		min-height: 400px;
		min-width: 600px;
		margin-right: 10%;
		margin-left: 10%;
		margin-top: 5%;
		vertical-align: center;
		border:	solid 3px white;
		border-radius: 5px;
		flex-direction:	column;
	}
</style>
