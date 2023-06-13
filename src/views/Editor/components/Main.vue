<script setup lang="ts">
// import { ShapeEditor, Shapes, ShapeKeyType, ShapeConfig } from '../../../../../../src/index'
import { ShapeEditor, ShapeKeyType, ShapeConfig } from 'shape-editor/editor'
import { useWindowResize } from '@/hooks/useWindowResize'
import { useEditorStore } from '@/store/editor'
import { editorType } from '@/typings'

interface shapeListType {
	shapeType: ShapeKeyType
	config: ShapeConfig
}

let editor: ShapeEditor
let needUpdate = false

const { width, height } = useWindowResize(resizeCallback)
const canvasRef = ref<HTMLCanvasElement>()
const editorStore = useEditorStore()
const { updateEditorInstance } = inject('shapeEditor') as editorType

const initEditor = () => {
	if (!canvasRef.value) return

	editor = new ShapeEditor({
		canvas: canvasRef.value,
		width: width.value,
		height: height.value
	})
	updateEditorInstance(editor)
}
const initShapes = () => {
	let list: shapeListType[] = [
		{
			shapeType: 'Img',
			config: {
				x: 0,
				y: 0,
				lock: true,
				src: 'http://files.varmm.com/imgs/car-map2.png',
				inStage: true,
				zIndex: 0
			}
		},
		{
			shapeType: 'Font',
			config: {
				x: 0,
				y: 0,
				width: 100,
				height: 50,
				name: '111'
			}
		},
		{
			shapeType: 'Rect',
			config: {
				x: 320,
				y: 320,
				width: 100,
				height: 100,
				angle: 45,
				fillStyle: '#ccc',
				name: '33'
			}
		},
		{
			shapeType: 'Rect',
			config: {
				x: 500,
				y: 300,
				width: 100,
				height: 100,
				angle: 0,
				name: '2950',
				fillStyle: '#eee'
			}
		},
		{
			shapeType: 'Circle',
			config: {
				x: 320,
				y: 320,
				name: '圆形',
				radius: 50,
				fillStyle: '#eeeeeef0',
				fontColor: '#fff000',
				useShapeStyle: false,
				currentShapeStyleName: 'red'
			}
		}
	]

	function createRow(y: number) {
		let list: shapeListType[] = []

		for (let i = 0; i < 10; i++) {
			list.push({
				shapeType: 'Rect',
				config: {
					x: i * 150,
					y: y + 150,
					width: 100,
					height: 100,
					angle: 0
				}
			})
		}
		return list
	}

	// for (let i = 0; i < 20; i++) {
	// 	list = [...list, ...createRow(150 * i)]
	// }

	// for (let item of list) {
	// 	if (item.shapeType === 'Img') {
	// 		if (item.config.src) {
	// 			const img = new Image()
	// 			img.src = item.config.src
	// 			img.onload = () => {
	// 				editor?.pushShape(new Shapes.Img({ ...item.config, image: img }))
	// 				editor?.draw()
	// 			}
	// 		}
	// 	} else {
	// 		editor?.pushShape(new Shapes[item.shapeType as ShapeKeyType](item.config as any))
	// 	}
	// }
	editor.createShapeInstanceBatch(list)
}
function updateEditorStore() {
	if (!needUpdate) return

	editorStore.$patch({
		scale: Math.round(editor?.scale * 100),
		offset: editor?.offset
	})
}
function drawEditor() {
	editor?.draw()
}
function readEditorInfo() {
	console.log('当前编辑器：', editor)
}
function readLocalStoreSaveToEidtor() {
	let local = localStorage.getItem('editorStore')
	if (local) {
		// editor.scale = editorStore.scale
		// editor.offset = editorStore.offset
	}
	// console.log('读取：', { ...editorStore }, local)
	/**
	 * 本地有相关的记录，就
	 */
	// if(editorStore)
	// editor.scale = editorStore.scale  / 100
	// editor.offset = editorStore.offset
}

function resizeCallback() {
	if (!editor) return

	editor.width = width.value
	editor.height = height.value
	editor.resizeDraw()
}
const onMouseDown = (e: MouseEvent) => {
	editor?.mousedown(e)
}
const onMouseMove = (e: MouseEvent) => {
	editor?.mousemove(e)
	updateEditorStore()
}
const onMouseEnter = () => {
	if (!canvasRef.value?.contains(document.activeElement)) {
		canvasRef.value?.focus()
	}
}
const onMouseLeave = () => {
	canvasRef.value?.blur()
}
const onMouseUp = (e: MouseEvent) => {
	editor?.mouseup()
}
const onMouseWheel = (e: WheelEvent) => {
	editor?.mouseWheelScale(e)
	updateEditorStore()
}
const onTouchStart = (e: TouchEvent) => {
	// 防止模拟的touch事件触发到mouse事件上
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
const onKeyDown = (e: KeyboardEvent) => {
	if (e.key === ' ' && !editor.moveCanvas) {
		editor.moveCanvas = true
		editor.setMoveCursor()
	}
	if (e.key === 'Shift' && editor.selectType !== 'many') {
		editor.selectType = 'many'
	}
	if (e.key === 'Delete') {
		editor.delSelectShapes()
	}
}
const onKeyUp = (e: KeyboardEvent) => {
	if (e.key === ' ') {
		editor.moveCanvas = false
		editor.restoreCursor()
	}
	if (e.key === 'Shift') {
		editor.selectType = 'single'
	}
}

watch(
	() => editorStore.scale,
	() => {
		if (editorStore.scale === -1) {
			editor?.scaleToActualSize()
			return
		}
		editor?.scaleCenter(editorStore.scale / 100)
	}
)

onMounted(() => {
	/**
	 * 初始化编辑器之后，就将编辑器中的属性值拿出来，更新到vue中
	 */

	setTimeout(() => {
		initEditor()
		// readLocalStoreSaveToEidtor()
		// readEditorInfo()
		initShapes()
		drawEditor()
	}, 0)

	/**
	 * 将editor中需要更新的数据，放入pinia中
	 * 便于vue去更新
	 *
	 * 当前页面中监听对应的 pinia 变化，从而触发 editor 内部的对应更新方法
	 *
	 * 能被抽离的：
	 * 缩放、偏移、选中图形后设置的表单项
	 * 监听以上更新，就触发editor更新
	 *
	 * 新增、删除、更新图形
	 *
	 */
})
onBeforeMount(() => {
	readLocalStoreSaveToEidtor()
})
</script>

<template>
	<div class="editor_main">
		<canvas
			ref="canvasRef"
			:tabindex="0"
			:width="width"
			:height="height"
			@mousedown="onMouseDown"
			@mousemove="onMouseMove"
			@mouseenter="onMouseEnter"
			@mouseleave="onMouseLeave"
			@mouseup="onMouseUp"
			@wheel="onMouseWheel"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			@keydown.stop="onKeyDown"
			@keyup.stop="onKeyUp"
		/>
	</div>
</template>

<style lang="scss" scoped>
.editor_main {
	background-color: #e5e5e5;
}
</style>
