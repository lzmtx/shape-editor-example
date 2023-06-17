<script setup lang="ts">
import { editorType } from '@/typings'
import PreviewEidtor from './PreviewEidtor.vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import Qrcode from '@/components/Qrcode.vue'

const { editor: _editor } = inject('shapeEditor') as editorType
const editor = _editor.value
const showPreview = ref<boolean>(false)
const editorConfig = ref<any>()
const router = useRouter()

const exportData = () => {
	editorConfig.value = editor.exportShapeEditorConfig()
	showPreview.value = true
}
const toPreview = () => {
	window.open(router.resolve('/preview').href, '_blank')
}
const toNPM = () => {
	window.open('https://www.npmjs.com/package/shape-editor', '_blank')
}
const toGithub = () => {
	window.open('https://github.com/lzmtx/shape-editor-example', '_blank')
}
</script>

<template>
	<div class="top_bar">
		<div class="left">图形编辑面板</div>
		<div class="tools" v-if="false">
			<ElTooltip content="撤销" placement="bottom">
				<Icon icon="icon-chexiao" @icon-click="" />
			</ElTooltip>
			<ElTooltip content="重做" placement="bottom">
				<Icon icon="icon-zhongzuo" @icon-click="" />
			</ElTooltip>
			<ElTooltip content="组合" placement="bottom">
				<Icon icon="icon-zuhe" @icon-click="" />
			</ElTooltip>
			<ElTooltip content="打散" placement="bottom">
				<Icon icon="icon-dasan" @icon-click="" />
			</ElTooltip>
			<ElTooltip content="快速生成图形" placement="bottom">
				<Icon icon="icon-piliangchuangjian" @icon-click="" />
			</ElTooltip>
		</div>
		<div class="right">
			<img style="display: none" src="https://files.varmm.com/imgs/editor-preview.png" />
			<ElTooltip placement="bottom">
				<Icon icon="icon-yulan" @icon-click="toPreview" />
				<template #content>
					<Qrcode />
				</template>
			</ElTooltip>
			<ElTooltip content="预览并导出画板配置" placement="bottom">
				<Icon icon="icon-baocun" @icon-click="exportData" />
			</ElTooltip>
			<ElTooltip content="NPM" placement="bottom">
				<Icon icon="icon-npm" :size="28" :weight="500" @icon-click="toNPM" />
			</ElTooltip>
			<ElTooltip content="Github" placement="bottom">
				<Icon icon="icon-github" @icon-click="toGithub" />
			</ElTooltip>
			<PreviewEidtor :editor-config="editorConfig" v-model="showPreview" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.top_bar {
	@include flex_sb_center();
	padding: 0 10px;
	border-bottom: 1px solid #ddd;
	position: relative;

	.left {
		padding-left: 10px;
		font-family: 快看世界体;
	}
	.tools {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		@include flex_sb_center();
		gap: 18px;
	}

	.right {
		@include flex_sb_center();
		gap: 18px;
		padding-right: 10px;
	}
}
</style>
