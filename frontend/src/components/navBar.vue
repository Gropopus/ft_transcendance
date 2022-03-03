<script setup lang="ts">
import navBarButton from './navBarButton.vue'
</script>

<template>
	<div class="navBar">
		<navBarButton id="currentTab" iconPath="./src/assets/logout-picture.png">
			Play
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png">
			Chat
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png">
			Stats
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png">
			Profile
		</navBarButton>
		<navBarButton iconPath="./src/assets/logout-picture.png">
			Logout
		</navBarButton>
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
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
