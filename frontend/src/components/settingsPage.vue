<template>
	<div class="settingsPage">
		<div class="submitBar">
			<label for="login"> Change your Login: </label><br>
			<input type="text" v-model="userLogin" class="textArea">
			<button @click="updateLogin()" class="submitButton">
				Update </button></div>
		<div class="submitBar">
		<label for="password"> Change your Password: </label>	<br>
		<input type="password" v-model="userPass" class="textArea">	<br>
		<button @click="updatePassword()" class="submitButton">
				Update </button>
		</div>
		<p class="error" v-if="error"> {{ error }} </p>
		<br>
		<p>
		</p>
	</div>
</template>
<script lang="ts">
export default	{
	name: 'register',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		}
	},
	emits:	['update:userId'],
	data:	function()	{
		return {
			userLogin:	"",
			userPass:	"",
			userMail:	"",
			error: ""
		}
	},
	methods:	{

		async updateLogin() {
				this.error = "";
				if (!this.userLogin)
				{
	        	 	this.error = "Unable to update login with an empty login.";
					return ;
				}
				const res = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ username: this.userLogin })
			})
			
		},
		async updatePassword()	{
				this.error = "";
				if (!this.userPass)
				{
	        	 	this.error = "unable to update password with an empty password.";
					return ;
				}
				const res = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ password: this.userPass })
			})
			console.log(await res.json());
			
		},
	}
}
</script>

<style>

.error {
	justify-content: top;
	color: red;
}

.RegisterHeader
{
	margin-top:	3%;
	height:	20%;
	display:	flex;
	justify-content:	center;
}

.RegisterHeader > img
{
	object-fit: contain;
}

.RegisterForm
{
	border-radius: 5px;
	margin-top:	1%;
	margin-bottom:	5%;
	margin-left:	auto;
	margin-right:	auto;
	padding-top:	2%;
	padding-left:	5%;
	width:	50%;
	height:	50%;
	border:	solid white;
	font-size:	150%;
	font-family: MyanmarText;
	font-weight:	bold;
	min-height:	300px;
	min-width: 548px;
}

.RegisterForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:		81%;
}

.RegisterForm > .submitBar
{
	margin-top:	2%;
	display:	flex;
	margin-right:	6%;
	margin-left:	auto;
	flex-direction:	row;
}

.RegisterForm > .submitBar > .submitButton
{
	display:	block;
	background:	none;
	flex:	0 0 auto;
	margin-bottom:	5%;
	margin-right:	auto;
	padding-top:	3%;
	padding-left:	5%;
	padding-right:	5%;
	border-radius: 5px;
	background:	none;
	border:	solid white;
	font-size:	24px;
	color:	white;
	width: 40%;
	font-family: MyanmarText;
}

.RegisterForm > .submitBar > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

</style>
