import { createApp } from 'vue'
import App from './App.vue'
import { setupPinia } from './store'

import './styles/reset.css'
import './styles/iconfont.css'
import 'element-plus/dist/index.css'

function install() {
	const app = createApp(App)

	setupPinia(app)

	app.mount('#app')
}
install()
