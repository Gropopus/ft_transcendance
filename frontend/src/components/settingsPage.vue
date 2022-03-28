<template>
	<div class="settingsPage">
		<div class="profile-image">
				<img :src="picture" />
			</div>
		<div class="submitBar">
			<label for="login"> Change your Login: </label><br>
			<input type="text" v-model="userLogin" class="textArea simpleline">
			<button @click="updateLogin()" class="submitButton">
				Update </button></div>
		<div class="submitBar">
		<label for="password"> Change your Password: </label>	<br>
		<input type="password" v-model="userPass" class="textArea">	<br>
		<button @click="updatePassword()" class="submitButton">
				Update </button>
		</div>
		<input type="file" accept="image/x-png,image/gif,image/jpeg" @change="onChangeFileUpload($event)">
		<button @click="Upload()">Upload</button>
		<p class="error" v-if="error"> {{ error }} </p>
		<br>
		<p>
		</p>
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
			filename: "",
			extension: "",
			picture: "",
		}
	},
	created(){
		this.displayPicture();
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
			//const link = document.createElement('a');
			console.log(blobUrl);
			this.picture = blobUrl;
    		return blobUrl;
    		/*link.setAttribute('download', `${filename}.${extension}`);
    		document.body.appendChild(link);
    		link.click();
    		link.parentNode.removeChild(link);
    		// clean up Url
    		window.URL.revokeObjectURL(blobUrl);*/
		}
	}
}
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
	size: 10%;
}

.settingsPage > .simpleline
{
	max-height: 60px;
}

.settingsPage > .submitBar
{
	margin-top:	2%;
	display:	flex;
	margin-right:	6%;
	margin-left:	auto;
	flex-direction:	row;
}

.settingsPage > .submitBar > .submitButton
{
	display:	row;
	background:	none;
	/*flex:	0 0 auto;*/
	flex-direction: row;
	margin-bottom:	5%;
	margin-right:	auto;
	padding-top:	3%;
	padding-left:	5%;
	padding-right:	5%;
	border-radius: 5px;
	background:	none;
	border:	solid white;
	font-size:	24px;
	color:	white;
	width: 20%;
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
	margin-left: 30%;
    width: calc(33.333% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3rem;
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