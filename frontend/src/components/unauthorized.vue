<template>
	<div class="Unauthorized">
		<img src="/src/assets/muted-users.png" />
        <h1> Unauthorized </h1>
        <br><h5>You're not allowed here, you silly kitty...</h5>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Unauthorized',
	
	methods: {
		goBack() {
			this.$router.replace('/login');
		},
	}
})
</script>

<style>
.Unauthorized {
	display: flex;
	flex-direction: column;
	text-align: center;
	vertical-align: center;
	width: 100%;
	height: 20%;
	margin-top: 10%;
}

.Unauthorized > img {
	margin-right: auto;
	margin-left: auto;
	width: 20%;
}

.Unauthorized > h3:hover {
	text-decoration: underline;
	cursor: default;
}
</style>
