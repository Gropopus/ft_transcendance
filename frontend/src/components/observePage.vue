<template>
    <ul>
        <div class="observeArea">
            <canvas id="canvasObs" width="640" height="500"></canvas>
        </div>
        <div class="userRight">
            <p>Player Right recap : </p>
        </div>
        <div class="userLeft">
            <p>Player Left recap : </p>
        </div>
    </ul>
</template>

<script>
import { load } from '../script/pong.js'
	export default	{
		props:	{
			userId:	{
				type:	[Number, String],
				default:	"0"
			},
			currentPage:	{
				type:	[Number, String],
				default:	"0"
			}
		},
		mounted() {	
			load(this.userId);
		},
		unmounted() {
		}

	}
</script>