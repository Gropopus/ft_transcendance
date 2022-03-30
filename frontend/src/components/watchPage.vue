<template>
	<div class="watchPage">
        <div class="selectArea">
			<div  v-if="actualSelect" class="gameInfo">
				<div class="playerInfo">
					<div class="picture">
						<img :src="picture.left" />
					</div>
					<div class="textInfo">
						<h1> {{ actualSelect.player_left_id.username }} </h1>
						<p> score: {{ actualSelect.score_l }} </p>
					</div>
				</div>
				<div class="vs"> <h1> VS </h1> </div>
				<div class="playerInfo">
					<div class="picture">
						<img :src="picture.right" />
					</div>
					<div class="textInfo">
						<h1> {{ actualSelect.player_right_id.username }} </h1>
						<p> score: {{ actualSelect.score_r }} </p>
					</div>
				</div>
			</div>
			<div v-if="actualSelect" @click="goToRoute()" class="watchButton">
				<p>Watch the game</p>
			</div>
			<div v-if="!actualSelect"> No game selected. </div>
        </div>
		<div class="gameList">
			<p>Live game :
				<button @click="fectGameList()" >Refresh</button>
			</p>
            <ul id="v-for-object" class="gameList">
                <li v-for="value in gameList">
                    {{ value.player_left_id.username }} vs {{ value.player_right_id.username }}
                    <button @click="Select(value)"> Select </button>
                </li>
            </ul>
		</div>
	</div>
</template>

<script lang="ts">
// import { throwStatement } from '@babel/types';
import { defineComponent } from 'vue'
export default	defineComponent ({
	name: 'watchPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
	},

	data() {
		return {
			gameList: [],
			gameListPlaying: [],
            actualSelect: 0,
			picture: {"left": "", "right": ""},
		}
	},

	mounted() {	
        this.actualSelect;
		this.gameList;
		this.gameListPlaying;
        this.fectGameList();
		this.picture;
	},

	created() {
		console.log("created");
	},

	methods: {
		goToRoute() {
			console.log('redirect to /game/' + this.actualSelect.id)
			this.$router.replace(`/watch/${this.actualSelect.id}`);
		},
        async Select(game: any) {
			this.actualSelect = game;
			this.picture.left = await this.getPicture(game.player_left_id.user.id);
			this.picture.right = await this.getPicture(game.player_right_id.user.id);
            console.log(game);
        },

		async formatGameList() {
			var i = 0;
			while (this.gameList[i])
			{
				this.gameListPlaying.push(	this.gameList[i].player_left_id.username + ' vs ' + 
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
// 			console.log(blobUrl);
    		return blobUrl;
		},

		async fectGameList() {
			const res = await fetch('http://localhost:3000/api/game/playinglist/', {
				method: 'get',
			});
			this.gameList = await res.json();
			await this.formatGameList()
		},
	}
})
</script>


<style>
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
	/* width: 700px; */
	background: rgba(255, 255, 255, 0.3);
}

.gameList
{
	/* float:	right;
	width:	25%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px); */
}

.gameInfo {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 90%;
	gap: 2%;
}

.vs {
	/* flex: 1 1 0; */
	display: flex;
	align-items: center;
	margin-right: 2%;
	margin-left: 2%;
	margin-top: 2%;
	width: 10%;
	height: 75%;
}

.vs > h1 {
	margin-bottom: 4%;
	width: 40%;
	height: 20%;
	text-align: center;
	margin-left: auto;
	margin-right: auto;
	color: rgb(23,61,199);
	font-size: 300%;
	text-shadow: 2px 0 0 rgb(255, 228, 113), -2px 0 0 rgb(255, 228, 113), 0 2px 0 rgb(255, 228, 113), 0 -2px 0 rgb(255, 228, 113), 1px 1px rgb(255, 228, 113), -1px -1px 0 rgb(255, 228, 113), 1px -1px 0 rgb(255, 228, 113), -1px 1px 0 rgb(255, 228, 113);
}

.playerInfo {
	background: linear-gradient(rgb(221, 172, 226), rgb(23,61,199));
	margin-right: 4%;
	margin-left: 4%;
	margin-top: 4%;
	border: solid 3px white;
	border-radius: 30px;
	width: 30%;
	height: 75%;
	display: flex;
	flex-direction: column;
	box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
}

.playerInfo > .picture {
	height: 50%;
	width: 70%;
	display: flex;
	align-items: center;
	margin-right: auto;
	margin-left: auto;
}

.playerInfo > .picture > img {
	/* display: block; */
	object-fit: contain;
	width:100%;
	height:100%;
	border: solid 3px rgb(255, 228, 113);
	border-radius: 100px;
}

.textInfo {
	text-align: center;
	margin-bottom: 5%;
}

.textInfo > h1 {

}

.textInfo > p {
}


.watchButton {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: auto;
}

.watchButton > p {
	appearance: none;
	border-radius: 40em;
	background-color: white;
	box-shadow: rgb(225, 198, 228) 0 -12px 6px inset;
	border-style: none;
	box-sizing: border-box;
	color: var(--font-blue);
	cursor: pointer;
	display: inline-block;
	font-family: -apple-system,sans-serif;
	font-size: 1.2rem;
	font-weight: 700;
	letter-spacing: -.24px;
	margin: 0;
	outline: none;
	padding: 1rem 1.3rem;
	quotes: auto;
	text-align: center;
	text-decoration: none;
	transition: all .15s;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}

.watchButton > p:hover {
	background-color: rgb(255, 228, 113);
	box-shadow: rgb(250, 168, 120) 0 -6px 8px inset;
	transform: scale(1.125);
}

</style>
