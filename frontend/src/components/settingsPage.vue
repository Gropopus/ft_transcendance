<template>
	<div class="settingsPage">
		<div class="profile-image">
				<img :src="picture" />
				<br>
			</div>
		<div class="settings">
		<p class="error" v-if="error"> {{ error }} </p>
		<div class="submitBar">
			<div class="title"> Change your Login:</div>
			<input type="text" v-model="userLogin" class="textArea">
			<button @click="updateLogin()" class="submitButton">
				Update </button></div>
		<div class="submitBar">
		<div class="title"> Change your Password: </div>
		<input type="password" v-model="userPass" class="textArea">
		<button @click="updatePassword()" class="submitButton">
				Update </button>
		</div>
		<div class="submitBar">
			<div class="title"> Change your Picture: </div>
			<input type="file" accept="image/x-png,image/gif,image/jpeg,image/png" @change="onChangeFileUpload($event)" class="fileArea">
			<button @click="Upload()" class="submitButton">
				Upload </button>
		</div>
		<div class="submitBar">
			<div class="title"> Two factor authentification: </div>
			<select class="selector" @change="handleTwoFA()">
                <option :selected="isDisable()">disable</option>
                <option :selected="isEnable()"> enable</option>
            </select>
		</div>
		<div class="secret" v-if="secret">
			<div class= "secret-content">
				Please keep this secret code: {{ secret}}
				<br>
				<img :src="qrcode" />
				<br>
				If you are unable to scan the QR code in the google authentificator application , please enter this code manually into the app.<br>
				To finish security verification and enable Google Authenticator, please enter the 6 digit code from Google Authenticator: <br>
				</div>
				<input type="googlecode" v-model="googlecode" class="textArea">
				<button @click="turnOn2FA()" class="submitButton">
					Submit </button>
		</div>
		<div class="secret" v-if="turnoff">
			<div class="desactived"> Finish this security verification to disable Google Authenticator, please enter the 6 digit code from Google Authenticator:</div> <br>
			<input type="googlecode" v-model="googlecode" class="textArea">
			<button @click="turnOff2FA()" class="submitButton">
				Submit </button>
		</div>
			<br>
			<p class="alert" v-if="finish"> {{ finish }} </p>
		</div>
	</div>
</template>
<script lang="ts">
import { ref} from "vue"
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
			file: null,
			user: "",
			picture: "",
			twofa: 	"",
			secret: "",
			qrcode: "",
			googlecode: "",
			turnoff: "",
			finish: "",
		}
	},
	created(){
		this.displayPicture();
		this.isTwoFA();
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

		onChangeFileUpload($event) {
            const target = $event.target as HTMLInputElement;
            this.file = target.files[0];
		},

		async Upload()
		{
			this.error = "";
			if (!this.file)
			{
				this.error = "No image to upload."
				return ;
			}
			let formData = new FormData();
  			formData.append('file', this.file);
			const res = await fetch(`http://localhost:3000/api/users/upload`, {
				method: 'post',
				body: formData,
				})
			const ret = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ picture: this.file.name })
			})
			this.displayPicture();
		},

		async displayPicture()
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userId}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
			this.picture = blobUrl;
    		return blobUrl;
		},

		async isTwoFA()
		{
			const res = await fetch(`http://localhost:3000/api/users/${this.userId}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' }
			})
			this.user = await res.json();
			console.log(this.user);
			if (this.user.twoFactorAuthEnabled == false)
				this.twofa = false;
			else
				this.twofa = true;
		},

		isDisable()
		{
			if (this.twofa == false)
				return 1;
			else 
				return 0;
		},

		isEnable()
		{
			if (this.twofa == true)
				return 1;
			else
			return 0;
		},

		async handleTwoFA()
		{
			if (this.twofa == false)
			{
				const res = await fetch('http://localhost:3000/api/2fa/generate', {

					method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(this.user),
				})
				const rep = await res.json();
				this.secret = rep;
				const ret = await fetch(`http://localhost:3000/api/2fa/qrcode`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
				})
				const blob = await ret.blob();
    			const newBlob = new Blob([blob]);
				const blobUrl = window.URL.createObjectURL(newBlob);
				this.qrcode = blobUrl;
				this.twofa = true;
				return ;

			}
			else if (this.twofa == true)
			{
				this.turnoff = "oui";
				this.twofa = false;
			}
		},

		async turnOn2FA()
		{
			this.error = "";
			if (!this.googlecode)
			{
				this.error = "No code to submit"
				return ;
			}
			const res = await fetch('http://localhost:3000/api/2fa/turn-on', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({code: this.googlecode, user: this.user}),
				})
			const ret =	await res;
			if (ret.status == 401)
			{
				this.error = "Wrong identification code."
				return ;
			}
			this.finish = "Two factor authentication activated."
		},

		async turnOff2FA()
		{
			this.error = "";
			if (!this.googlecode)
			{
				this.error = "No code to submit"
				return ;
			}
			const res = await fetch('http://localhost:3000/api/2fa/turn-off', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({code: this.googlecode, user: this.user}),
				})
			const ret =	await res;
			if (ret.status == 401)
			{
				this.error = "Wrong identification code."
				return ;
			}
			this.finish = "Two factor authentication desactivated."
		},
	}
}
</script>

