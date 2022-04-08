<template>
		<div class="GameArea1">
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


<style lang="css">
	.GameArea1
	{
		float:	left;
		display:	flex;
		width:	70%;
		height: 70%;
		min-height: 600px;
		min-width: 800px;
		margin-left: auto;
		margin-right: auto;
		border:	solid 3px white;
		border-radius: 5px;
		flex-direction:	column;
	}
</style>
