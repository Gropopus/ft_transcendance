<template>
	<div>
		<header />
		<div class="LoginForm">
			<p class="error" v-if="error"> {{ error }} </p>
			<label for="login"> Email </label>	<br>
			<input type="text" v-model="userLogin"  class="textArea" v-on:keyup.enter="login()">	<br>

			<label for="password"> Password </label>	<br>
			<input type="password" v-model="userPass"  class="textArea" v-on:keyup.enter="login()">	<br>
			<div class="submitBar">
				<button @click="register()" class="submitButton">
					Register
				</button> 
				<button @click="login()" class="submitButton">
					Log-in
				</button>
			</div> <!-- submitBar end -->
			<div class="secret" v-if="twofa">
			Please enter the 6 digit code from Google Authenticator: <br>
			<input type="googlecode" v-model="googlecode" class="textArea">
			<button @click="twoFACheck()" class="submitButton">
				Log-in </button>
		</div>
		</div> <!-- LoginForm end -->
		<a class="submit42Button" href="http://localhost:3000/api/oauth2/school42">
			<img src="../assets/logo-42_white.png">
			<div>
				Log In with<br>
				Connect
			</div></a>
	<!--	</button> submit42Button end -->
	</div>
</template>

<script lang="ts">
export default	{
	name: 'logPage',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0,
			required: true
		}
	},
	data:	function()	{
		return {
			twofa: "",
			googlecode: "",
			userLogin:	"",
			userPass:	"",
			error:		"",
		}
	},
	emits:	['update:userId'],
	methods:	{

checkForm() {
	    	if (!this.userLogin) {
	        	 return "Email address required.";
			}
			else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userLogin))) {
	        	return "Invalid email address";
      		}
			else if(!this.userPass) {
        		return "Invalid password";
			}
			return ("");
		},

		async login()	{
				this.error = "";
				this.error = this.checkForm();
				if (this.error)
					return ;
				const res = await fetch(`http://localhost:3000/api/users/login`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ email: this.userLogin, password: this.userPass })
				})
				if (res.status != 400 && res.status != 404)
				{
					const userRes = await fetch(`http://localhost:3000/api/users/find-by-email/${this.userLogin}`, {
						method: 'get',
						headers: { 'content-type': 'application/json' },
					})
					const data1 = await userRes.json()
					if (data1.twoFactorAuthEnabled == true)
					{
						this.twofa = "oui";
					}
					else
					{
						this.$emit('update:userId', data1.id);
						this.$router.push({name: 'game'})
						return ;
					}
				}
				else if (res.status == 400 || res.status == 404)
				{
					this.error = "Invalid email address or password";
					return ;
				}
		},
		async 	twoFACheck()
		{
			this.error = "";
			const userRes = await fetch(`http://localhost:3000/api/users/find-by-email/${this.userLogin}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' },
			})
			const data1 = await userRes.json()
			if (!this.googlecode)
			{
				this.error = "No code to submit"
				return ;
			}
			const res = await fetch('http://localhost:3000/api/2fa/authenticate', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({code: this.googlecode, user: data1}),
				})
			const ret =	await res;
			if (ret.status == 401)
			{
				this.error = "Wrong identification code."
				return ;
			}
			this.$emit('update:userId', data1.id);
			this.$router.push({name: 'game'})

		},
		async	loginWith42(){
			return await fetch(`http://localhost:3000/api/oauth2/school42`, {
						method: 'get',
						mode: 'no-cors',
						headers: { 'content-type': 'application/json' },
			})
			.then(res => {
				return res.json(); })
			.then (data => {
				return data;
			})
			.catch(error => {
				return "error";
			});
		},

		register: function() {
			this.$router.push({name: 'register'});
		}
}
}
</script>

<style lang="css" scoped>

.LoginForm
{
	border-radius: 5px;
	margin-top:	1%;
	margin-bottom:	5%;
	margin-left:	auto;
	margin-right:	auto;
	padding-top:	2%;
	padding-bottom:	2%;
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

.LoginForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	margin-bottom:	3%;
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
	width:		100%;
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
	width:		35%;
	display:	block;
	background:	none;
	/* flex:	0 0 center; */
	margin-bottom:	5%;
	margin-right:	auto;
	margin-left:	auto;
	padding-top:	3%;
	padding-bottom:	2%;
	background:	none;
	border:	solid white;
	font-size:	100%;
	color:	white;
	font-family: MyanmarText;
}

.LoginForm > .submitBar > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

.submit42Button
{
	display:	block;
	background:	none;
	margin-top:	3%;
	margin-left:	auto;
	margin-right:	auto;
	margin-bottom:	5%;
	padding-top:	1%;
	padding-bottom:	1%;
	border-radius: 5px;
	cursor: pointer; 
	width:	15%;
	border:	solid 3px white;
	font-size:	150%;
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

.secret {
	margin-bottom: 5%;
}

.secret > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	margin-bottom:	3%;
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
	width:		81%;
}

.secret > .submitButton
{
	width:		35%;
	margin-right: 10%;
	display:	block;
	background:	none;
	flex:	0 0 center;
	margin-bottom:	5%;
	margin-right:	auto;
	padding-top:	3%;
	padding-bottom:	2%;
	background:	none;
	border:	solid white;
	font-size:	100%;
	color:	white;
	font-family: MyanmarText;
}

.secret > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

.error {
	margin-top: auto;
	margin-bottom: 5%;
	margin-top: 5%;
	text-align: center;
	border: solid 1px rgb(240, 69, 69);
	background: rgb(255, 0, 0, 0.06);
	color: rgb(255, 255, 255, 0.7);
}

</style>
