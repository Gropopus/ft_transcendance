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
		load(this.userId, this.$route.params.challengeId, this.$route.params.challengeMode );
	},
	unmounted() {
		unload(this.userId);
	},
})
</script>


<style lang="css">
	.GameArea
	{
		float:	left;
		display:	flex;
		width:	80%;
		margin-left: auto;
		margin-right: auto;
		border:	solid 3px white;
		border-radius: 5px;
		flex-direction:	column;
	}
</style>
