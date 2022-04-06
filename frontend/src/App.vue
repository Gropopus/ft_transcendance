<template>
  <main>
    <app-navigation v-if="isLogged()"/>
    <div class="winSurface">
      <!-- <div v-if="isLogged() || isCurrent('/register')"></div> -->
      <!--	<div v-else v-bind:is="goToRoute('/login')"></div> -->
      <!-- <div v-if="getBackUserId()">ok</div> -->
      <router-view
        :userId="this.userId"
        @update:userId="saveUserId($event)"
        v-bind="setRoute()"/>
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

    isLogPage(name: string) {
      const pageLog = [
        'game',
        'challenge',
        'watch',
        'observe',
        'chat',
        'createChat',
        'channel-setting',
        'logout',
        'profile',
        'userProfile',
      ];
      for (let page of pageLog)
        if (page == name)
          return true;
      return false;
    },

    setRoute() {
      const name = this.$route.name;
      console.log(name);


      if (!this.isLogged() && this.isLogPage(name))
        this.$router.replace('/login')
      else if (this.isLogged && !this.isLogPage(name))
        this.$router.replace('/game')
    },

    isCurrent(path: string) {
    if (path == this.$route.path)
      return true;
    return false;
    },

    saveUserId(id: string) {
      this.userId = id;
    },

    async logoutUser() {

    },
  }
}
</script>

<style>
@import './assets/base.css';
</style>