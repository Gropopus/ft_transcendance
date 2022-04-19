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
		</div>
		<div class="settings">
		<p class="error" v-if="error"> {{ error }} </p>
		<p class="update" v-if="updateMess"> {{ updateMess }} </p>
		<div class="submitBar">
			<div class="title"> Change your Login:</div>
 			<div class="settingsField">
				<input type="text" v-model="userLogin" @keyup.enter="updateLogin()" class="textArea">
				<button @click="updateLogin()" class="submitButton">
					Update
				</button>
			</div>
		</div>
		<div class="submitBar" v-if="!userData.id42">
			<div class="title"> Change your Password: </div>
			<div class="settingsField">
				<input type="password" v-model="userPass" @keyup.enter="updatePassword()" class="textArea">
				<button @click="updatePassword()" class="submitButton">
						Update
				</button>
			</div>
		</div>
		<div class="submitBar">
			<div class="title"> Change your Picture: </div>
			<div class="settingsField">
				<input type="file" accept="image/x-png,image/gif,image/jpeg,image/png" @change="onChangeFileUpload($event)" class="fileArea">
				<button @click="Upload()" class="submitButton">
					Upload
				</button>
			</div>
		</div>
		<div class="submitBar">
			<div class="title"> Two factor authentication: </div>
			<div class="settingsField">
				<div class="textArea"></div>
				<select class="selector" @change="handleTwoFA()">
					<option :selected="isDisable()">disable</option>
					<option :selected="isEnable()"> enable</option>
				</select>
			</div>
		</div>
		<div class="secret" v-if="secret && qrcode">
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
		<div class="secret" v-if="secret && turnoff">
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
			default:	0,
			required: true
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
			updateMess: "",
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

		async isLoginExist(login: string) {
			let isLoginExist = 0;
			await fetch(`http://localhost:3000/api/users/find-by-username/${this.userLogin}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' },
			})
			.then(res => {
				return res.json();
			})
			.then(() => {
				isLoginExist = 1;
			})
			.catch(() => {
				isLoginExist = 0;
			});
			return isLoginExist;
		},

		checkLogin(login: string) {
			if (!this.userLogin || this.userLogin.length > 16)
				return false;
			for (const c of login)
				if ((c < 'A' || c > 'z') && (c < '0' || c > '9') && c != '-' && c != '_' && c!= '.')
					return false;
			return true;
		},

		async updateLogin() {
			this.error = "";
			this.updateMess = "";
			if (!this.checkLogin(this.userLogin))
				this.error = "Invalid login";
			else if ((await this.isLoginExist(this.userLogin)))
				this.error = "This login already exists";
			else {
				const res = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
					method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ username: this.userLogin })
				})
				this.userData.username = this.userLogin;
				this.updateMess = "Login updated";
			}
			this.userLogin = "";
		},

		async updatePassword()	{
			this.error = "";
			this.updateMess = "";
			if (!this.userPass || this.userPass.length > 42)
			{
				this.error = "Invalid password";
				this.userPass = "";
				return ;
			}
			const res = await fetch(`http://localhost:3000/api/users/update/${this.userId}`, {
			method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ password: this.userPass })
			})
			this.updateMess = "Password updated";
			this.userPass = "";
		},

		onChangeFileUpload($event) {
            const target = $event.target as HTMLInputElement;
            this.file = target.files[0];
		},

		async Upload()
		{
			this.error = "";
			this.updateMess = "";
			if (!this.file)
				return ;
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
				this.secret = "";
				this.twofa = false;
			}
		},

		async turnOn2FA()
		{
			this.error = "";
			this.updateMess = "";
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
				this.error = "Wrong identification code"
				return ;
			}
			this.finish = "Two factor authentication activated"
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
	margin-bottom: 5%;
	justify-content: top;
	text-align: center;
	border: solid 1px rgb(240, 69, 69);
	background: rgb(255, 0, 0, 0.06);
	color: rgb(255, 255, 255, 0.7);
}

.update {
	margin-top: auto;
	margin-bottom: 5%;
	justify-content: top;
	text-align: center;
	border: solid 1px rgb(255, 255, 255, 0.7);
	background: rgb(255, 255, 255, 0.1);
	color: rgb(255, 255, 255, 0.7);
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
	margin-right: 3%;
	margin-left: 3%;
	margin-bottom: 0%;
}

.settings {
	margin-top: 7%;
	margin-left: 7%;
	font-size: 150%;
}

.submitBar	{
	display: flex;
	flex-direction: column;
}

.settingsField	{
	display: flex;
	flex-direction: row;
	width: 70%;
}

.textArea	{
	flex:	0 0 9;
	width:	100%;
}

.settingsField > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:	100%;
}

.secret > input
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

.title {
	margin-top: 1.5%;
	font-size: 100%;
}

.selector {
	transition: all 0.3s linear;
	margin-left: 30%;
	padding: 10px 24px;
    text-transform: uppercase;
    border-radius: 25px;
    border: 2px solid white;
    font-weight: 1200;
    font-size: 16px;
    background: transparent;
    color: white;
}

.selector:hover	{
	background-color: white;
	cursor: pointer;
	color: black;
}

.submitBar > .settingsField > input.fileArea {
	flex: 0 0 9;
	justify-content: left;
	background:	none;
	font-size:	100%;
	font-family: MyanmarText;
	min-width: 150px;
	padding:	6px;
	width:	100%;
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
	flex: 0 0 2;
	padding: 10px 24px;
    text-transform: uppercase;
    border-radius: 25px;
    border: 2px solid white;
    font-weight: 1200;
    font-size: 16px;
    background: transparent;
    color: white;
	transition: all 0.3s linear;
	margin-left: 30%;
}

.submitButton:hover
{
	background-color: white;
	cursor: pointer;
	color: black;
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
	margin-top: auto;
	margin-bottom: auto;
	flex: 5;
	max-height:	60px;
	min-width: 150px;
	padding: 10px 24px;
    text-transform: uppercase;
    border-radius: 25px;
    border: 2px solid white;
    font-weight: 1200;
    font-size: 16px;
    background: transparent;
    color: white;
	transition: all 0.3s linear;
	margin-left: 30%;
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
	border-radius: 50%;
	overflow: hidden;
    width: 200px;
    height: 200px;
    max-width: 200px;
    max-height: 200px;
	object-fit:cover;
}
</style>
