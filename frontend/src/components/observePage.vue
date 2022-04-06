<template>
	<div>
		<div class="GameArea">
			<canvas id="canvas" width="1600" height="1200"></canvas>
		</div>

		<div class="UserRecap">
			<p>Joueur 1 : <em id="player-score">0</em> - Joueur 2 : <em id="computer-score">0</em></p>
		</div>

		<div class="SocialRecap">
			<p>mhh
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { load, unload, observe } from '../script/pong.js'
export default	defineComponent ({
	name: 'observePage',
    props:	{
        userId:	{
            type:	[Number, String],
            default:	"0"
        },
    },
    async mounted() {	
        this.gameList;
        this.gameListPlaying;
		if (isNaN(this.$route.params.gameId) == true)
		{
			this.$router.push('/404');
			return ;
		}
        const h = await fetch('http://localhost:3000/api/game/stat/' + this.$route.params.gameId, {
            method: 'get',
        });
        try {
            const test = await h.json();
            this.obs(this.userId, this.$route.params.gameId)
        }
        catch {
            this.$router.push('/404');
        }
 
    },
    unmounted() {
        unload(this.userId);
    },

    methods: {
        run() {
            load(this.userId);
        },
        obs(userId, gameId) {
            observe(userId, gameId);
        },
    },
})
</script>


<style lang="css">
	.GameArea
	{
	}

	#canvas
	{
	}

	.UserRecap
	{
		float:	right;
		width:	25%;
		min-height:	225px;
		border:	solid 3px white;
		border-radius: 5px;
		margin-bottom:	min(22px);
	}

	.SocialRecap
	{
		float:	right;
		width:	25%;
		min-height:	225px;
		border:	solid 3px white;
		border-radius: 5px;
		margin-top:	min(22px);
	}
</style>
