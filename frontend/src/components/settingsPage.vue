<template>
	<div class="settingsPage">
		<div class="profile-image">
				<img :src="picture" />
				<br>
			</div>
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
		<br>
		<p>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'settingsPage',
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
			userMail:	"",
			error: "",
			file: null,
			user: "",
			filename: "",
			extension: "",
			picture: "",
		}
	},
	async created(){
		console.log('helloooo ' + this.userId);
		this.picture = await this.getPicture();
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
			this.getPicture();
		},

		async getPicture()
		{
			console.log('helloooo ' + this.userId);
			const ret = await fetch(`http://localhost:3000/api/users/pictureById/${this.userId}`, {
				method: 'get',
					headers: { 'responseType': 'blob' },
			})
			const blob = await ret.blob();
    		const newBlob = new Blob([blob]);
			const blobUrl = window.URL.createObjectURL(newBlob);
			console.log(blobUrl);
    		return blobUrl;
		}
	}
})
</script>

<style>

.error {
	justify-content: top;
	color: red;
}

.settingsPage
{
	font-size:	130%;
	font-family: MyanmarText;
	font-weight:	bold;
	min-height:	300px;
	min-width: 548px;
}

.settingsPage > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:		20%;
}

.textArea {
	height: 20%;
	vertical-align: center;
	margin-left: auto;
    margin-right: auto;
}

.title {
	margin-top: 1.5%;
	width:		20%;
	font-size: 100%;
}

/*.settingsPage > input.fileArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	130%;
	padding:	6px;
	width:		20%;
}*/

.fileArea {
	justify-content: left;;
	background:	none;
	font-size:	100%;
	font-family: MyanmarText;
	margin-top: 1.5%;
	margin-left: auto;
    margin-right: auto;
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
	padding-top: 1%;
	width: 10%;
	background:	none;
	border:	solid white;
	font-size:	100%;
	color:	white;
	border-radius: 4px;
	font-family: MyanmarText;
}

.settingsPage > .submitBar > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

.profile-image {
    /*float: left;*/
	margin-top: 5%;
	margin-left: 35%;
    width: calc(33.333% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3rem;
	margin-bottom: 15%;
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