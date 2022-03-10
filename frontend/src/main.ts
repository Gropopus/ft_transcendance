import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import logPage from './components/logPage.vue'
import register from './components/register.vue'
import playPage from './components/playPage.vue'
import chatPage from './components/chatPage.vue'
import statsPage from './components/statsPage.vue'
import friendsPage from './components/friendsPage.vue'
import profilePage from './components/profilePage.vue'
import logoutPage from './components/logoutPage.vue'
import settingsPage from './components/settingsPage.vue'
import App from './App.vue'

const app = createApp(App)
export const router = createRouter	({
	history: createWebHistory(),
	routes:	[
		{
			path:	'/',
			component:	playPage,
			meta:	{ requiresAuth: true }
		},
		{
			path: '/public',
			redirect: '/' 
		},
		{
			path:	'/play',
			component:	playPage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/chat',
			component:	chatPage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/stats',
			component:	statsPage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/friends',
			component:	friendsPage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/profile',
			component:	profilePage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/logout',
			component:	logoutPage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/settings',
			component:	settingsPage,
			meta:	{ requiresAuth: true }
		},
		{
			path:	'/login',
			component:	logPage
		},
		{
			path:	'/register',
			component:	register
		}
	]
})

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if (requiresAuth) {
		if (app.userId != "0")	{
			next();
		}
		else {
			next('/login');
		}
	}
	else {
		next();
	}
});

app.use(router)
app.mount('#app')
