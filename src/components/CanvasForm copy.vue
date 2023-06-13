<script setup lang="ts">
import Input from './Input.vue'

const props = defineProps<{
	keyStr: string
	name?: string
	modelValue: string | number
}>()
defineEmits(['update:modelValue'])
const nameMap: { [key: string]: string } = {
	lineCap: '结束端点',
	lineWidth: '描边粗细',
	fillStyle: '填充颜色',
	strokeStyle: '描边颜色',
	font: '字体',
	fontSize: '字体大小',
	fontColor: '字体颜色',
	textAlign: '字体对齐',
	textBaseLine: '字体基线'
}
console.log(props)
const getName = computed(() => nameMap[props.keyStr])
</script>

<template>
	<div class="row">
		<span class="name">{{ getName }}</span>
		<Input type="number" v-model="modelValue" />
	</div>
</template>

<style lang="scss" scoped>
.row {
	@include flex_sb_center();
	font-size: 14px;

	.name {
	}
}
</style>
