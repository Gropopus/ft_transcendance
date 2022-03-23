<template>
	<button class="navBarButton" @click="changeCurrent($event)" v-bind:style='{"background" : (isCurrent() ? "white"/*"#FFE471"*/ : "none")}'>
		<img :src="tabIcon" alt="Salut">
		{{ tabName }}
	</button>
</template>

<script lang="ts">
export default	{
	props:	{
		pageId:	{
			type:	[Number, String],
			default:	"0"
		},
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		}
	},
	emits:	['update:currentPage'],
	methods:	{
		changeCurrent:	function(e: event)	{
			console.log(this.tabName);
			console.log(this.pageId);
			console.log(this.currentPage);
			this.$emit('update:currentPage', this.pageId);
		},
		isCurrent:	function():	Boolean	{
			if (this.pageId == "1" && this.currentPage == "7")
				return (true);
			if (this.pageId === this.currentPage)
				return (true);
			return (false);
		}
	},
	computed:	{
		tabName:	function(): string	{
			const tabNames: Array<string>	=	[
				"Play",
				"Chat",
				"Stats",
				"Friends",
				"Profile",
				"Logout",
				"Settings"
			]
			return (tabNames[this.pageId]);
		},
		tabIcon:	function(): string	{
			const iconNames: Array<string>	=	[
				"./src/assets/game.png",
				"./src/assets/chat.png",
				"./src/assets/logout-picture.png",
				"./src/assets/friends.png",
				"./src/assets/logout-picture.png",
				"./src/assets/log-out.png",
				"./src/assets/settings.png"
			]
			return (iconNames[this.pageId]);
		}
	}
}
</script>

<style lang="css">

.navBarButton
{
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	min-width:	142px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	border:	none;
}

.navBarButton:hover
{
	background:	white;/*var(--deep-blue-10);*/
}

.navBarButton > img
{
	float:	left;
	margin-right:	0px;
	margin-top:	3%;
	height:	80%;
	width:	auto;
	object-fit: contain;
	vertical-align:	center;
	padding-left: 10%;
}
</style>
