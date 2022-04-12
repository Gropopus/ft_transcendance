<template>
<div>
	<header>
	</header>
	<div class="RegisterForm">
		<p class="error" v-if="error"> {{ error }} </p>
		<label for="login"> Login </label>	<br>
		<input type="text" @keyup.enter="login()" v-model="userLogin" class="textArea" v-bind:style='{"border": (errStatus[0] == true ? "solid 2px rgb(255, 0, 0)" : "none")}'>
		<br>
		<br>
		<label for="password"> Password </label>	<br>
		<input type="password" @keyup.enter="login()" v-model="userPass" class="textArea" v-bind:style='{"border": (errStatus[1] == true ? "solid 2px rgb(255, 0, 0)" : "none")}'>
		<br>
		<br>
		<label for="email"> Email </label>	<br>
		<input type="text" @keyup.enter="login()" v-model="userMail" class="textArea" v-bind:style='{"border": (errStatus[2] == true ? "solid 2px rgb(255, 0, 0)" : "none")}'>	<br>

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
			default:	0,
			required: true
		}
	},
	emits:	['update:userId'],
	data:	function()	{
		return {
			userLogin:	"",
			userPass:	"",
			userMail:	"",
			error: "",
			errStatus: [false, false, false],
		}
	},
	methods:	{
		checkLogin(login: string) {
			for (const c of login) {
				if ((c < 'A' || c > 'z') && (c < '0' || c > '9') && c != '-' && c != '_' && c!= '.')
				{
					this.errStatus[0] = true;
					this.error = "Invalid username";
					return ;
				}
			}
		},

		checkForm() {
			this.error = "";
			this.errStatus = [false, false, false];
	    	if (!this.userLogin) {
				this.errStatus[0] = true;
			}
			else if (this.userLogin.length > 16) {
				this.errStatus[0] = true;
				this.error = "16 characters maximum"
			}
			else
				this.checkLogin(this.userLogin);
			if (!this.userPass) {
				this.errStatus[1] = true;
			}
			else if (this.userPass.length > 42)
			{
				this.errStatus[1] = true;
				this.error = "Password too long"
			}
			if (!this.userMail) {
				this.errStatus[2] = true;
			}
			else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userMail))){
				this.errStatus[2] = true;
	        	this.error = "Invalid email address";
      		}
		},

		async login()	{
			this.checkForm();
			var textArea = document.createElement('textarea');
			textArea.innerText = this.userLogin;
			if (this.error || this.errStatus[0] || this.errStatus[1] || this.errStatus[2])
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
				this.error = "Email or login already in use";
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
