<script setup lang="ts" name="CNM">
import { setConfig } from '@/api/editor'
import Input from '@/components/Input.vue'
import { ElMessage } from 'element-plus'
import { PreviewEditor } from 'shape-editor/preview'
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

let editor: PreviewEditor

const props = defineProps<{ modelValue: boolean; editorConfig: any }>()
defineEmits(['update:modelValue'])
const canvasRef = ref<HTMLCanvasElement>()
const width = ref<number>(800)
const height = ref<number>(400)
const direction = ref<'横版' | '竖版'>('横版')
const tab = ref<'预览' | 'JSON'>('预览')
const config = reactive<{
	stageSpacing: number
	currentShapeStyleName: string
	useSeparateStyleWhenSelected: boolean
}>({
	stageSpacing: 100,
	currentShapeStyleName: '',
	useSeparateStyleWhenSelected: true
})
const nowShapeEidtorConfig = ref<any>({})

const initEditor = () => {
	if (!canvasRef.value) return

	editor = new PreviewEditor({
		canvas: canvasRef.value,
		width: width.value,
		height: height.value
	})

	editor.moveCanvas = true

	editor.importShapeEditorConfig({
		editor: {
			...props.editorConfig.editor,
			stageSpacing: config.stageSpacing,
			unifyAllShapeStyle: !!config.currentShapeStyleName,
			currentShapeStyleName: config.currentShapeStyleName,
			useSeparateStyleWhenSelected: config.useSeparateStyleWhenSelected
		},
		shapes: props.editorConfig.shapes
	})
}
const switchDirection = (val: any) => {
	direction.value = val
	if (direction.value === '横版') {
		width.value = 800
		height.value = 400
	}
	if (direction.value === '竖版') {
		width.value = 375
		height.value = 812
	}
}
const switchShapeStyleName = (val: any) => {
	config.currentShapeStyleName = val
	editor.unifyAllShapeStyle = !!val
	editor.currentShapeStyleName = val
	editor.draw()
}
const switchTab = (val: any) => {
	if (val === 'JSON' && !Object.keys(nowShapeEidtorConfig.value).length) {
		nextTick(() => {
			nowShapeEidtorConfig.value = editor.exportShapeEditorConfig()
		})
	}
}
const uploadConfig = () => {
	setConfig(editor.exportShapeEditorConfig()).then(res => {
		ElMessage({
			type: 'success',
			message: '上传成功！'
		})
	})
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

watch(
	() => props.modelValue,
	() => {
		if (props.modelValue) {
			nextTick(() => {
				initEditor()
			})
		}
	}
)
watch(
	() => [width.value, height.value],
	() => {
		initEditor()
	}
)
watch(
	() => [config.stageSpacing, config.useSeparateStyleWhenSelected],
	() => {
		editor.stageSpacing = config.stageSpacing
		editor.useSeparateStyleWhenSelected = config.useSeparateStyleWhenSelected
		editor.resizeDraw()
	}
)
watch(config, () => {
	nowShapeEidtorConfig.value = editor.exportShapeEditorConfig()
})

onMounted(() => {
	initEditor()
})
</script>

<template>
	<ElDialog
		:model-value="modelValue"
		:width="width + 40"
		:append-to-body="true"
		title="预览画板配置"
		@update:model-value="$emit('update:modelValue', !modelValue)"
	>
		<div class="form">
			<div class="row">
				<ElSelect class="select item" :model-value="direction" @change="switchDirection">
					<ElOption value="横版" />
					<ElOption value="竖版" />
				</ElSelect>
				<Input type="number" class="item" :min="375" :max="800" v-model="width">
					<template #prefix>宽&nbsp;</template>
				</Input>
				<Input type="number" class="item" :min="100" :max="812" v-model="height">
					<template #prefix>高&nbsp;</template>
				</Input>
				<Input
					type="number"
					class="item big"
					:min="0"
					:max="1000"
					v-model="config.stageSpacing"
				>
					<template #prefix>间隔&nbsp;</template>
				</Input>
				<ElSwitch
					v-model="config.useSeparateStyleWhenSelected"
					inline-prompt
					style="--el-switch-off-color: #999"
					active-text="使用选中样式"
					inactive-text="不用选中样式"
				/>
				<ElSelect
					class="item select"
					placeholder="统一图形样式"
					:model-value="config.currentShapeStyleName"
					@change="switchShapeStyleName"
				>
					<ElOption value="" label="不统一图形样式" />
					<ElOption
						v-for="(item, name) in editorConfig.editor.shapeStyleMap"
						:key="name"
						:value="name"
					/>
				</ElSelect>
			</div>
		</div>
		<div class="options">
			<ElRadioGroup v-model="tab" @change="switchTab">
				<ElRadioButton label="预览" />
				<ElRadioButton label="JSON" />
			</ElRadioGroup>
			<div class="btns">
				<ElButton @click="uploadConfig">
					<i class="iconfont icon-baocun" />
					<span>&nbsp;上传配置</span>
				</ElButton>
			</div>
		</div>
		<div class="preview_box scroll" :style="{ width: width + 'px', height: height + 'px' }">
			<canvas
				v-show="tab === '预览'"
				ref="canvasRef"
				:tabindex="1"
				:width="width"
				:height="height"
				class="canvas"
				@mousedown="onMouseDown"
				@mousemove="onMouseMove"
				@mouseup="onMouseUp"
				@wheel.stop="onMouseWheel"
				@touchstart="onTouchStart"
				@touchmove="onTouchMove"
				@touchend="onTouchEnd"
			/>
			<JsonViewer
				v-show="tab === 'JSON'"
				:value="nowShapeEidtorConfig"
				copyable
				boxed
				sort
				theme="dark"
			/>
		</div>
	</ElDialog>
</template>

<style lang="scss" scoped>
.form {
	.row {
		margin-bottom: 16px;
		@include flex_sb_center();
		@include el_input_number_no_right_icon();
		flex-wrap: wrap;
		gap: 10px;

		.item {
			flex: 1;
		}
		.select {
			flex: 1.6;
			min-width: 110px;
		}
		.big {
			flex: 1.2;
		}
	}
}
.options {
	@include flex_sb_center();
	flex-wrap: wrap;
	margin-bottom: 20px;

	.btns {
		@include flex_sb_center();
	}
}
.canvas {
	.preview_canvas {
		width: 100%;
		background-color: #f2f2f2;
	}
}

.json_box {
	overflow-y: auto;
}

.preview_box {
	overflow-y: auto;

	.canvas {
		display: block;
		width: 100%;
		background-color: #f2f2f2;
	}
}
</style>
