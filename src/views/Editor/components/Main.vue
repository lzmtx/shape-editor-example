<script setup lang="ts">
import { ShapeEditor } from 'shape-editor/editor'
import type { ShapeKeyType, ShapeConfig, copyConfig, ShapeEditorConfig } from 'shape-editor/editor'
import { useWindowResize } from '@/hooks/useWindowResize'
import { useEditorStore } from '@/store/editor'
import { editorType } from '@/typings'
import Input from '@/components/Input.vue'
import { ElButton, ElOption, ElSelect } from 'element-plus'
import { getConfig } from '@/api/editor'

interface shapeListType {
	shapeType: ShapeKeyType
	config: ShapeConfig
}

let editor: ShapeEditor
let needUpdate = false

const { width, height } = useWindowResize(resizeCallback)
const canvasRef = ref<HTMLCanvasElement>()
const editorStore = useEditorStore()
const mousex = ref<number>(0)
const mousey = ref<number>(0)
const showRightMenus = ref<boolean>(false)
const showRightSubMenu = ref<boolean>(false)
const selectedShapeLength = ref<number>(0)
const selectedShapeNum = ref<number>(0)
const rightMenuStyle = computed(() => {
	if (showRightMenus.value) {
		return { transform: `translate(${mousex.value}px, ${mousey.value}px)` }
	}
	return { display: 'none' }
})
const copy = reactive<copyConfig>({
	axle: 'x',
	spacing: 0,
	count: 2,
	num: 0,
	range: false
})

const { updateEditorInstance } = inject('shapeEditor') as editorType

const initEditor = () => {
	if (!canvasRef.value) return

	editor = new ShapeEditor({
		canvas: canvasRef.value,
		width: width.value,
		height: height.value
	})
	editor.draw()
	reqShapeEditorConfig()
}
const reqShapeEditorConfig = () => {
	getConfig().then(res => {
		const img = res.shapes.find(shape => shape.shapeType === 'Img' && shape.config.inStage)
		if (img) {
			let config = img.config as any
			console.log(config, config.src)
			editorStore.setCanvasImgSrc(config.src || '')
		}

		editor.importShapeEditorConfig(res)
		updateEditorInstance(editor)

		editor.watch('selectShapeInfo', () => {
			if (!editor.selectShapeListLength) {
				showRightMenus.value = false
			}
			selectedShapeLength.value = editor.selectShapeListLength
			selectedShapeNum.value = Number(editor.selectShapeList[0]?.name) || 0
		})
		editor.watch('moveCanvas', () => {
			if (editor.moveCanvas) showRightMenus.value = false
		})
		editor.watch('scale', () => {
			showRightMenus.value = false
		})
	})
}
function updateEditorStore() {
	if (!needUpdate) return

	editorStore.$patch({
		scale: Math.round(editor?.scale * 100),
		offset: editor?.offset
	})
}

function resizeCallback() {
	if (!editor) return

	editor.width = width.value
	editor.height = height.value
	editor.resizeDraw()
}
const onMouseDown = (e: MouseEvent) => {
	editor?.mousedown(e)
	if (
		e.buttons === 2 &&
		editor.operationType === 'selectShape' &&
		editor.selectShapeListLength &&
		!editor.moveCanvas
	) {
		nextTick(() => {
			if (editor.selectShapeListLength) {
				mousex.value = e.clientX
				mousey.value = e.clientY
			}
		})
		showRightMenus.value = true
	} else {
		showRightMenus.value = false
		showRightSubMenu.value = false
	}
}
const onMouseMove = (e: MouseEvent) => {
	if (e.buttons === 2) return
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
	if (showRightMenus.value) return
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
const onContextmenu = (e: MouseEvent) => {
	e.preventDefault()
}
const changeCopyNum = (value: any) => {
	copy.num = value
}
const setCopyAxle = (axle: copyConfig['axle']) => {
	copy.axle = axle
	editor.copyShapeBatch(copy)
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
	initEditor()
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
			@contextmenu="onContextmenu"
		/>
		<div class="right_menus menus" :style="rightMenuStyle">
			<div class="menu" @click="editor.copyShape()">复制</div>
			<div
				class="menu"
				v-if="selectedShapeLength === 1"
				@click="showRightSubMenu = !showRightSubMenu"
			>
				<span>批量复制</span>
				<i class="iconfont icon-fanhui2" />
				<div class="sub menus" :class="{ show: showRightSubMenu }" @click.stop="() => {}">
					<div class="row">
						<ElSelect v-model="copy.range">
							<ElOption :value="true" label="递增填充" />
							<ElOption :value="false" label="普通复制" />
						</ElSelect>
					</div>
					<template v-if="copy.range">
						<div class="row">
							<Input type="number" :model-value="selectedShapeNum">
								<template #prefix>起始编号&nbsp;</template>
							</Input>
						</div>
						<div class="row">
							<Input
								type="number"
								:model-value="copy.num"
								@update:model-value="changeCopyNum"
							>
								<template #prefix>结束编号&nbsp;</template>
							</Input>
						</div>
					</template>
					<div class="row" v-else>
						<Input type="number" :min="1" v-model="copy.count">
							<template #prefix>复制数量&nbsp;</template>
						</Input>
					</div>
					<div class="row">
						<Input type="number" v-model="copy.spacing">
							<template #prefix>间距&nbsp;</template>
						</Input>
					</div>
					<div class="row btns">
						<div class="btn" @click="setCopyAxle('x')">横向复制</div>
						<div class="btn" @click="setCopyAxle('y')">纵向复制</div>
					</div>
				</div>
			</div>
			<div class="menu">上移一层</div>
			<div class="menu">上移一层</div>
			<div class="menu">移至顶层</div>
			<div class="menu">移至底层</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.editor_main {
	background-color: #e5e5e5;
	position: relative;

	.menus {
		width: 120px;
		background-color: #fff;
		box-shadow: 0 0 4px #00000027;
		border-radius: 6px;
		padding: 2px;
		.menu {
			height: 40px;
			padding: 0 10px;
			border-radius: 6px;
			box-sizing: border-box;
			@include flex_sb_center();
			cursor: pointer;
			pointer-events: auto;
			font-size: 14px;
			position: relative;

			&:hover {
				background-color: #eee;
			}

			.sub {
				display: none;
				position: absolute;
				top: -2px;
				left: calc(100% + 6px);

				&.show {
					display: block;
				}
			}
		}
	}
	.right_menus {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;

		.sub {
			width: 200px;

			.row {
				padding: 4px 10px;
				cursor: auto;
				@include flex_sb_center();

				.label {
					flex-shrink: 0;
					width: 80px;
				}
			}

			.btns {
				padding: 0;
				margin-top: 8px;
				border-top: 1px solid #eee;
				.btn {
					flex: 1;
					cursor: pointer;
					text-align: center;
					line-height: 36px;
					border-radius: 6px;

					&:hover {
						background-color: #eee;
					}
				}
			}
		}
	}
}
</style>
