<script setup lang="ts">
import navBarButton from './navBarButton.vue'
</script>

<template>
	<div class="navBar">
		<navBarButton id="currentTab" iconPath="./src/assets/logout-picture.png">
			<template #tabName>Play</template>
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png" :pageId="this.pageId">
			<template #tabName>Chat</template>
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png" :pageId="this.pageId">
			<template #tabName>Stats</template>
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png" :pageId="this.pageId">
			<template #tabName>Profile</template>
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png" :pageId="this.pageId">
			<template #tabName>Logout</template>
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
		pageId:	{
			type:	[Number, String],
			default:	0
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
