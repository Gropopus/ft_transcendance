<template>
	<div class="settingsPage">
		<div class="profile-resume">
			<div class="picture">
				<img :src="picture" alt="userDate.username" />
			</div>
			<div class="info">
				<div class="username"> {{ userData.username }} </div>
				<div class="usermail"> {{ userData.email }} </div>
			</div>
			<div class="perso-info">
				<button @click="goToRoute('/profile')" title="profile"> Profile </button>
			</div>
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
			<div class="title"> Two factor authentication: </div>
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

	emits:	['update:userId', 'userIsOnline'],

	data:	function()	{
		return {
			userData: [],
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
	mounted() {
		this.userData;
		this.picture;
	},

	async created()	{
		this.displayPicture();
		this.isTwoFA();
		this.userData = await this.fetchUserData();
		this.picture = await this.getPicture();
	},

    async updated() {
        await this.$emit('userIsOnline', this.userId);
    },

	methods:	{
		async fetchUserData() {
			const res = await fetch(`http://localhost:3000/api/users/${this.userId}`, {
    			method: 'get',
    			headers: { 'content-type': 'application/json' }
			});
			const data = await res.json();
			return data;
		},

		async getPicture()
		{
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userId}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
    		return blobUrl;
		},

		async updateLogin() {
				this.error = "";
				if (!this.userLogin)
				{
	        	 	this.error = "Unable to update login with an empty login.";
					return ;
				}
				const test = await fetch(`http://localhost:3000/api/users/find-by-username/${this.userLogin}`, {
					method: 'get',
					headers: { 'content-type': 'application/json' },
				})
				const rep = await test.json();
				if (rep.length != 0)
				{
					this.error = "This login is already used by another user."
					return ;
				}
				else
				{
					const res = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
						method: 'post',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ username: this.userLogin })
					})
					this.userData.username = this.userLogin;
				}
				this.userLogin = "";
				
		},
		async updatePassword()	{
				this.error = "";
				if (!this.userPass)
				{
	        	 	this.error = "unable to update password with an empty password.";
					this.userPass = "";
					return ;
				}
				const res = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ password: this.userPass })
			})
			this.userPass = "";
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

		goToRoute(path: string) {
			this.$router.push(path);
		},
	}
}
</script>

<style lang="css" scoped>

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
	background:	linear-gradient(135deg, var(blue), var(--main-color-2))	fixed;
	flex-direction:	row;
	/* text-align: center; */
	margin-right: 3%;
	margin-left: 3%;
	margin-bottom: 0%;
	/* min-width: 1000px; */
}

.settings {
	margin-top: 7%;
	margin-left: 7%;
	font-size: 150%;
}
.submitBar > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:		auto;
	/* margin-left: 10%; */
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
	/* width:		30%; */
	font-size: 100%;
	/* margin-left: 10%; */
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
	min-width: 150px;
}

.submitBar > .fileArea {
	justify-content: left;
	background:	none;
	font-size:	100%;
	font-family: MyanmarText;
	margin-top: 1.5%;
    margin-right: auto;
	width:	auto;
	min-width: 150px;
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
	margin-left: 30%;
	padding-top: 1%;
	width: 10%;
	background:	none;
	border:	solid white 2px;
	font-size:	100%;
	color:	white;
	border-radius: 4px;
	font-family: MyanmarText;
	overflow: hidden;
	min-width: 95px;
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

.profile-resume {
	display: flex;
	flex-direction: row;
	gap: 3%;
	/* flex: 1 1 0; */
	border: solid 3px white;
	margin-bottom: 2%;
	align-content: center;
	border: none;
	border-bottom: solid 2px  white;
}

.info
{
	flex: 4;
	display: flex;
	flex-direction:	column;
	margin-top: 4%;
	margin-bottom: 2%;
	text-align: left;
	vertical-align: center;
}

.username {
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	300%;
	color: var(--font-blue);
	font-weight:	bold;
}

.usermail{
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
}

.perso-info
{
	flex: 1;
	margin-right: 3%;
	display: flex;
	flex-direction:	column;
	margin-top: 2%;
	margin-bottom: 2%;
	vertical-align: center;
}

.perso-info > button
{
	flex: 5;
	background: none;
	border: solid 3px white;
	font-family: MyanmarText;
	letter-spacing:	2px;
	font-size:	150%;
	color: white;
	max-height: 60px;
	min-width: 150px;
	width:		50%;
	margin-top: auto;
	margin-bottom: auto;	
	padding-top: 2%;
	/*margin: 20%;*/
	margin-top: auto;
}

.perso-info > button:hover
{
	background: rgba(255, 255, 255, 0.5);
	cursor: pointer; 
}

.picture {
	flex: 1;
	width: calc(33.333% - 1rem);
    vertical-align: center;
	margin-left: 3%;
	margin-top: 2%;
	margin-bottom: 2%;
}

.picture > img {
	/*margin-left: 2%;
	margin-bottom: 2%;
	margin-top: 2%;
	min-height: 150px;
	min-width: 150px;*/
	border-radius: 50%;
	overflow: hidden;
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
	object-fit:cover;
}
</style>
