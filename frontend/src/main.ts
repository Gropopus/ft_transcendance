import { createApp } from 'vue'
import App from './App.vue'
// import router from './router/index.js'
import * as VueRouter from 'vue-router'
import logPage from './components/logPage.vue'
import register from './components/register.vue'
import playPageVue from './components/playPage.vue'
import chatPage from './components/chatPage.vue'
import friendsPage from './components/friendsPage.vue'
import createChatPageVue from './components/createChatPage.vue'
import profilePage from './components/profilePage.vue'
import userPage from './components/userPage.vue'
import logoutPageVue from './components/logoutPage.vue'
import settingsPage from './components/settingsPage.vue'

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
        component: playPageVue,
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
    ]
})
    

createApp(App).use(router).mount('#app')
