<template>
	<div class="GameArea">
		<button>Quick Play</button>
		<button>Customize</button>
		<button>Watch</button>
	</div>
	<div class="UserRecap">
	</div>
	<div class="SocialRecap">
	</div>
</template>

<script lang="ts">
export default	{
	props:	{
		userId:	{
			type:	[Number, String],
			default:	"0"
		},
		currentPage:	{
			type:	[Number, String],
			default:	"0"
		}
	}
}
</script>

<style lang="css">
.GameArea
{
	float:	left;
	display:	flex;
	width:	70%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	flex-direction:	column;
}

.GameArea > button
{
	margin-right:	auto;
	margin-left:	auto;
	margin-top:	auto;
	margin-bottom:	auto;
	background:	none;
	padding:	15px;
	padding-bottom: 3px;
	border:	solid 3px white;
	border-radius:	5px;
	font-family:	MyanmarText;
	font-size:	24px;
	letter-spacing:	2px;
	color:	white;
}

.GameArea > button:hover
{
	background:	var(--white-10);
}

#canvas
{
	width:	100%;
	height:	100%;
}

.UserRecap
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.SocialRecap
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-top:	min(22px);
}
</style>