<style>

.error {
	justify-content: top;
	color: red;
	margin-left: 10%;
}

.alert {
	margin-left: 10%;
	color: green;
}
.secret {
	margin-top: 3%;
}
.settingsPage
{
	font-size:	130%;
	font-family: MyanmarText;
	font-weight:	bold;
	min-height:	300px;
	min-width: 548px;
}

.settings {
	display: block;
	border: solid white 2px;
	border-radius: 5px;
	margin-right: auto;
	margin-left: auto;
	width: 80%;
	padding-top: 5%;
	padding-bottom: 5%;
}
.submitBar > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:		20%;
	margin-left: 10%;
}

.secret > input.textArea 
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:		20%;
	margin-left: 10%;
}

.secret > .secret-content
{
	margin-left:	10%;
}

.secret > .desactived
{
	margin-left: 10%;
}
.textArea {
	height: 20%;
	vertical-align: center;
	margin-left: auto;
    margin-right: auto;
}

.title {
	margin-top: 1.5%;
	width:		30%;
	font-size: 100%;
	margin-left: 10%;
}

.selector {
    margin-left: 10%;
	padding-top: 1%;
	width: 10%;
	background:	white;
	border:	solid rgb(238, 220, 220);
	font-size:	100%;
	color:	rgb(236, 100, 151);
	border-radius: 4px;
	font-family: MyanmarText;
}

.submitBar > .fileArea {
	justify-content: left;;
	background:	none;
	font-size:	100%;
	font-family: MyanmarText;
	margin-top: 1.5%;
	margin-left: 10%;
    margin-right: auto;
	width:		20.8%;
}
.settingsPage > .submitBar
{
	height: 15%;
	display:	flex;
	margin-top: 3%;
	margin-right:	6%;
	margin-left:	auto;
	flex-direction:	row;
}

.submitButton
{
	margin-left: 40%;
	padding-top: 1%;
	width: 10%;
	background:	none;
	border:	solid white;
	font-size:	100%;
	color:	white;
	border-radius: 4px;
	font-family: MyanmarText;
}

.submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}
.settingsPage > .submitBar > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

.profile-image {
    /*float: left;*/
	margin-top: 		5%;
	margin-left: 		35%;
    width: 				calc(33.333% - 1rem);
    display: 			flex;
    justify-content: 	center;
    align-items: 		center;
    margin-right:		3rem;
	margin-bottom:		5%;
}

.profile-image > img {
	border-radius: 50%;
	overflow: hidden;
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
	object-fit:cover;
}

</style>