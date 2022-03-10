<template>
	<div class="profilePicture">
	</div>
	<div class="ladderRecap">
	</div>
	<div class="socialRecap">
	</div>
	<div class="infoArea">
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
.profilePicture
{
	width:	30%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
	display:	block;
}

.ladderRecap
{
	float:	left;
	width:	30%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-top:	min(22px);
	display:	block;
}

.infoArea
{
	float:	right;
	width:	30%;
	min-height:	500px;
	margin-right:	3%;
	margin-left:	3%;
	border:	solid 3px white;
	border-radius: 5px;
	margin-right:	22px;
	display: block;
	margin-top: 	-22%;
}

.socialRecap
{
	float:	right;
	width:	30%;
	min-height: 500px;
	margin-left:	3%;
	border:	solid 3px white;
	border-radius: 5px;
	display:	block;
	margin-top: 	-22%;
}
</style>
