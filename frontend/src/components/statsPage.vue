<template>
	<div class="StatsWin">
		<div class="StatsTabs">
			<button class="tab" id="CurrentTab">
				Achievements
			</button>
			<button class="tab">
				Ladder
			</button>
			<button class="tab">
				History
			</button>
		</div>
		<div class="StatsArea">
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
		</div>
	</div>
</template>

<style lang="css">
.StatsWin
{
	width:	100%;
	min-height:	500px;
	border:	solid 3px white;
	border-radius: 5px;
	display:	flex;
	flex-direction:	row;
}

.StatsArea
{
	width:	100%;
	min-height:	500px;
	border-radius: 5px;
	overflow-y:	scroll;
	max-height:	500px;
}

.StatsTabs
{
	display:	flex;
	flex-direction:	column;
	width:	5%;
	min-height:	500px;
	border-right:	solid 3px white;
}

.StatsTabs > button
{
	flex:	1 1 0;
	writing-mode:	vertical-rl;
	text-align:	center;
	padding-right:	30%;
	transform:	rotate(180deg);
	background:	none;
	border:	none;
	font-size:	inherit;
	font-family: inherit;
	font-weight:	bold;
	color:	inherit;
}

.StatsTabs > button:hover
{
	background:	var(--deep-blue-10);
}

.StatsTabs #CurrentTab
{
	background:	white;
	color:	var(--font-blue);
	font-weight:	bold;
}
</style>
