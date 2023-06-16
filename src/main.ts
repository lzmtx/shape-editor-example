import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupPinia } from './store'

import './styles/reset.css'
import './styles/iconfont.css'
import 'element-plus/dist/index.css'

function install() {
	const app = createApp(App)

	setupPinia(app)

	app.use(router)

	app.mount('#app')
}
install()
