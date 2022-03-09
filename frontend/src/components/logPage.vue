<template>
	<div>
		<div class="LoginHeader">
			<img src="../assets/picto-id.png">
		</div> <!-- LoginHeader end -->

		<div class="LoginForm">
			<label for="login"> Login </label>	<br>
			<input type="text" v-model="userLogin" placeholder="username" class="textArea">	<br>

			<label for="password"> Password </label>	<br>
			<input type="password" v-model="userPass" placeholder="password" class="textArea">	<br>

			<div class="submitBar">
				<button @click="login()" class="submitButton">
					Log in
				</button>
				<button @click="register()" class="submitButton">
					Register
				</button>
			</div> <!-- submitBar end -->
		</div> <!-- LoginForm end -->

		
		<a class="submit42Button">
			<img src="../assets/logo-42_white.png">
			<div>
				Log In with<br>
				Connect
			</div>
		</a> <!-- submit42Button end -->
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		}
	},
	data:	function()	{
		return {
			userLogin:	"",
			userPass:	"",
		}
	},
	methods:	{
		isLogged:	function(): Boolean	{
			if (this.userId != 0)
				return true;
			return (false);
		},
		login:	function():	Void	{
			/*
			alert("salut "  + this.userLogin + "!\n" +
				"your password is "  + this.userPass + "!\n" +
				"and your id is"  + this.userId + "!" );
				*/
			this.$emit('update:userId', 122);
		},
		register:	function():	Void	{
			/*
			alert("salut "  + this.userLogin + "!\n" +
				"your password is "  + this.userPass + "!\n" +
				"and your id is"  + this.userId + "!" );
				*/
			this.$emit('register');
		}
	}
}
</script>

<style>

.LoginHeader
{
	margin-top:	3%;
	height:	20%;
	display:	flex;
	justify-content:	center;
}

.LoginHeader > img
{
	object-fit: contain;
}

.LoginForm
{
	border-radius: 5px;
	margin-top:	2%;
	margin-bottom:	5%;
	margin-left:	auto;
	margin-right:	auto;
	padding-top:	2%;
	padding-left:	5%;
	width:	30%;
	height:	40%;
	border:	solid 3px white;
	font-size:	24px;
	font-family: MyanmarText;
	font-weight:	bold;
}

.LoginForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
}

.LoginForm > .submitBar
{
	margin-top:	2%;
	display:	flex;
	margin-right:	auto;
	margin-left:	auto;
	flex-direction:	row;
}

.LoginForm > .submitBar > .submitButton
{
	display:	block;
	background:	none;
	flex:	0 0 auto;
	margin-bottom:	5%;
	margin-right:	auto;
	padding-top:	3%;
	padding-left:	5%;
	padding-right:	5%;
	background:	none;
	border:	solid 3px white;
	font-size:	24px;
	color:	white;
	font-family: MyanmarText;
}

.submit42Button
{
	display:	block;
	background:	none;
	margin-left:	auto;
	margin-right:	auto;
	margin-bottom:	5%;
	padding-top:	1%;
	padding-bottom:	1%;
	width:	20%;
	border:	solid 3px white;
	font-size:	24px;
	color:	white;
	min-height:	42px;
	min-width:	280px;
	justify-content:	center;
	line-height:	1.5;
	font-weight:	bold;
	font-family: MyanmarText;
	text-decoration:	none;
}

.submit42Button > img
{
	float:	left;
	margin-left:	10px;
	margin-right:	10px;
	object-fit:	contain;
}

</style>
