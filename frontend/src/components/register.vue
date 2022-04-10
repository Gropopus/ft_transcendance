<template>
<div>
	<header>
	</header>
	<div class="RegisterForm">
		<p class="error" v-if="error"> {{ error }} </p>
		<label for="login"> Login </label>	<br>
		<input type="text" @keyup.enter="login()" v-model="userLogin" class="textArea" v-bind:style='{"border": (errStatus == 1 ? "solid 2px rgb(255, 0, 0)" : "none")}'>
		<br>
		<br>
		<label for="password"> Password </label>	<br>
		<input type="password" @keyup.enter="login()" v-model="userPass" class="textArea" v-bind:style='{"border": (errStatus == 2 ? "solid 2px rgb(255, 0, 0)" : "none")}'>
		<br>
		<br>
		<label for="email"> Email </label>	<br>
		<input type="text" @keyup.enter="login()" v-model="userMail" class="textArea" v-bind:style='{"border": (errStatus == 3 ? "solid 2px rgb(255, 0, 0)" : "none")}'>	<br>

		<div class="submitBar">
	
			<br>
			<button @click="login()" class="submitButton">
				Register
			</button>
			<button @click="goBack()" class="submitButton">
				Cancel
			</button>
		</div> <!-- submitBar end -->

	</div> <!-- RegisterForm end -->
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
			error: "",
			errStatus: 0,
		}
	},
	methods:	{

		checkForm() {
	    	if (!this.userLogin) {
				this.errStatus = 1;
			}
			else if (this.userLogin.length > 16) {
				this.errStatus = 1;
				return "16 characters maximum"
			}
			if(!this.userPass) {
				this.errStatus = 2;
			}
			else if (!this.userMail) {
				this.errStatus = 3;
			}
			else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userMail))){
				this.errStatus = 3;
	        	return "Invalid email address";
      		}
			  return "";
		},

		async login()	{
			this.errStatus = 0;
			this.error = this.checkForm();
			if (this.error || this.errStatus)
				return ;
			const res = await fetch(`http://localhost:3000/api/users`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ email: this.userMail, username: this.userLogin, password: this.userPass })
			})
			if (res.status != 400 && res.status != 404 && res.status != 409)
			{
				const userRes = await fetch(`http://localhost:3000/api/users/find-by-email/${this.userLogin}`, {
					method: 'get',
					headers: { 'content-type': 'application/json' },
				})
				this.$router.push({name: 'login'})
			}
			else if (res.status == 409)
				this.error = "Email or login already used by another user.";
		},

		async goBack() {
			this.$router.push({name: 'login'});
		}
	}
}
</script>

<style lang="css" scoped>

.error {
	margin-top: auto;
	margin-bottom: 5%;
	margin-top: 5%;
	text-align: center;
	border: solid 1px rgb(240, 69, 69);
	background: rgb(255, 0, 0, 0.06);
	color: rgb(255, 255, 255, 0.7);
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
	padding-top:	5%;
	padding-bottom:	5%;
	padding-left:	5%;
	padding-right:	5%;
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
	width:		100%;
}

.RegisterForm > .submitBar
{
	margin-top:	2%;
	display:	flex;
	margin-left:	auto;
	flex-direction:	row;
}

.RegisterForm > .submitBar > .submitButton
{
	display:	block;
	background:	none;
	flex:	0 0 auto;
	margin-top:	5%;
	margin-right:	auto;	
	margin-left:	auto;	
	padding-top:	3%;
	padding-bottom: 3%;
	padding-left:	5%;
	padding-right:	5%;
	border-radius: 5px;
	background:	none;
	border:	solid white;
	font-size:	24px;
	color:	white;
	width: 30%;
	font-family: MyanmarText;
}

.RegisterForm > .submitBar > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}
</style>
