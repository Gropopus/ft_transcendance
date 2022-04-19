<template>
    <nav class="navBar">
        <div :key="elem.name" v-for="elem in navbuttons" class="navElem">
            <button @click="goToRoute(elem.path)" class="navButton" v-bind:style='{"border-right": (isCurrent(elem.path) ? "solid 10px rgb(255, 228, 113)" : "none")}'>
            <img :src="elem.icon" alt="Salut">
                {{ elem.name }}
            </button>
        </div>
    </nav>
</template>

<script lang="ts">
	export default	{
        name: 'appNavigation',
        data() {
            return {
                navbuttons: [
                    {path: '/game', name: "play", icon: "./src/assets/game.png"},
                    {path: '/watch', name: "watch", icon: "./src/assets/watch01.png"},
                    {path: '/chat', name: "chat", icon: "./src/assets/chat.png"},
                    {path: '/friends', name: "friends", icon: "./src/assets/friends.png"},
                    {path: '/profile', name: "profile", icon: "./src/assets/profile-picture.png"},
                    {path: '/settings', name: "settings", icon: "./src/assets/settings.png"},
                    {path: '/logout', name: "logout", icon: "./src/assets/log-out.png"},
                ],
                userId: "0"
            }
        },

        methods: {
            goToRoute(path: string) {
            if (path != this.$route.path)
                this.$router.push(path);
            },

            isCurrent(path: string) {
            if (path == this.$route.path)
                return true;
            return false;
            },
        }
}
</script>

<style lang="css" scoped>

.navBar {
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

.navElem > .navButton {
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

</style>
