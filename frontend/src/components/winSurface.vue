<template>
	<div class="winSurface">
		<nav v-if="isLogged()" :userId="this.userId">
			<div :key="elem.name" v-for="elem in navbuttons" class="navBar">
				<button @click="goToRoute(elem.path)" class="navButton" v-bind:style='{"border-right": (isCurrent(elem.path) ? "solid 10px yellow"/*"#FFE471"*/ : "none")}'>
				<!-- <p class="name">
				<img :src="elem.icon" alt="Salut">
					{{ elem.name }}
				</p> -->
				</button>
			</div>
		</nav>
		<div class="vuePage">
			<router-view/>
		</div>
		<!-- <workSurface :userId="this.userId" v-on:update:userId="this.userId = $event ">
		</workSurface> -->
	</div>
</template>

<script lang="ts">
	export default	{
		props:	{
			userId:	{
				type:	[Number, String],
				default:	"0"
			},
	},

	emits:	['update:userId'],

	data() {
		return {
			navbuttons: [
				{path: '/game', name: "Play", icon: "./src/assets/game.png"},
				{path: '/chat', name: "Chat", icon: "./src/assets/chat.png"},
				{path: '/statistics', name: "Stats", icon: "./src/assets/logout-picture.png"},
				{path: '/friends', name: "Friends", icon: "./src/assets/friends.png"},
				{path: '/profile', name: "Profile", icon: "./src/assets/logout-picture.png"},
				{path: '/logout', name: "Logout", icon: "./src/assets/log-out.png"},
				{path: '/settings', name: "Settings", icon: "./src/assets/settings.png"}
			],
		}
	},

	methods: {
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		},

		goToRoute(path: string) {
		this.$router.push(path);
		},

		isCurrent(path: string) {
		if (path == this.$route.path)
			return true;
		return false;
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


.vuePage {
  /* display:flex;
  flex-direction: row;
	vertical-align:	center; */
  float: right;
	width:	80%;
}

.navBarButton > img
{
  float:	left;
	margin-right:	0px;
	margin-top:	4%;
	margin-bottom:	4%;
	height:	2%;
	width:	15%;
	object-fit: contain;
	vertical-align:	center;
	padding-left: 10%;
}

nav {
  float:	left;
  width:11.5%;
}

.navBar {
  width:5%;
}

.navBar > .navButton {
  display: inline;
	margin-bottom:	10%;
	margin-top:	0%;
  height:	100%;
  width: 100%;
  flex:	1 1 0;
  vertical-align:	center;
  text-align:	center;
  min-width:	142px;
  text-decoration:	none;
  font-family: MyanmarText;
  letter-spacing:	1%;
  color: var(--font-blue);
  border:	none;
}

  .navButton:hover
  {
    border-right: solid 10px yellow
  }

.navButton > img
{
  float:	left;
	margin-right:	0px;
	margin-top:	3%;
	height:	10%;
	width:	80%;
	object-fit: contain;
	vertical-align:	center;
	padding-left: 10%;
}

.name {
  float: right;
  font-size:	150%;
	vertical-align:	center;
}
</style>
