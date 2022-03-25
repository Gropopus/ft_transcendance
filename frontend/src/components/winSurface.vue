<script setup lang="ts">
</script>

<template>
	<nav v-if="isLogged()">
			<div :key="elem.name" v-for="elem in navbuttons" class="navBar">
				<button @click="goToRoute(elem.path)" class="navButton" v-bind:style='{"border-right": (isCurrent(elem.path) ? "solid 10px rgb(255, 228, 113)" : "none")}'>
				<img :src="elem.icon" alt="Salut">
					{{ elem.name }}
				</button>
			</div>
	</nav>
	<div class="winSurface">
		<div v-if="isLogged() || isCurrent('/register')">
		</div>
		<div v-else v-bind:is="goToRoute('/login')"></div>
		<router-view
			:userId="this.userId"
			@update:userId="saveUserId($event)" />
	</div>
</template>

<script lang="ts">
	export default	{
	data() {
		return {
			navbuttons: [
				{path: '/game', name: "play", icon: "./src/assets/game.png"},
				{path: '/chat', name: "chat", icon: "./src/assets/chat.png"},
				{path: '/friends', name: "friends", icon: "./src/assets/friends.png"},
				{path: '/profile', name: "profile", icon: "./src/assets/logout-picture.png"},
				{path: '/settings', name: "settings", icon: "./src/assets/settings.png"},
				{path: '/logout', name: "logout", icon: "./src/assets/log-out.png"}
			],
			userId: "0"
		}
	},

	methods: {
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		},

		goToRoute(path: string) {
		if (path != this.$route.path)
			this.$router.replace(path);
		},

		isCurrent(path: string) {
		if (path == this.$route.path)
			return true;
		return false;
		},

		saveUserId(id: string) {
			this.userId = id;
		},
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
	width:	70%;
	height:	100%;
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
	width:	12%;
	object-fit: contain;
	vertical-align:	center;
	align-content: left;
	padding-left: 10%;
}

nav {
  float:	left;
  width:	6%;
  display: row;
  height: 100%;
  width: 160px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: white;
  overflow-x: hidden;
  padding-top: 20px;
}

/*.navBar {

}*/

.navBar > .navButton {
  display: inline;
	margin-bottom:	6%;
	margin-top:	6%;
  height:	50%;
  width: 	100%;
  flex:	1 1 0;
  vertical-align:	center;
  text-align:		center;
  min-width:		142px;
  font-family: 		MyanmarText;
  font-size: 		25px;
  color:			rgb(37, 46, 131);
  letter-spacing:	2%;
  background: white;
  border:	none;
}

  .navButton:hover
  {
    border-right: solid 20px rgb(255, 228, 113)
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
