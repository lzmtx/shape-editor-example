<script setup lang="ts">
const props = defineProps<{
	font: string
	name?: string
	url?: string
}>()
const fontUrl = computed(() => {
	let url = 'http://files.varmm.com/font/'
	return `${props.url || url}${props.font}.ttf`
})
</script>

<template>
	<!-- style="@font-face {font-family: var(--f); src: url(var(--url))}" -->
	<p class="font" :style="{ '--f': font, '--url': fontUrl }">
		{{ name || font }}
	</p>
</template>

<style lang="scss">
.font {
	--f: '';
	--url: '';

	@font-face {
		font-family: var(--f);
		src: url(var(--url));
	}

	font-family: var(--f);
}
</style>
