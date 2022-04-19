<template>
	<div class="notFound">
		<img src="/src/assets/confused-cat.png" />
        <h1> 404 Not found </h1>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'notFound',
	props:	{
	userId:	{
		type:	[Number, String],
		default:	0,
		required: true
		}
	},
	methods: {
		goBack() {
			this.$router.push('/login');
		},
	}
})
</script>

<style>
.notFound {
	display: flex;
	flex-direction: column;
	text-align: center;
	vertical-align: center;
	width: 100%;
	height: 20%;
	margin-top: 10%;
}

.notFound > img {
	margin-right: auto;
	margin-left: auto;
	width: 20%;
}

.notFound > h3:hover {
	text-decoration: underline;
	cursor: default;
}
</style>
