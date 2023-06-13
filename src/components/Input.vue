<script setup lang="ts">
const props = defineProps<{
	type: 'text' | 'number'
	modelValue?: string | number
	min?: number
	max?: number
}>()
const emits = defineEmits(['update:modelValue'])
const isFocus = ref<boolean>(false)

const checkValue = (value: string | number) => {
	if (props.type !== 'number') return true
	if (typeof props.min === 'number' && Number(value) < props.min) {
		return false
	}
	if (typeof props.max === 'number' && Number(value) > props.max) {
		return false
	}
	return true
}
const inputChange = (e: Event) => {
	let input = e.target as HTMLInputElement
	let value = props.type === 'number' ? Number(input.value) : input.value
	if (checkValue(value)) {
		emits('update:modelValue', value)
	}
}
</script>

<template>
	<div class="input" :class="{ focus: isFocus }">
		<div class="prefix" v-if="$slots['prefix']">
			<slot name="prefix" />
		</div>
		<input
			:type="type"
			:value="modelValue"
			@change="inputChange"
			@focus="isFocus = true"
			@blur="isFocus = false"
		/>
	</div>
</template>

<style lang="scss" scoped>
.input {
	--line-color: #dcdfe6;
	padding: 1px 10px;
	border-radius: 4px;
	box-shadow: 0 0 0 1px var(--line-color) inset;
	@include flex_sb_center();

	&.focus {
		--line-color: var(--ac_color);
	}

	.prefix {
		color: #a8abb2;
		font-size: 14px;
		pointer-events: none;
		white-space: nowrap;
		user-select: none;
	}

	input {
		width: 100%;
		height: 30px;
		padding: 4px;
		box-sizing: border-box;
		display: block;
		border: none;
		outline: none;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}
}
</style>
