<script setup lang="ts">
import logPage from './logPage.vue'
import register from './register.vue'
import playPage from './playPage.vue'
import chatPage from './chatPage.vue'
import statsPage from './statsPage.vue'
import friendsPage from './friendsPage.vue'
import profilePage from './profilePage.vue'
import logoutPage from './logoutPage.vue'
import settingsPage from './settingsPage.vue'
import { router } from '../main.ts'
</script>

<template>
	<div class="workSurface" v-bind:style='{"border-top" : (isLogged() ? "hidden" : "solid 3px white")}'>
		<router-view/>
	</div>
</template>

<script lang="ts">
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
	data:	function()	{
		return {
			regForm:	"0"
		}
	},
	emits:	['register', 'update:userId', 'update:currentPage'],
	methods:	{
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		},
		setId:	function(rep: event): Void	{
			this.$emit('update:userId', rep);
			this.regForm = 0;
		},
		changeCurrent:	function(e: event)	{
			this.$emit('update:currentPage', e);
		},
		registerPage:	function()	{
			this.regForm = 1;
		}
	},
	computed:	{
		contentTag:	function():	Vue.component	{
			const	Routes: Array<String> = [
							'/play',
							'/chat',
							'/stats',
							'/friends',
							'/profile',
							'/logout',
							'/settings'
						];
			const	Tags: Array<Vue.component> = [
							playPage,
							chatPage,
							statsPage,
							friendsPage,
							profilePage,
							logoutPage,
							settingsPage
						]
				router.push(Routes[this.currentPage]);
				return Tags[this.currentPage];
		},
		logOrReg:	function():	Vue.component	{
			const	Routes: Array<String> = [
							'/login',
							'/register',
						];
			const	logs: Array<Vue.component> = [
							logPage,
							register,
						]
				if (!this.isLogged())
					router.push(Routes[this.regForm]);
				return logs[this.regForm];
		}
	}
}
</script>

<style lang="css">
.workSurface
{
	display:	block;
	border-radius-bottom-right: 5px;
	border-radius-bottom-left: 5px;
	padding:	5%;
	height:	100%;
	border:	solid 3px white;
	min-height:	500px;
}
</style>
