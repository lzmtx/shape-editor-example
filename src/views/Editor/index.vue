<script setup lang="ts">
import { ShapeEditor } from 'shape-editor/editor'
import Main from './components/Main.vue'
import TopBar from './components/TopBar.vue'
import LeftSide from './components/LeftSide.vue'
import RightSide from './components/RightSide.vue'
import { useMainStore } from '@/store/main'

let editor = shallowRef<ShapeEditor | null>(null)
function updateEditorInstance(instance: ShapeEditor) {
	editor.value = instance
}
provide('shapeEditor', { editor: editor, updateEditorInstance })

const mainStore = useMainStore()

// 加载网络字体
const fonts = ['快看世界体', '得意黑', 'Koulen', 'DIN']
fonts.forEach(name => {
	const font = new FontFace(name, `url(${mainStore.filePath}/fonts/${name}.ttf)`)
	font.load().then(res => {
		let _fonts = document.fonts as any
		_fonts.add(res)
	})
})
</script>

<template>
	<section class="page">
		<Main class="main" />
		<template v-if="editor">
			<TopBar class="top" />
			<LeftSide class="left" />
			<RightSide class="right" />
		</template>
	</section>
</template>

<style lang="scss" scoped>
body {
	overflow: hidden;
}
$top_height: 60px;

.page {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	color: #333;
	user-select: none;
	box-sizing: border-box;

	> .main {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	> .top,
	> .left,
	> .right {
		position: absolute;
		z-index: 1;
		box-sizing: border-box;
	}
	> .top {
		top: 0;
		left: 0;
		width: 100%;
		height: $top_height;
		background-color: rgba(255, 255, 255, 1);
	}
	> .left,
	> .right {
		height: calc(100% - $top_height);
		background-color: rgba(255, 255, 255, 1);
	}
	> .left {
		top: $top_height;
		left: 0;
	}
	> .right {
		top: $top_height;
		right: 0;
	}
	.top {
		z-index: 2;
	}
}
</style>
