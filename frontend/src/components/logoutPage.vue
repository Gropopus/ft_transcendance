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
			default:	"0",
			required: true
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
			const res1 = await fetch(`http://localhost:3000/api/users/logout`, {
				method: 'post',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(data)
			})
			this.$emit('update:userId', "0");
			this.$router.push({name: 'login'});
		},
		cancel:	function()	{
			this.$router.push({name: 'game'});
		}
	}
}
</script>

<style lang="css" scoped>

.LogoutHeader
{
	margin-top:	15%;
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
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	border-radius: 5px;
	margin-top:	2%;
	margin-bottom:	5%;
	margin-left:	auto;
	margin-right:	auto;
	padding-top:	2%;
	padding-right: auto;
	padding-left: auto;
	width:	30%;
	height:	40%;
	min-width: 300px;
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
	margin-bottom: 5%;
	margin-right: 5%;
	margin-left: 5%;
	display:	flex;
	flex-direction:	row;
	justify-content: center;
}

.LogoutForm > .submitBar > .submitButton
{
	flex: 1 1 0;
	margin: 5%;
	padding-top: 2%;
	background:	none;
	border:	solid white 3px;
	font-size:	100%;
	color:	white;
	font-family: MyanmarText;
}

.LogoutForm > .submitBar > .submitButton:hover
{
	background: rgba(255, 255, 255, 0.5);
	color: white;
	cursor: pointer; 
}

</style>
