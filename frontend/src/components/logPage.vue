<template>
	<div>
		<!-- <div class="LoginHeader">
			<img src="../assets/picto-id.png">
		</div> LoginHeader end -->
		<div class="LoginForm">
			<p class="error" v-if="error"> {{ error }} </p>
			<label for="login"> Email </label>	<br>
			<input type="text" v-model="userLogin"  class="textArea">	<br>

			<label for="password"> Password </label>	<br>
			<input type="password" v-model="userPass"  class="textArea">	<br>
			<div class="submitBar">
				<button @click="register()" class="submitButton">
					Register
				</button> 
				<button @click="login()" class="submitButton">
					Log-in
				</button>
			</div> <!-- submitBar end -->
		</div> <!-- LoginForm end -->

		
		<a class="submit42Button" href="http://localhost:3000/api/oauth2/school42">
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
	name: 'logPage',
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
	        	return "A valid email address is required.";
      		}
			else if(!this.userPass) {
        		return "A password is required.";
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
					this.$emit('update:userId', data1.id);
					this.$router.replace({name: 'game'})
					return ;
				}
				else if (res.status == 400 || res.status == 404)
				{
					this.error = "User not found, Wrong Email or password.";
				}
		},

		register: function() {
			this.$router.replace({name: 'register'});
			// this.$emit('register');
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

.LoginForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	margin-bottom:	3%;
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
	width:		81%;
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

	width:	20%;
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

.error {
	justify-content: top;
	color: red;
}

</style>
