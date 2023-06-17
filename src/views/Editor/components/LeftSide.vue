<script setup lang="ts">
import { editorType } from '@/typings'
import type { operationTypeProps, ShapeKeyType } from 'shape-editor/dist/editor'
import Upload from '@/components/Upload.vue'

const { editor: _editor } = inject('shapeEditor') as editorType
const editor = _editor.value
const operationType = ref<operationTypeProps>()
const addShapeType = ref<ShapeKeyType | null>()

editor.watch('operationType', () => {
	operationType.value = editor.operationType
})
const ac = (typeName: operationTypeProps) => {
	return operationType.value === typeName
}
const add_ac = (type: ShapeKeyType) => {
	return addShapeType.value === type
}
const switchType = (typeName: operationTypeProps) => {
	editor.operationType = typeName
	editor.addShapeType = null
	addShapeType.value = null
}
const addShape = (type: ShapeKeyType) => {
	editor.operationType = 'addShape'
	editor.addShapeType = type
}
const addImgShape = (val: string) => {
	addShape('Img')
	editor.waitAddImgSrc = val
}
</script>

<template>
	<section class="left_side scroll">
		<ElTooltip content="移动选择" placement="right">
			<div class="btn" :class="{ ac: ac('selectShape') }" @click="switchType('selectShape')">
				<i class="iconfont icon-xuanze" />
			</div>
		</ElTooltip>
		<ElTooltip content="标尺" placement="right" v-if="false">
			<div class="btn" @click="">
				<i class="iconfont icon-duliang" />
			</div>
		</ElTooltip>
		<ElTooltip content="文字" placement="right">
			<div class="btn" :class="{ ac: add_ac('Font') }" @click="addShape('Font')">
				<i class="iconfont icon-wenzi" />
			</div>
		</ElTooltip>
		<ElTooltip content="图片" placement="right">
			<Upload @update:img="addImgShape">
				<div class="btn">
					<i class="iconfont icon-tupian" />
				</div>
			</Upload>
		</ElTooltip>
		<ElTooltip content="矩形" placement="right">
			<div class="btn" :class="{ ac: add_ac('Rect') }" @click="addShape('Rect')">
				<i class="iconfont icon-juxing" />
			</div>
		</ElTooltip>
		<ElTooltip content="圆形" placement="right">
			<div class="btn" :class="{ ac: add_ac('Circle') }" @click="addShape('Circle')">
				<i class="iconfont icon-yuanxing" />
			</div>
		</ElTooltip>
		<ElTooltip content="自由形状" placement="right">
			<div class="btn" :class="{ ac: ac('customShape') }" @click="switchType('customShape')">
				<i class="iconfont icon-path" />
			</div>
		</ElTooltip>
	</section>
</template>

<style lang="scss" scoped>
.left_side {
	padding: 10px 0;

	.btn {
		@include flex_center_center();
		text-align: center;
		width: 40px;
		height: 40px;
		cursor: pointer;

		> i {
			font-size: 18px;
		}

		&.ac {
			color: var(--ac_color);
		}
	}
}
</style>
