<template>
	<div class="watchPage">
        <div class="chatArea">
            <ul id="v-for-object" class="gameInfo">
            <!--    value.id = gameid
                    value.player_left_id  = player left info
                    value.player_right_id = player right info
                    le reste osef-->
                rendre tout booooooo :
                <p v-for="value in actualSelect" > 
                {{value}}
                </p>		
				<button @click="goToRoute()"> Observe </button>
            </ul>
        </div>
		<div class="chatToolSpace">
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
            actualSelect: []
		}
	},

	mounted() {	
        this.actualSelect;
		this.gameList;
		this.gameListPlaying;
        this.fectGameList();
	},

	methods: {
		goToRoute() {
			console.log('redirect to /game/' + this.actualSelect.id)
			this.$router.replace(`/watch/${this.actualSelect.id}`);
		},
        Select(game) {
            this.actualSelect = game;
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


<style lang="css">
.chatArea
{
	float:	left;
	width:	70%;
	min-height:	500px;
	max-height:	500px;
	overflow-y:	scroll;
	border:	solid 3px white;
	border-radius: 5px;
}

.chatToolSpace
{
	float:	right;
	width:	25%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.chatToolNav
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.chanNameButton
{
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	min-width:	150px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	border:	none;
}

.deleteButton
{
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	center;
	min-width:	50px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	border:	none;
}

.messageArea
{
	position: relative;
	bottom: 0;
	height:	42px;
	flex:	1 1 0;
	text-align:	center;
	vertical-align:	center;
	text-align:	left ;
	min-width:	450px;
	text-decoration:	none;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	32px;
	color: var(--font-blue);
	border:	none;

}

.chanNameButton:hover
{
	background:	var(--deep-blue-10);
}

.deleteButton:hover
{
	background:	var(--deep-blue-10);
}

.otherUserMess
{
	text-align: left;
}

.currentUserMess
{
	text-align: right;
}
</style>
