<script setup lang="ts">
import { editorType } from '@/typings'
const { editor: _editor } = inject('shapeEditor') as editorType
const editor = _editor.value
const scale = ref<number>(0)
const move = ref<boolean>(false)

editor.watch('scale', (value: any) => {
	scale.value = Math.round(value * 100)
})
editor.watch('moveCanvas', () => {
	// move.value = editor.operationType === 'moveCanvas'
	move.value = editor.moveCanvas
})

const switchMove = () => {
	// if (move.value) {
	// 	editor.resetOperationType()
	// } else {
	// 	editor.operationType = 'moveCanvas'
	// }

	editor.moveCanvas = !move.value
}
const setScale = (value: any) => {
	if (value < 0 && scale.value < -value) return
	editor.scaleCenter((scale.value + value) / 100)
}
</script>

<template>
	<div class="bottom_bar">
		<ElTooltip placement="top" content="移动画布" :show-after="400">
			<Icon icon="icon-hand" :active="move" @icon-click="switchMove" />
		</ElTooltip>
		<ElTooltip placement="top" content="缩放画布至实际像素" :show-after="400">
			<Icon icon="icon-suofang" @icon-click="() => editor.scaleToActualSize()" />
		</ElTooltip>
		<ElTooltip placement="top" content="缩放画布至屏幕中间" :show-after="400">
			<Icon icon="icon-scale" @icon-click="() => editor.resizeDraw()" />
		</ElTooltip>
		<ElTooltip placement="top" content="缩小（步进10" :show-after="400">
			<Icon icon="icon-jian" @icon-click="setScale(-10)" />
		</ElTooltip>
		<span class="ratio">{{ scale }}%</span>
		<ElTooltip placement="top" content="放大（步进10" :show-after="400">
			<Icon icon="icon-jia" @icon-click="setScale(10)" />
		</ElTooltip>
	</div>
</template>

<style lang="scss" scoped>
.bottom_bar {
	@include flex_sb_center();
	background-color: #fff;
	border-radius: 8px;
	padding: 8px;
	gap: 8px;
	white-space: nowrap;
	box-shadow: 0 0 2px 0px rgba(106, 106, 106, 0.5);
	.ratio {
		width: 70px;
		text-align: center;
	}
}
</style>
