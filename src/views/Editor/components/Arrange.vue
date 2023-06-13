<script setup lang="ts">
import { editorType } from '@/typings'

const { editor: _editor } = inject('shapeEditor') as editorType
const editor = _editor.value
</script>

<template>
	<ElTooltip content="左对齐" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('left')">
			<i class="iconfont icon-zuoduiqi-" />
		</span>
	</ElTooltip>
	<ElTooltip content="水平居中对齐" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('center')">
			<i class="iconfont icon-juzhongduiqi-" />
		</span>
	</ElTooltip>
	<ElTooltip content="右对齐" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('right')">
			<i class="iconfont icon-youduiqi-" />
		</span>
	</ElTooltip>
	<ElTooltip content="顶部对齐" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('top')">
			<i class="iconfont icon-dingduiqi-" />
		</span>
	</ElTooltip>
	<ElTooltip content="垂直居中对齐" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('middle')">
			<i class="iconfont icon-chuizhijuzhong-" />
		</span>
	</ElTooltip>
	<ElTooltip content="底部对齐" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('bottom')">
			<i class="iconfont icon-diduiqi-" />
		</span>
	</ElTooltip>
	<ElTooltip content="垂直等距分布" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('middleEquidistant')">
			<i class="iconfont icon-chuizhidengjianju-" />
		</span>
	</ElTooltip>
	<ElTooltip content="水平等距分布" placement="top" :show-after="400">
		<span class="i_btn" @click="editor.arrangeAlignment('centerEquidistant')">
			<i class="iconfont icon-shuipingdengjianju-" />
		</span>
	</ElTooltip>
</template>
