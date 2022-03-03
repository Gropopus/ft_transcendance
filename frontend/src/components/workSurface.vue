<script setup lang="ts">
import logPage from './logPage.vue'
import logoutPage from './logoutPage.vue'
</script>

<template>
	<div class="workSurface" v-bind:style='{"border-top" :(isLogged() ? "hidden" : "solid 3px white")}'>
		<logPage v-if="!isLogged()" :userId="userId" v-on:update:userId="salut($event)" />
		<slot v-else name="pageContent"></slot>
	</div>
</template>


<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		}
	},
	methods:	{
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		},
		salut:	function(rep: event): Void	{
			this.$emit('update:userId', rep);
		}
	}
}
</script>

<style lang="css">
.workSurface
{
	display:	block;
	border-radius-bottom-right: 5px;
	border-radius-bottom-left: 5px;
	padding:	5%;
	height:	100%;
	border:	solid 3px white;
	min-height:	500px;
}
.playPage
{
	background: red;
}
</style>
