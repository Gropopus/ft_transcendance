<script setup lang="ts">
import navBarButton from './navBarButton.vue'
</script>

<template>
	<div class="navBar">
		<navBarButton pageId="0" :currentPage="this.currentPage" v-on:update:currentPage="changeCurrent($event) ">
		</navBarButton>
		<navBarButton pageId="1" :currentPage="this.currentPage" v-on:update:currentPage="changeCurrent($event) ">
		</navBarButton>
		<navBarButton pageId="2" :currentPage="this.currentPage" v-on:update:currentPage="changeCurrent($event) ">
		</navBarButton>
		<navBarButton pageId="3" :currentPage="this.currentPage" v-on:update:currentPage="changeCurrent($event) ">
		</navBarButton>
		<navBarButton pageId="4" :currentPage="this.currentPage" v-on:update:currentPage="changeCurrent($event) ">
		</navBarButton>
		<navBarButton pageId="5" :currentPage="this.currentPage" v-on:update:currentPage="changeCurrent($event) ">
		</navBarButton>
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
		// currentPage:	{
		// 	type:	[Number, String],
		// 	default:	"0"
		// }
	},
	// emits:	['update:currentPage'],
	// methods:	{
	// 	changeCurrent:	function(e: event)	{
	// 		this.$emit('update:currentPage', e);
	// 	}
	// }
}
</script>

<style lang="css">

.navBar
{
	height:	3%;
	margin:	0px;
	display:	flex;
	flex-direction:	row;
	border:	solid 3px white;
	border-top-left-radius:	5px;
	border-top-right-radius:	5px;
}
</style>
