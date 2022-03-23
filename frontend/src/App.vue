<template>
 <div>
  <header>
  </header>
  <nav>
    <div :key="elem.name" v-for="elem in navbuttons" class="navBar">
        <button @click="goToRoute(elem.path)" class="navButton" v-bind:style='{"border-right": (isCurrent(elem.path) ? "solid 10px yellow"/*"#FFE471"*/ : "none")}'>
          <img :src="elem.icon" alt="Salut">
          <!-- <p class="name">
            {{ elem.name }}
          </p> -->
        </button> 
  </div>
  </nav>
  <div class="page">
    <router-view/>
  </div>
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


<style>
  @import './assets/base.css';

.page {
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

/* #app { */
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
} */
</style>

<style>

</style>
