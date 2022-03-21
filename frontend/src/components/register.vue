<template>
		<div class="LoginHeader">
			<img src="../assets/picto-id.png">
		</div> <!-- LoginHeader end -->

		<div class="RegisterForm">
			<p class="error" v-if="error"> {{ error }} </p>
			<label for="login"> Register </label>	<br>
			<input type="text" v-model="userLogin" placeholder="username" class="textArea">	<br>
			<label for="password"> Password </label>	<br>
			<input type="password" v-model="userPass" placeholder="password" class="textArea">	<br>

			<label for="email"> email </label>	<br>
			<input type="text" v-model="userMail" placeholder="email" class="textArea">	<br>

			<div class="submitBar">
		
				<br>
				<button @click="login()" class="submitButton">
					Register
				</button>
			</div> <!-- submitBar end -->

		</div> <!-- RegisterForm end -->
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		}
	},
	emits:	['register', 'update:userId'],
	data:	function()	{
		return {
			userLogin:	"",
			userPass:	"",
			userMail:	"",
			error: ""
		}
	},
	methods:	{

		checkForm() {
	    	if (!this.userLogin) {
	        	 return "A Username is required.";
			}
			if(!this.userPass) {
        		return "A password is required.";
			}
			else if (!this.email) {
	        	return "Email required.";
			}
			else if (!this.validEmail(this.email)) {
	        	return "A valid email is required.";
      		}
			  return "undifined";
		},

		async login()	{
			this.error = "";
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
				const data1 = await userRes.json()
				location.reload();
				return ;
			}
			if (res.status == 409)
			{
				this.error = "Email or Login already used by another user.";
				return ;
			}
			console.log(res);
			this.error = this.checkForm();
		}
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

.RegisterForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
}

.RegisterForm > .submitBar
{
	margin-top:	2%;
	display:	flex;
	margin-right:	auto;
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
	background:	none;
	border:	solid 3px white;
	font-size:	24px;
	color:	white;
	font-family: MyanmarText;
}

</style>
