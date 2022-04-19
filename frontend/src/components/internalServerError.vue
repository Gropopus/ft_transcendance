<template>
	<div class="notFound">
		<img src="/src/assets/confused-cat.png" />
        <h1> Internal Server Error </h1>
        <br><h5>We are deeply sorry...</h5>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'internalServerError',
	
	methods: {
		goBack() {
			this.$router.replace('/login');
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
