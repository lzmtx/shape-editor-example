<script setup lang="ts">
import { shapeStyleAll } from '../../../../src/Shape'
import Input from './Input.vue'

defineProps<{ item: shapeStyleAll }>()
const emits = defineEmits(['update:item'])

const lineStyle = ref<'实线' | '虚线'>('实线')
const fonts = ref<string[]>(['默认', '快看世界体', '得意黑', 'Koulen', 'DIN'])

const changeLineStyle = () => {
	emits('update:item', {
		key: 'lineDash',
		val: lineStyle.value === '实线' ? '' : '10'
	})
}
</script>

<template>
	<div class="row">
		<span class="label">填充颜色</span>
		<el-color-picker
			class="right"
			show-alpha
			:model-value="item.fillStyle"
			@change="val => $emit('update:item', { key: 'fillStyle', val: val || '#ffffff00' })"
		/>
	</div>
	<div class="row">
		<span class="label">描边颜色</span>
		<el-color-picker
			class="right"
			show-alpha
			:model-value="item.strokeStyle"
			@change="val => $emit('update:item', { key: 'strokeStyle', val: val || '#ffffff00' })"
		/>
	</div>
	<div class="row">
		<span class="label">描边样式</span>
		<ElSelect class="select" v-model="lineStyle" @change="changeLineStyle">
			<ElOption value="实线" />
			<ElOption value="虚线" />
		</ElSelect>
	</div>
	<div class="row" v-if="item.lineDash !== ''">
		<span class="label">虚线配置</span>
		<Input
			class="right"
			type="text"
			:modelValue="item.lineDash"
			@update:modelValue="val => $emit('update:item', { key: 'lineDash', val })"
		/>
	</div>
	<div class="row">
		<span class="label">描边粗细</span>
		<Input
			class="right"
			type="number"
			:modelValue="item.lineWidth"
			@update:modelValue="val => $emit('update:item', { key: 'lineWidth', val })"
		/>
	</div>
	<div class="row">
		<span class="label">描边末端</span>
		<ElSelect
			class="select"
			:model-value="item.lineCap"
			@change="val => $emit('update:item', { key: 'lineCap', val })"
		>
			<ElOption value="butt" label="默认" />
			<ElOption value="round" label="圆形" />
			<ElOption value="square" label="方形" />
		</ElSelect>
	</div>
	<div class="row">
		<span class="label">描边顶点</span>
		<ElSelect
			class="select"
			:model-value="item.lineJoin"
			@change="val => $emit('update:item', { key: 'lineJoin', val })"
		>
			<ElOption value="bevel" label="直角" />
			<ElOption value="round" label="圆角" />
			<ElOption value="miter" label="斜角" />
		</ElSelect>
	</div>
	<div class="row">
		<span class="label">字体</span>
		<ElSelect
			class="select"
			:style="{ '--f': item.font }"
			:model-value="item.font"
			@change="val => $emit('update:item', { key: 'font', val })"
		>
			<ElOption v-for="(name, i) in fonts" :key="i" :value="name">
				<div class="font_item" :style="{ '--f': name }">{{ name }}</div>
			</ElOption>
		</ElSelect>
	</div>
	<div class="row">
		<span class="label">字体颜色</span>
		<el-color-picker
			class="right"
			show-alpha
			:model-value="item.fontColor"
			@change="val => $emit('update:item', { key: 'fontColor', val: val || '#ffffff00' })"
		/>
	</div>
	<div class="row">
		<span class="label">字体大小</span>
		<Input
			class="right"
			type="number"
			:modelValue="item.fontSize"
			@update:modelValue="val => $emit('update:item', { key: 'fontSize', val })"
		/>
	</div>
	<div class="row">
		<span class="label">字体对齐</span>
		<ElSelect
			class="select"
			:model-value="item.textAlign"
			@change="val => $emit('update:item', { key: 'textAlign', val })"
		>
			<ElOption
				v-for="(name, i) in ['center', 'end', 'left', 'right', 'start']"
				:key="i"
				:value="name"
			>
				<div class="font_item">{{ name }}</div>
			</ElOption>
		</ElSelect>
	</div>
	<div class="row" v-if="false">
		<span class="label">字体基线</span>
		<ElSelect
			class="select"
			:model-value="item.textBaseLine"
			@change="val => $emit('update:item', { key: 'textBaseLine', val })"
		>
			<ElOption
				v-for="(name, i) in [
					'alphabetic',
					'bottom',
					'hanging',
					'ideographic',
					'middle',
					'top'
				]"
				:key="i"
				:value="name"
			>
				<div class="font_item">{{ name }}</div>
			</ElOption>
		</ElSelect>
	</div>
</template>

<style lang="scss" scoped>
.row {
	@include flex_sb_center();
	// @include el_input_number_no_right_icon();
	font-size: 14px;
	padding: 6px 10px;

	.label {
		flex-shrink: 0;
		width: 80px;
	}

	// & > :deep(.el-input) {
	// 	input[type='number']::-webkit-inner-spin-button,
	// 	input[type='number']::-webkit-outer-spin-button {
	// 		-webkit-appearance: none;
	// 		margin: 0;
	// 	}

	// 	input[type='number'] {
	// 		-moz-appearance: textfield;
	// 	}
	// }

	> .select {
		flex: 1;

		&:deep(.el-input__inner) {
			font-family: var(--f), sans-serif;
		}

		.item {
			padding: 10px;
			cursor: pointer;

			&:hover {
				background-color: #f5f7fa;
			}
		}
	}

	> .right {
		flex: 1;
	}
}
.font_item {
	font-family: var(--f), sans-serif;
}
</style>
