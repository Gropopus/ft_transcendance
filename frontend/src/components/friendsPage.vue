
<template>
	<div id="friendsPage" class="friendsPage">
		<!-- <div v-for="user in getFriends" class="friendsArea">
			<p>{{ user.username }}</p> -->
			
		<!-- </div> -->
		<div class="friendsToolSpace">
		</div>
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
// const fp = new Vue({
// 	el: "#friendsArea",
// 	methods: {
// 		getFriends() {
// 			return friendService.getUserFriends(this.userId);
// 		}
// 	}
// })

</script>

<style lang="css">
.friendsArea
{
	float:	left;
	width:	70%;
	min-height:	500px;
	max-height:	500px;
	overflow-y:	scroll;
	border:	solid 3px white;
	border-radius: 5px;
}

.friendsToolSpace
{
	float:	right;
	width:	25%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}

.friendsToolNav
{
	float:	right;
	width:	25%;
	min-height:	225px;
	border:	solid 3px white;
	border-radius: 5px;
	margin-bottom:	min(22px);
}
</style>
