<template>
	<div class="GameArea">
		<canvas id="canvas" width="1600" height="1200"></canvas>
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

	emits:	['userIsOnline'],
	
    async mounted() {	
        this.gameList;
        this.gameListPlaying;
        const h = await fetch('http://localhost:3000/api/game/stat/' + this.$route.params.gameId, {
            method: 'get',
        });
        try {
            const test = await h.json();
			if (test.status != 'playing')
				this.$router.replace('/404')
			else
				this.obs(this.userId, this.$route.params.gameId)
        }
        catch {
			this.$router.replace('/404')
        }
 
    },

    unmounted() {
        unload(this.userId);
    },

	async updated() {
        await this.$emit('userIsOnline', this.userId);
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


<style lang="css" scoped>
.GameArea
{
	display:	flex;
	width:	50% !important;
	height: 50% !important;
	min-height: 400px;
	min-width: 600px;
	margin-left: 10%;
	margin-right: 10%;
	margin-top: 5%;
	border:	solid 3px white;
	border-radius: 5px;
	flex-direction:	column;
	object-fit: contain;
}
</style>
