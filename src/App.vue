<script setup lang="ts">
import Editor from '@/views/Editor/index.vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<template>
	<ElConfigProvider :z-index="2000" :locale="zhCn">
		<Editor />
	</ElConfigProvider>
</template>

<style lang="scss">
:root {
	--ac_color: rgb(0, 149, 255);
}
.scroll {
	overflow-y: auto;
	overflow-x: hidden;

	$sw: 6px;
	&::-webkit-scrollbar {
		width: $sw;
		border-radius: $sw;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #c7c9cc;
		border-radius: $sw;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: #adafb3;
	}

	// 兼容火狐浏览器
	scrollbar-color: #c7c9cc transparent;
	scrollbar-width: thin;
}
.no_scroll {
	&::-webkit-scrollbar {
		display: none;
	}

	scrollbar-width: none;
}
</style>
