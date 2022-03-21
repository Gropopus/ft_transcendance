<template>
	<div>
		<div class="LoginHeader">
			<img src="../assets/picto-id.png">
		</div> <!-- LoginHeader end -->

		<div class="LoginForm">
			<p class="error" v-if="error"> {{ error }} </p>
			<label for="login"> Email </label>	<br>
			<input type="text" v-model="userLogin" placeholder="username" class="textArea">	<br>

			<label for="password"> Password </label>	<br>
			<input type="password" v-model="userPass" placeholder="password" class="textArea">	<br>

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
	emits:	['register', 'update:userId'],
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
					return ;
				}
				else if (res.status == 400 || res.status == 404)
				{
					this.error = "User not found, Wrong Email or password.";
				}
		},

		register: function() {
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

.error {
	justify-content: top;
	color: red;
}

</style>
