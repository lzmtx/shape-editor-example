<script setup lang="ts">
import { getConfig } from '@/api/editor'
import { useWindowResize } from '@/hooks/useWindowResize'
import { useMainStore } from '@/store/main'
import { ElButton, ElDialog } from 'element-plus'
import { PreviewEditor } from 'shape-editor/preview'

let editor: PreviewEditor

let shapeNames: { [name: string]: number } = {}
let shapeIndexs: number[] = []
let mocking: boolean = false
let mockingTimer: number = 0

type stateIndex = { [name: string]: { index: number; state: string } }

const { width, height } = useWindowResize(resizeCallback)
const canvasRef = ref<HTMLCanvasElement>()
const showDialog = ref<boolean>(false)
const selectedShapeNum = ref<number>(0)
const selectedShapeState = ref<string>('')
const shapesNameState = ref<stateIndex>({})
const mainStore = useMainStore()

function resizeCallback() {
	if (!editor) return

	editor.width = width.value
	editor.height = height.value
	editor.resizeDraw()
}

const updateEditorBoundingRect = () => {
	if (!canvasRef.value) return
	const { top, left } = canvasRef.value.getBoundingClientRect()
	editor.boundingClinetRect = { top, left }
}
const onMouseDown = (e: MouseEvent) => {
	updateEditorBoundingRect()
	editor?.mousedown(e)
}
const onMouseMove = (e: MouseEvent) => {
	editor?.mousemove(e)
}
const onMouseUp = (e: MouseEvent) => {
	editor?.mouseup()
}
const onMouseWheel = (e: WheelEvent) => {
	updateEditorBoundingRect()
	e.stopPropagation()
	e.preventDefault()
	editor?.mouseWheelScale(e)
}
const onContextmenu = (e: MouseEvent) => {
	e.preventDefault()
}
const onTouchStart = (e: TouchEvent) => {
	updateEditorBoundingRect()
	e.preventDefault()
	e.stopPropagation()
	editor?.touchstart(e)
}
const onTouchMove = (e: TouchEvent) => {
	e.preventDefault()
	e.stopPropagation()
	editor?.touchmove(e)
}
const onTouchEnd = (e: TouchEvent) => {
	e.preventDefault()
	editor?.touchend()
}
const initEditor = () => {
	if (canvasRef.value) {
		editor = new PreviewEditor({
			width: width.value,
			height: height.value - 50,
			canvas: canvasRef.value
		})
		editor.moveCanvas = true

		reqShapeEditorConfig()
	}
}
const reqShapeEditorConfig = () => {
	getConfig().then(res => {
		res.editor.stageSpacing = 20
		editor.importShapeEditorConfig(res)

		// 提取所有图形对应的下标
		shapeNames = editor.findAllHasNameShape()

		let states: stateIndex = {}
		Object.keys(shapeNames).forEach(name => {
			let index = shapeNames[name]
			states[name] = {
				index,
				state: ''
			}
			shapeIndexs.push(index)
		})
		shapesNameState.value = states

		editor.watch('selectShapeInfo', () => {
			showDialog.value = !!editor.selectShapeListLength
			let shape = editor.selectShapeList[0]
			selectedShapeNum.value = Number(shape?.name)
			selectedShapeState.value = shape?.currentShapeStyleName
		})
	})
}
const reset = () => {
	mocking = false
	clearTimeout(mockingTimer)
	let states: stateIndex = {}
	Object.keys(shapeNames).forEach(name => {
		let index = shapeNames[name]
		states[name] = {
			index,
			state: ''
		}
		shapeIndexs.push(index)
		editor.shapeList[shapeNames[name]].currentShapeStyleName = ''
	})
	shapesNameState.value = states
	editor.draw()
}
const mock = () => {
	mocking = true
	batchUpdate()
}
const batchUpdate = () => {
	if (!mocking) return
	if (!shapeIndexs.length) return
	mockingTimer = setTimeout(() => {
		randomShape()
		batchUpdate()
	}, Math.round(Math.random() * 100))
}
const randomShape = () => {
	let random = Math.floor((Math.random() * shapeIndexs.length) % shapeIndexs.length)
	let shapeIndex = shapeIndexs.splice(random, 1)[0]
	let shape = editor.shapeList[shapeIndex]
	shape.currentShapeStyleName = 'red'
	shapesNameState.value[shape.name].state = 'red'
	shape.draw(editor.context, editor.getShapeDrawStyle(shape))
}
// 加载网络字体
const fonts = ['快看世界体', '得意黑', 'Koulen', 'DIN']
fonts.forEach(name => {
	const font = new FontFace(name, `url(${mainStore.filePath}/fonts/${name}.ttf)`)
	font.load().then(res => {
		let _fonts = document.fonts as any
		_fonts.add(res)
	})
})

onMounted(() => {
	initEditor()
})
</script>

<template>
	<section class="page">
		<div class="top">
			<ElButton @click="reset">复位</ElButton>
			<ElButton @click="mock">模拟状态更新</ElButton>
			<ElButton @click="editor.resizeDraw()">缩放画布至屏幕内</ElButton>
		</div>
		<canvas
			ref="canvasRef"
			id="preview_editor"
			:tabindex="0"
			:width="width"
			:height="height - 50"
			@mousedown="onMouseDown"
			@mousemove="onMouseMove"
			@mouseup="onMouseUp"
			@wheel.stop="onMouseWheel"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			@contextmenu="onContextmenu"
		/>
		<ElDialog v-model="showDialog">
			<div class="dialog">
				<p>选中图形：{{ selectedShapeNum }}</p>
				<p v-if="selectedShapeNum">
					图形状态：{{ shapesNameState[selectedShapeNum].state }}
				</p>
			</div>
		</ElDialog>
	</section>
</template>

<style lang="scss" scoped>
.page {
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	overflow: hidden;
	@include flex_sb_center();
	flex-direction: column;

	.top {
		width: 100%;
		height: 50px;
		padding: 0 10px;
		box-sizing: border-box;
		@include flex_end_center();
		flex-shrink: 0;
	}

	#preview_editor {
		flex: 1;
		width: 100%;
		background-color: #eee;
	}
}
</style>
