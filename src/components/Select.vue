<script setup lang="ts">
/**
 * 当前选中：插槽
 * 选择列表：插槽
 */
const props = defineProps<{
	modelValue: string | number
}>()
const isEmpty = computed(() => {
	return props.modelValue === null || props.modelValue === undefined
})
const open = ref<boolean>(false)

const switchOpen = () => {
	open.value = !open.value

	if (open.value) {
		window.addEventListener('click', closeSelect)
	} else {
		window.removeEventListener('click', closeSelect)
	}
}
function closeSelect() {
	open.value = false
}
</script>

<template>
	<div class="select">
		<div class="selected" @click.stop="switchOpen">
			<div class="value" :class="{ no_value: isEmpty }">
				<slot name="value">
					{{ modelValue ?? '请选择' }}
				</slot>
			</div>
			<i class="iconfont icon-31xiala" />
		</div>
		<div class="list scroll" :class="{ show_list: open }" @click.stop="switchOpen">
			<slot name="list">
				<div class="empty">空</div>
			</slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.select {
	position: relative;
	font-size: 14px;

	.selected {
		cursor: pointer;
		@include flex_sb_center();
		padding: 0 10px;
		height: 30px;
		border-radius: 4px;
		border: 1px solid #ddd;

		.value {
			flex: 1;
			color: #555;
			overflow: hidden;
		}
		.no_value {
			color: #9da0a7;
		}

		> i {
			margin-left: 6px;
			color: #9da0a7;
			font-size: 12px;
		}
	}

	.list {
		width: 100%;
		display: none;
		position: absolute;
		z-index: 1;
		margin-top: 10px;
		padding: 2px 0;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0px 0px 12px #0000001f;

		&.show_list {
			display: block;
		}

		.empty {
			color: #9da0a7;
			font-size: 12px;
			padding: 6px 0;
			text-align: center;
		}
	}
}
</style>
