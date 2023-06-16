import { createRouter, createWebHistory } from 'vue-router'
import Editor from '@/views/Editor/index.vue'
import Preview from '@/views/Preview/index.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'editor',
			component: Editor
		},
		{
			path: '/preview',
			name: 'preview',
			component: Preview
		}
	]
})

export default router
