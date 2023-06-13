/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	env: {
		node: true,
		es2021: true
	},
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier',
		'plugin:prettier/recommended' // 使用 prettier 格式化代码
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		quotes: ['error', 'single'], // 配置单引号的规则，如果不是单引号，报错
		semi: 'off', //  是否添加行末分号
		'vue/multi-word-component-names': 'off' // 关闭组件命名规则
	}
}
