<script setup lang="ts">
defineProps<{ val: string }>()
</script>

<template>
	<div class="line">
		<template v-if="val === ''">
			<i />
			<span>实线</span>
		</template>
		<template v-else>
			<i style="--s: dashed" />
			<span>虚线</span>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.line {
	@include flex_sb_center();
	i {
		--s: solid;
		flex: 1;
		margin-right: 8px;
		display: block;
		border-bottom: 1px var(--s) #000;
	}
	span {
		font-size: 14px;
	}
}
</style>
