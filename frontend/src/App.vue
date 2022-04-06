<template>
  <main>
    <app-navigation v-if="isLogged()"/>
    <div class="winSurface">
      <!-- <div v-if="isLogged() || isCurrent('/register')"></div> -->
      <!--	<div v-else v-bind:is="goToRoute('/login')"></div> -->
      <router-view
        :userId="this.userId"
        @update:userId="saveUserId($event)" />
    </div>
  </main>
</template>

<script lang="ts">

import AppNavigation from "./components/AppNavigation.vue";

export default	{
  name: 'App',
  components: {
      AppNavigation,
  },
  data() {
    return {
      userId: "0"
    }
  },

  methods: {
    isLogged:	function(): Boolean	{
      if (this.userId != 0)
        return true;
      return (false);
    },

    goToRoute(path: string) {
    if (path != this.$route.path)
      this.$router.replace(path);
    },

    isCurrent(path: string) {
    if (path == this.$route.path)
      return true;
    return false;
    },

    saveUserId(id: string) {
      this.userId = id;
    },
  }
}
</script>

<style>
@import './assets/base.css';
</style>