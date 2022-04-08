<template>
<div>
	<header style="padding-top: 20%"/>
    <div class="callback" v-if="twofa">
            <p class="error" v-if="error"> {{ error }} </p>
			Please enter the 6 digit code from Google Authenticator: <br>
			<input type="googlecode" v-model="googlecode" class="textArea" v-on:keyup.enter="twoFACheck()">
			<button @click="twoFACheck()"  class="submitButton">
				Log-in </button>
    </div>
</div>
</template>

<script lang="ts">
import { handleError } from '@vue/runtime-core';
export default	{
	name: 'callback',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		}
	},
	data:	function()	{
		return {
			twofa: "",
			googlecode: "",
			userLogin:	"",
			userPass:	"",
			error:		"",
            user:       "",
		}
	},
	emits:	['update:userId'],
    created(){
		this.loginWith42();
    },
	methods:	{
		handleError(status: number) {
			if (status == 401)
				this.$router.push({name: 'Unauthorized'});
			else if (status == 40)
				this.$router.push({name: 'NotFound'});
			else if (status == 500)
				this.$router.push({name: 'InternalServerError'});
			else
				return false;
			return true;
		},

		async 	twoFACheck()
		{
			this.error = "";
			const res = await fetch('http://www.kittypong.fr:3000/api/2fa/authenticate', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({code: this.googlecode, user: this.user}),
				})
			const ret =	await res;
			if (!this.handleError(res.status))
			{
				this.$emit('update:userId', this.user.id);
				this.$router.push({name: 'game'})
			}
		},
		
		async	loginWith42(){
			let uri = window.location.href
			let backadrr = "http://www.kittypong.fr:3000/api/oauth2/school42/callback"
			let auth = "/api/oauth2/school42";
			let test= uri.slice(30);
			backadrr += test;
			let output = [uri.slice(0, 21), auth, uri.slice(21)].join('');
			uri = output;
			const res = await fetch(backadrr, {
				method: 'get',
				headers: { 'content-type': 'application/json' },
			})
			this.user =	await res.json();
			if (this.user.twoFactorAuthEnabled == false)
			{
				this.$emit('update:userId', this.user.id);
				this.$router.push({name: 'game'})
			}
			else
				this.twofa = "oui";
		},

}
}
</script>

<style lang="css" scoped>

.callback > input.textArea
{
	text-align:	center;
	border: none;
	background-color:	var(--input-fields);
	margin-top:	2%;
	margin-bottom:	5%;
	opacity:	50%;
	font-size:	24px;
	letter-spacing: 10px;
	padding:	6px;
	width:		25%;
}

.callback > .submitButton
{
	display:	block;
	width:	18%;
	background:	none;
	margin-bottom:	5%;
	margin-right:	auto;
	margin-left:	auto;
	padding-top:	2%;
	padding-bottom:	1%;
	background:	none;
	border:	solid white;
	font-size:	100%;
	color:	white;
	font-family: MyanmarText;
}

.callback > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

.callback {
	border-radius: 5px;
	width:	50%;
	height:	50%;
	font-size:	150%;
	font-family: MyanmarText;
	font-weight:	bold;
	min-height:	300px;
	min-width: 548px;
    border: solid white;
    margin-right:   auto;
    margin-left:    auto;
	padding-top:	5%;
	text-align: center;
}

.error {
	text-align: center;
	justify-content: top;
	color: red;
}
</style>
