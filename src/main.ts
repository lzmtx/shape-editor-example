import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupPinia } from './store'
import { initBaiduAnalytics } from './hooks/useBaiduAnalytics.hook'

import './styles/reset.css'
import './styles/iconfont.css'
import 'element-plus/dist/index.css'

// 非开发环境才使用百度统计
if (import.meta.env.MODE !== 'development') {
	initBaiduAnalytics()
}

function install() {
	const app = createApp(App)

	setupPinia(app)

	app.use(router)

	app.mount('#app')
}
install()
