<template>
	<div>
		<div class="LogoutHeader">
			<img src="../assets/picto-id.png">
		</div> <!-- LogoutHeader end -->

		<div class="LogoutForm">
			<p>
				Leaving so soon ?
			</p>

			<div class="submitBar">
				<button @click="logout()" class="submitButton">
					Yes
				</button>
				<button @click="cancel()" class="submitButton">
					No
				</button>
			</div> <!-- submitBar end -->
		</div> <!-- LogoutForm end -->
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
	},
	emits:	['update:userId'],
	methods:	{
		async logout()	{
			const res = await fetch(`http://localhost:3000/api/users/${this.userId}`, {
				method: 'get',
					headers: { 'content-type': 'application/json' }
			})
			const data = await res.json()
			console.log(data)
			const res1 = await fetch(`http://localhost:3000/api/users/logout`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(data)
			})
			console.log(res1);
			this.$emit('update:userId', "0");
			this.$router.push({name: 'login'});
		},
		cancel:	function()	{
			this.$router.push({name: 'logout'});
		}
	}
}
</script>

<style>

.LogoutHeader
{
	margin-top:	3%;
	height:	20%;
	display:	flex;
	justify-content:	center;
}

.LogoutHeader > img
{
	object-fit: contain;
}

.LogoutForm
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

.LogoutForm > input.textArea
{
	border: none;
	background-color:	var(--input-fields);
	opacity:	50%;
	font-size:	24px;
	padding:	6px;
}

.LogoutForm > .submitBar
{
	margin-top:	2%;
	display:	flex;
	margin-right:	auto;
	margin-left:	auto;
	flex-direction:	row;
}

.LogoutForm > .submitBar > .submitButton
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

</style>
