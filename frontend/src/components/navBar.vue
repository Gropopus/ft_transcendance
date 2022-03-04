<script setup lang="ts">
import navBarButton from './navBarButton.vue'
</script>

<template>
	<div class="navBar">
		<navBarButton :pageId="this.pageId" :currentPage="this.currentPage" v-on:update:currentPage="this.currentPage = $event ">
		</navBarButton>
		<navBarButton :pageId="this.pageId" :currentPage="this.currentPage" v-on:update:currentPage="this.currentPage = $event ">
		</navBarButton>
		<navBarButton :pageId="this.pageId" :currentPage="this.currentPage" v-on:update:currentPage="this.currentPage = $event ">
		</navBarButton>
		<navBarButton :pageId="this.pageId" :currentPage="this.currentPage" v-on:update:currentPage="this.currentPage = $event ">
		</navBarButton>
		<navBarButton :pageId="this.pageId" :currentPage="this.currentPage" v-on:update:currentPage="this.currentPage = $event ">
		</navBarButton>
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		},
		currentPage:	{
			type:	[Number, String],
			default:	0
		}
	},
	data:	function()	{
		return {
			n: 0
		}
	},
	computed:	{
		pageId: this.genId();
	},
	methods:	{
		genId:	function():	number	{
			return (this.n++);
		}
	}
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
