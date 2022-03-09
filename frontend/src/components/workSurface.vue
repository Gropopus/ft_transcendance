<script setup lang="ts">
import logPage from './logPage.vue'
import register from './register.vue'
import playPage from './playPage.vue'
import chatPage from './chatPage.vue'
import statsPage from './statsPage.vue'
import profilePage from './profilePage.vue'
import logoutPage from './logoutPage.vue'
import settingsPage from './settingsPage.vue'
</script>

<template>
	<div class="workSurface" v-bind:style='{"border-top" :(isLogged() ? "hidden" : "solid 3px white")}'>
		<component v-if="!isLogged()" v-bind:is='logOrReg' :userId="userId" v-on:update:userId="setId($event)" v-on:register="registerPage()" />
		<component v-else v-bind:is='contentTag' />
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		},
		currentPage:	{
			type:	[Number, String],
			default:	0
		}
	},
	data:	function()	{
		return {
			regForm:	0
		}
	},
	methods:	{
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		},
		setId:	function(rep: event): Void	{
			this.$emit('update:userId', rep);
		},
		registerPage:	function()	{
			console.log("Register = " + this.regForm);
			this.regForm = 1;
			console.log("Register = " + this.regForm);
		}
	},
	computed:	{
		contentTag:	function():	Vue.component	{
			const	Tags: Array<Vue.component> = [
							playPage,
							chatPage,
							statsPage,
							profilePage,
							logoutPage,
							settingsPage
						]
				return Tags[this.currentPage];
		},
		logOrReg:	function():	Vue.component	{
			const	logs: Array<Vue.component> = [
							logPage,
							register,
						]
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
