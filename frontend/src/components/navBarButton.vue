<template>
	<button class="navBarButton" @click="changeCurrent($event)">
		<img :src="iconPath" alt="Salut">
		<slot name="tabName">Button</slot>
	</button>
</template>

<script lang="ts">
export default	{
	props:	{
		iconPath:	{
			type:	String,
			default:	"./src/assets/friends.png"
		},
		pageId:	{
			type:	[Number, String],
			default:	0
		}
	},
	methods:	{
		changeCurrent:	function(e: event)	{
			let curTab = document.getElementById('currentTab');
			
			if (e.currentTarget != curTab)
			{
				curTab.removeAttribute('id');
				e.currentTarget.setAttribute('id', 'currentTab');
			}
			let plop = e.currentTarget.innerHTML.substring(e.currentTarget.innerHTML.search(">") + 1).trim();
			console.log(plop);
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
	min-width:	180px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	background:	none;
	border:	none;
}

.navBarButton:hover
{
	background:	var(--deep-blue-10);
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

#currentTab
{
	background:	white;
}
</style>
