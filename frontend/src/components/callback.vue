<template>
	<div class="404">
		<img src="/src/assets/picto-id.png" />
        404 Not found
	</div>

    <div class="callback" v-if="twofa">
            <p class="error" v-if="error"> {{ error }} </p>
			Please enter the 6 digit code from Google Authenticator: <br>
			<input type="googlecode" v-model="googlecode" class="textArea">
			<button @click="twoFACheck()" class="submitButton">
				Log-in </button>
    </div>
</template>

<script lang="ts">
export default	{
	name: 'callback',
	props:	{
		userId:	{
			type:	[Number, String],
			default:	0
		}
	},
	data:	function()	{
		return {
			twofa: "",
			googlecode: "",
			userLogin:	"",
			userPass:	"",
			error:		"",
            user:       "",
		}
	},
	emits:	['update:userId'],
    created(){
		this.loginWith42();
    },
	methods:	{


		async 	twoFACheck()
		{
			this.error = "";
			const res = await fetch('http://localhost:3000/api/2fa/authenticate', {
				method: 'post',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({code: this.googlecode, user: this.user}),
				})
			const ret =	await res;
			console.log(ret.status);
			if (ret.status == 401)
			{
				this.error = "Wrong identification code."
				return ;
			}
			this.$emit('update:userId', this.user.id);
			this.$router.replace({name: 'game'})

		},
		async	loginWith42(){
			console.log(`${this.$route.params.unknown}` + "->uri");

            let uri = `${this.$route.params.unknown}`;
            if (uri == 'callback')
            {
                uri = window.location.href
                console.log(uri + "window");
                let backadrr = "http://localhost:3000/api/oauth2/school42/callback"
	            let auth = "/api/oauth2/school42";
                let test= uri.slice(30);
                backadrr += test;
                console.log(backadrr + "backaddr");
	            let output = [uri.slice(0, 21), auth, uri.slice(21)].join('');
	            uri = output;
                console.log(uri);
                const res = await fetch(backadrr, {
					method: 'get',
					headers: { 'content-type': 'application/json' },
			    })
                this.user =	await res.json();
                if (this.user.twoFactorAuthEnabled == false)
                {
                    this.$emit('update:userId', this.user.id);
                    this.$router.replace({name: 'game'})
                }
                else
                {
                    this.twofa = "oui";
                }
            }
		},

}
}
</script>

<style lang="css" scoped>

.callback > input.textArea
{
    margin-left: 5%;
	border: none;
	background-color:	var(--input-fields);
	margin-bottom:	3%;
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
	width:		25%;
}

.callback > .submitButton
{
    margin-left: 5%;
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

.callback > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

.callback {
    border: solid white;
    margin-right:   auto;
    margin-left:    auto;
}

.error {
	justify-content: top;
	color: red;
}
</style>
