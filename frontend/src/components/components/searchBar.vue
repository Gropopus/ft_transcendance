<template>
	<div class="searchHeader">
		<img class="logo" src="/src/assets/header-id.png" />
		<div class="searchBar">
			<div style="display: flex; justify-content: right">
				<img style="width: 3%; min-height: 40px; min-width: 50px" src="../assets/magnifying-glass.png">
				<span style="font-size: 25px; text-align: right; margin-left: 1%"> Search a user</span>
			</div>
			<input type="text" v-model="search" v-on:keyup="searchUser()" class="textArea1">
			<div class="friendFound" v-if="found.length"  :key="elem.id" v-for="elem in found">
				<p v-on:click="goToUserPage(elem.username)"> {{ elem.username }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default	defineComponent ({
	name: 'searchBar',

    data() {
        return {
            found: [],
            search: "",
        }
    },

    methods: {
        async goToUserPage(username: string) {
			this.$router.push(`/profile/${username}`)
		},

		async searchUser() {
			if (!this.search)
			{
				this.found = [];
				return [];
			}
			await fetch(`http://localhost:3000/api/users/search/${this.search}`, {
				method: 'get',
				headers: { 'content-type': 'application/json' }
			})
			.then(res => {
				return res.json();
			})
			.then((resJson) => {
				this.found = resJson;
				return resJson;
			})
			.catch(error => {
				this.found = [];
				return [];
			});
		},
    }
})
</script>

<style>

.searchHeader {
    display: flex;
	min-width: 900px;
}

.searchBar {
	display: flex;
	flex: 3;
	flex-direction: column;
	justify-content: right;
}

.logo {
    flex: 1;
    max-width: 280px;
    max-height: 150px;
    margin-left: 5%;
    margin-top: 10px;    
}

</style>
