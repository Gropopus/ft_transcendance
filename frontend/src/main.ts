import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'

const app = createApp(App)
const router = createRouter	({
	history: createWebHistory(),
	routes:	[
		{
			path:	'/',
			component:	App
		},
		{
			path: '/public',
			redirect: '/' 
		}
	]
})

app.use(router)
app.mount('#app')
