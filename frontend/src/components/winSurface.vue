<script setup lang="ts">
import navBar from './navBar.vue'
import logPage from './logPage.vue'
import workSurface from './workSurface.vue'
</script>

<template>
	<div class="winSurface">
		<navBar v-if="isLogged()" :userId="this.userId" v-on:update:userId="this.userId = $event "/>
		<workSurface :userId="this.userId" :pageId="this.pageId" v-on:update:userId="this.userId = $event ">
		</workSurface>
	</div>
</template>

<script lang="ts">
export default	{
	data:	function()	{
		return {
			userId: 0,
			pageId: 0
		}
	},
	methods:	{
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		}
	}
}
</script>

<style lang="css" scoped>
.winSurface
{
	display:	block;
	margin-top:	1%;
	margin-left:	auto;
	margin-right:	auto;
	margin-bottom:	5%;
	width:	50%;
	height:	50%;
	min-height:	500px;
	min-width:	1180px;
}
</style>
