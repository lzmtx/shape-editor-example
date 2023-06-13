import { createPinia } from 'pinia'
import piniaPersistence from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const pinia = createPinia()

function setupPinia(app: App) {
	pinia.use(piniaPersistence)
	app.use(pinia)
}

export { setupPinia }
