<template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'statsWindow',
	props:	{
		profId:	{
			type:	[Number, String],
			default:	"0",
			required: true
		},
	},

	data() {
		return {
			userData: [],
			ladder: 0,
		}
	},

	mounted() {
		this.userData;
		this.ladder;
	},

	async created() {
		this.userData = await this.fetchUserData();
		this.ladder = await this.fetchLadderLevel();
	},

	methods: {
		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const data = await res.json();
			return data;
		},

		async fetchLadderLevel() {
			const res = await fetch(`http://localhost:3000/api/users/ladder-level/${this.profId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			})
			const ladder = await res.json();
			return ladder;
		},

		changeCurrent(index: number) {
			this.currentTab = index;
		},

		isCurrentTab(tab: number) {
			if (this.currentTab == tab)
				return "CurrentTab";
			else
				return "notCurrentTab";
		},
	},
})
</script>


<style lang="css" scoped>
.stat {
	width: 90%;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-right: auto;
	margin-left: auto;
	border: solid 3px white;
	max-height:	500px;
	display: flex;
	flex-direction: column;
	font-size: 150%;
	overflow-y:	scroll;
	height: 90%;
}

.stat > .statElem {
	display: flex;
	gap: 4%;
	text-align: center;
	align-items: center;
}

.stat > .statElem > h3 {
	flex: 1 0;
	background: rgb(203, 177, 233, 0.2);
}

.stat > .statElem > p {
	flex: 1 0;
	font-size: 1.17em;
	background: rgb(203, 177, 233, 0.2);

}
</style>
