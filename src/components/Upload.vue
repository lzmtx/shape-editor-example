<script setup lang="ts">
import { uploadImg } from '@/api/upload'
import { useMainStore } from '@/store/main'
import { AxiosProgressEvent } from 'axios'
import { ElMessage, MessageHandler } from 'element-plus'

let msg: MessageHandler

defineProps<{ img?: string }>()
const emits = defineEmits(['update:img'])
const { filePath } = useMainStore()

const onProgress = (e: AxiosProgressEvent) => {
	let count = Math.round((e.loaded / (e.total || 1)) * 100) / 100
	if (count >= 1) msg.close()
}

const selectFile = (e: Event) => {
	let input = e.target as HTMLInputElement
	if (!input.files?.length) return

	msg = ElMessage({
		type: 'info',
		duration: 0,
		message: '图片上传中，请稍等...'
	})

	const file = input.files[0]
	uploadImg(file, onProgress)
		.then(res => {
			emits('update:img', filePath + '/imgs/' + res.filename)
		})
		.catch(err => {
			console.log('请求失败：', err)
		})
}
</script>

<template>
	<div class="upload_box">
		<input type="file" @change="selectFile" title="" accept=".jpg,.png" />
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.upload_box {
	box-sizing: border-box;
	overflow: hidden;
	position: relative;

	& > input[type='file'] {
		cursor: pointer;
		position: absolute;
		z-index: 1;
		top: -28px;
		width: 100%;
		height: calc(100% + 28px);
		overflow: hidden;
		display: block;
		box-sizing: border-box;
		opacity: 0;
	}
}
</style>
