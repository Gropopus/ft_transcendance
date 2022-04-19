<template>
<div>
	<button class="refreshButton" @click="refresh()">refresh </button>
	<h1 v-if="actualSelect" class="watchTitle"> Game {{ index + 1 }} / {{ gameList.length }} </h1>
	<h1 v-else class="watchTitle"> No game in progress. </h1>
	<div class="watchPage">
		<div class="changeButton" >
			<img v-if="index > 0" @click="changeSelectGame(-1)" src="/src/assets/arrow-whitedown.png" class="rotateimg90">
			<img v-else style="opacity: 0%" src="/src/assets/arrow-whitedown.png" class="rotateimg90">
		</div>
        <div v-if="actualSelect" class="selectArea">
			<div  v-if="actualSelect" class="gameInfo">
				<div class="playerInfo">
					<div class="userPicture">
						<img :src="picture.left" />
					</div>
					<div class="textInfo">
						<h1> {{ actualSelect.player_left_id.username }} </h1>
						<p> score: {{ actualSelect.score_l }} </p>
					</div>
				</div>
				<div class="vs"> <h1> VS </h1> </div>
				<div class="playerInfo">
					<div class="userPicture">
						<img :src="picture.right" />
					</div>
					<div class="textInfo">
						<h1> {{ actualSelect.player_right_id.username }} </h1>
						<p> score: {{ actualSelect.score_r }} </p>
					</div>
				</div>
			</div>
			<div v-if="actualSelect" @click="goToRoute()" class="watchButton">
				<p>Watch now !</p>
			</div>
			<div v-if="!actualSelect"> No game selected. </div>
        </div>
		<div class="changeButton">
			<img v-if="index < gameList.length - 1"  @click="changeSelectGame(1)" src="/src/assets/arrow-white-up.png" class="rotateimg90">
			<img v-else style="opacity: 0%" src="/src/assets/arrow-white-up.png" class="rotateimg90">
		</div>
	</div>
</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'watchPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0",
			required: true
		},
	},

	data() {
		return {
			gameList: [],
			gameListPlaying: [],
            actualSelect: 0,
			picture: {"left": "", "right": ""},
			index: 0,
		}
	},

	emits:	['userIsOnline'],
	
	async mounted() {	
		this.gameList;
		this.gameListPlaying;
        await this.fectGameList();
		if (this.gameList.length)
			await this.Select(this.gameList[0]);
		this.picture;
	}, 

    async updated() {
        await this.$emit('userIsOnline', this.userId);
    },

	methods: {
		goToRoute() {
			this.$router.push(`/watch/${this.actualSelect.id}`);
		},
        async Select(game: any) {
			this.actualSelect = game;
			this.picture.left = await this.getPicture(game.player_left_id.user.id);
			this.picture.right = await this.getPicture(game.player_right_id.user.id);
        },

		async formatGameList() {
			var i = 0;
			while (this.gameList[i])
			{
				this.gameListPlaying.push(
					this.gameList[i].player_left_id.username + ' vs ' + 
					this.gameList[i].player_right_id.username + ' room: ' + this.gameList[i].id);
				++i;
			}
		},

		async getPicture(id: number)
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${id}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
    		return blobUrl;
		},

		async fectGameList() {
			const res = await fetch('http://localhost:3000/api/game/playinglist/', {
				method: 'get',
			});
			this.gameList = await res.json();
			await this.formatGameList()
		},

		async changeSelectGame(n: number) {
			this.index += n;
			await this.Select(this.gameList[this.index]);
		},

		async refresh(){
			this.gameList;
			this.gameListPlaying;
       	 	await this.fectGameList();
			if (this.gameList.length)
				await this.Select(this.gameList[0]);
			else
				{
					this.actualSelect = "";
					return ;
				}
			this.picture;
		}
	}
})
</script>


<style lang="css" scoped>

.refreshButton
{
	margin-right: 5%;
	margin-left:90%;
	width: 100px;
	height: 60px;
	border: solid white 2px;
	border-radius: 5PX;;
	background: none;
	margin-top: auto;
	margin-bottom: auto;
	cursor: pointer;
	font-style: Myanmar;
	color: white;
	font-size: 130%;
	letter-spacing: 2px;
}

.refreshButton:hover
{
	cursor: pointer;
	background: rgb(255, 255, 255, 0.5);
}

.watchPage
{
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 95%;
	min-height: 500px;
	min-width: 600px;
	gap: 2%;
}

.selectArea {
	flex: 1 1 0;
	border: solid 3px white;
	border-radius: 12px;
	height: 700px;
	background: rgba(255, 255, 255, 0.3);
}

.gameList
{
	margin-top: 4%;
	margin-right: 4%;
	width: 25%;
}

.gameList > h1 {
	border-bottom: solid 2px white;
}

.gameInfo {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	height: 80%;
	gap: 2%;
}

.vs {
	display: flex;
	align-items: center;
	margin-top: 2%;
	margin-left: auto;
	margin-right: auto;
}

.vs > h1 {
	margin-bottom: 4%;
	text-align: center;
	color: rgb(23,61,199);
	font-size: 300%;
	text-shadow: 2px 0 0 rgb(255, 228, 113), -2px 0 0 rgb(255, 228, 113), 0 2px 0 rgb(255, 228, 113), 0 -2px 0 rgb(255, 228, 113), 1px 1px rgb(255, 228, 113), -1px -1px 0 rgb(255, 228, 113), 1px -1px 0 rgb(255, 228, 113), -1px 1px 0 rgb(255, 228, 113);
}

.watchTitle {
	text-align: center;
	color: rgb(255, 255, 255, 0.8);
	font-size: 300%;
	text-shadow: 2px 0 0 rgb(236, 100, 151), -2px 0 0 rgb(236, 100, 151), 0 2px 0 rgb(236, 100, 151), 0 -2px 0 rgb(236, 100, 151), 1px 1px rgb(236, 100, 151), -1px -1px 0 rgb(236, 100, 151), 1px -1px 0 rgb(236, 100, 151), -1px 1px 0 rgb(236, 100, 151);
}

.playerInfo {
	background: linear-gradient(rgb(221, 172, 226), rgb(23,61,199));
	margin-right: 4%;
	margin-left: 4%;
	margin-top: 4%;
	margin-bottom: 4%;
	border: solid 3px white;
	border-radius: 30px;
	width: 35%;
	height: 80%;
	display: flex;
	flex-direction: column;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
}

.playerInfo > .userPicture {
	height: 50%;
	width: 70%;
	display: flex;
	width: calc(33.333% - 1rem);
	align-items: center;
	margin-right: auto;
	margin-left: auto;
}

.playerInfo > .userPicture > img {
	overflow: hidden;
	object-fit:cover;
	border: solid 3px rgb(255, 228, 113);
	border-radius: 100px;
}

.textInfo {
	text-align: center;
	margin-bottom: 5%;
}

.watchButton {
	flex: 1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10px;
}


.watchButton > p {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0, rgb(221, 172, 226) 0, rgb(73, 105, 219) 100%);
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

.watchButton > p:hover {
  box-shadow: rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
  transform: translateY(-2px);
}

.watchButton > p:active {
  box-shadow: rgb(23, 61, 199) 0 3px 7px inset;
  transform: translateY(2px);
}


.gameName {
	width: 100%;
}
.gameName:hover {
	background:	var(--deep-blue-10);
}

.changeButton {
	display: flex;
	align-items: center;
}

.changeButton > img:hover {
	cursor: pointer;
}
.rotateimg90 {
  -webkit-transform:rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

</style>
