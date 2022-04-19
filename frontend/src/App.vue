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
        @userIsOnline="userIsOnline($event)"
        v-bind="setRoute()"
        style="width: 93%;"/>
    </div>
  </main>
</template>

<script lang="ts">

import appNavigation from "./components/appNavigation.vue";

export default	{
  name: 'App',
  components: {
      appNavigation,
  },
  data() {
    return {
      userId: "0"
    }
  },

	emits:	['userIsOnline'],

  async updated() {
    if (this.isLogged())
        await this.userIsOnline(this.userId);
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
        'friends',
        'settings',
        'internalServerError',
        'Unauthorized',
        'notFound'
      ];
      for (let page of pageLog)
        if (page == name)
          return true;
      return false;
    },

    setRoute() {
      const name = this.$route.name;
      if (!this.isLogged() && this.isLogPage(name))
        this.$router.replace('/login')
      else if (this.isLogged() && !this.isLogPage(name) && name != 'callback')
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

    async userIsOnline(id: number) {
      await fetch(
        `http://localhost:3000/api/users/${id}/isOnline`, {
        method: 'put',
        headers: { 'content-type': 'application/json' }
        });
    },
  }
}
</script>

<style>
@import './assets/base.css';
</style>
