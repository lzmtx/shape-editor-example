<script setup lang="ts">
export interface Icon {
	icon: string
	active?: boolean
	size?: number
	weight?: number
}
const props = withDefaults(defineProps<Icon>(), {
	icon: '',
	active: false,
	size: 18,
	weight: 600
})
const emits = defineEmits(['icon-click', 'update:active'])
const onClick = () => {
	emits('icon-click')
	emits('update:active', !props.active)
}
</script>

<template>
	<span class="icon" :class="{ ac_icon: active }" @click="onClick">
		<i
			class="iconfont"
			:class="{ [icon]: true }"
			:style="{ '--size': size + 'px', '--weight': weight }"
		/>
	</span>
</template>

<style lang="scss" scoped>
.icon {
	font-weight: bold;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: #ebebeb;
	}

	&.ac_icon {
		color: $ac_color;
	}

	.iconfont {
		padding: 4px;
		font-size: var(--size);
		font-weight: var(--weight, normal);
	}
}
</style>
