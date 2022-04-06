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
        v-bind="setRoute()" />
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

  async beforeUnmounted() {
    await this.logoutUser();
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
        'settings'
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

    async logoutUser() {
        const res = await fetch(`http://localhost:3000/api/users/${this.userId}`, {
          method: 'get',
            headers: { 'content-type': 'application/json' }
        })
        const data = await res.json()
        const res1 = await fetch(`http://localhost:3000/api/users/logout`, {
          method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data)
        })
    },

    handleError(status: number) {
      console.log('handle error: ', status);
        if (status == 401)
          this.$router.push('/401');
        else if (status == 40)
          this.$router.push('/404');
        else if (status == 500)
          this.$router.push('/500');
        else
          return false;
        console.log("ERROR");
        return true;
    }
  }
}
</script>

<style>
@import './assets/base.css';
</style>