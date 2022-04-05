import { createApp } from 'vue'
import App from './App.vue'
// import router from './router/index.js'
import * as VueRouter from 'vue-router'
import logPage from './components/logPage.vue'
import register from './components/register.vue'
import playPage from './components/playPage.vue'
import chatPage from './components/chatPage.vue'
import friendsPage from './components/friendsPage.vue'
import createChatPageVue from './components/createChatPage.vue'
import profilePage from './components/profilePage.vue'
import userPage from './components/userPage.vue'
import logoutPageVue from './components/logoutPage.vue'
import settingsPage from './components/settingsPage.vue'
import observePage from './components/observePage.vue'
import callback from './components/callback.vue'
import watchPage from './components/watchPage.vue'
import channelsetting from './components/chat-setting.vue'
import NotFound from './components/NotFound.vue'
import challengePage from './components/challengePage.vue'

const router = VueRouter.createRouter({
history: VueRouter.createWebHistory(),
routes: [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: logPage,
        props: true
    },
    {
        path: '/register',
        name: 'register',
        component: register,
        props: true
    },
    {
        path: '/game',
        name: 'game',
        component: playPage,
        props: true
    },
    {
        path: '/challenge/:challengeMode/:challengeId',
        name: 'challenge',
        component: challengePage,
        props: true
    },
    {
        path: '/watch',
        name: 'watch',
        component: watchPage,
        props: true
    },
    {
        path: '/watch/:gameId',
        name: 'observe',
        component: observePage,
        props: true
    },
    {
        path: '/chat',
        name: 'chat',
        component: chatPage,
        props: true
    },
    {
        path: '/friends',
        name: 'friends',
        component: friendsPage,
        props: true
    },
    {
        path: '/createChat',
        name: 'createChat',
        component: createChatPageVue,
        props: true
    },
    {
        path: '/channel-setting/:id',
        name: 'channel-setting',
        component: channelsetting,
        props: true
    },
    {
        path: '/logout',
        name: 'logout',
        component: logoutPageVue,
        props: true
    },
    {
        path: '/settings',
        name: 'settings',
        component: settingsPage,
        props: true
    },
    {
        path: '/profile',
        name: 'profile',
        component: profilePage,
        props: true
    },
    {
        path: '/profile/:username',
        name: 'userProfile',
        component: userPage,
        props: true
    },
    {
        path: '/callback',
        name: 'callback',
        component: callback,
        props: true
    },
    {
        path: "/:catchAll(.*)",
        name: 'NotFound',
        component: NotFound,
    },
    ]
});

createApp(App).use(router).mount('#app')
