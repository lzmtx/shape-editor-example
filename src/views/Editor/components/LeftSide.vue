<script setup lang="ts">
import { editorType } from '@/typings'
// import { operationTypeProps } from '../../../../../../src/editor/BaseEditor'
// import { ShapeKeyType } from '../../../../../../src'
import type { operationTypeProps, ShapeKeyType } from 'shape-editor/editor'
import Upload from '@/components/Upload.vue'
import { ElMessage } from 'element-plus'

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
	if (typeName === 'customShape') {
		ElMessage({
			type: 'info',
			message: '此功能暂未开放！'
		})
		return
	}
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
		<!-- <div>移动选择工具</div>
		包含单击，按住后滑动以便多选
		<div>标尺工具</div>
		鼠标位置固定，再滑动实时渲染直线，在旁边显示出实际字体大小的像素长度
		<div>自定义多边形</div>
		跟随鼠标按下的坐标点，绘制路径，可填充、可描边
		<div>自由线段</div>
		自由线段， 不填充，只描边
		<div>矩形</div>  
		<div>圆形</div>
		<div>三角形</div>
		<div>箭头</div> -->
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
