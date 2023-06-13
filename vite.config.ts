import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd(), '')

	return defineConfig({
		plugins: [
			vue(),
			vueJsx(),
			createHtmlPlugin({
				inject: {
					data: {
						title: env.VITE_APP_TITLE
					}
				}
			}),
			// 配置 element-plus 自动按需引入
			AutoImport({
				imports: ['vue'],
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()]
			})
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
						@use "@/styles/mixin.scss" as *;
						@use "@/styles/theme.scss" as *;
					`
				}
			}
		},
		server: {
			port: 2000,
			proxy: {
				[env.VITE_BASE_API]: {
					target: `http://admin.varmm.com`,
					changeOrigin: true
				}
			}
		}
	})
}
