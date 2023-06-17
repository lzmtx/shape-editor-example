<script setup lang="ts">
import { editorType } from '@/typings'
import BootomBar from './BootomBar.vue'
import Input from '@/components/Input.vue'
import Upload from '@/components/Upload.vue'
import CanvasForm from '@/components/CanvasForm.vue'
import { ElMessage } from 'element-plus'

import { shapeEditAttrs } from 'shape-editor/dist/editor'
import { useEditorStore } from '@/store/editor'

let canvasImg: HTMLImageElement = new Image()

const { editor: _editor } = inject('shapeEditor') as editorType
const editor = _editor.value
const editorData = reactive(
	editor.filterProxyData(['scale', 'offset', 'moveCanvas', 'selectShapeInfo'])
)
const editorStore = useEditorStore()
const shapeEditAttrs = ref<shapeEditAttrs | null>(null)
const isArrange = ref<boolean>(false)
const canvasImgSrc = ref<string>(editorStore.canvasImgSrc || '')

type styleKeys = keyof (typeof editorData.shapeStyleMap)['base']
type attrKeys = keyof shapeEditAttrs

// 清空初始值
editorData.currentShapeStyleName = ''

editor.watch('stageWidth', (value: any) => {
	editorData.stageWidth = value
	editor.resizeDraw()
})
editor.watch('stageHeight', (value: any) => {
	editorData.stageHeight = value
	editor.resizeDraw()
})
editor.watch('selectShapeInfo', (value: any) => {
	shapeEditAttrs.value = Object.keys(value).length ? editor.selectShapeEditAttrs : null
	isArrange.value = !!editor.selectShapeList.find(shape => shape.angle !== 0)
})

watch(editorData, () => {
	editor.updataAll(toRaw(editorData))
})
watch(
	() => editorStore.canvasImgSrc,
	() => {
		// 更新画布底图src
		if (editorStore.canvasImgSrc) {
			canvasImgSrc.value = editorStore.canvasImgSrc
		}
	}
)

const updateEditorSize = () => {
	editor.stageWidth = canvasImg.width
	editor.stageHeight = canvasImg.height
}
const updateCanvasImg = (val: string) => {
	canvasImgSrc.value = val

	canvasImg = new Image()
	canvasImg.src = val
	canvasImg.onload = () => {
		editor.updateCanvasImg(canvasImgSrc.value, canvasImg)
		updateEditorSize()
		editor.resizeDraw()
	}
}
const delCanvasImg = () => {
	canvasImgSrc.value = ''
	editor.delCanvasImgShape()
	editor.draw()
}
const changeStyleMapItemName = (name: string, val: string) => {
	if (editorData.shapeStyleMap[val] && name !== val) {
		ElMessage({
			type: 'warning',
			message: `主题名称 ${val} 已存在！`
		})
		return
	}
	if (name === 'base') {
		ElMessage({
			type: 'warning',
			message: '主题名称 base 不能被修改！'
		})
		return
	}
	const oldStyle = editorData.shapeStyleMap[name]
	editorData.shapeStyleMap[val] = { ...oldStyle }
	delete editorData.shapeStyleMap[name]

	if (editorData.currentShapeStyleName === name) {
		editorData.currentShapeStyleName = val
	}
}
const setEditStyle = (name: string) => {
	if (editorData.currentShapeStyleName === name) {
		editorData.currentShapeStyleName = ''
		editorData.unifyAllShapeStyle = false
	} else {
		editorData.currentShapeStyleName = name
		editorData.unifyAllShapeStyle = true
	}
}
const copyStyle = (name: string) => {
	let style = editorData.shapeStyleMap[name]
	let newName = `${name}_copy`
	editorData.shapeStyleMap[newName] = { ...style }
	nextTick(() => {
		editorData.currentShapeStyleName = newName
	})
}
const delStyle = (name: string) => {
	if (name === 'base') return
	delete editorData.shapeStyleMap[name]
	if (editorData.currentShapeStyleName === name) {
		editorData.currentShapeStyleName = ''
		editorData.unifyAllShapeStyle = false
	}
}
const previewSelectedStyle = () => {
	editorData.useSeparateStyleWhenSelected = !editorData.useSeparateStyleWhenSelected
}
const updateSelectedStyle = (params: { key: styleKeys; val: never }) => {
	editorData.selectedShapeStyle[params.key] = params.val
}
const updateItem = (params: { key: styleKeys; val: never }) => {
	editorData.shapeStyleMap[editorData.currentShapeStyleName][params.key] = params.val
}
const updateEditAttrs = (params: { key: attrKeys; val: never }) => {
	if (shapeEditAttrs.value) {
		shapeEditAttrs.value[params.key] = params.val
		editor.setSelectShapeEditAttrs({ [params.key]: params.val })
		editor.draw()
	}
}
const handleArrange = <T extends Parameters<typeof editor.arrangeAlignment>>(...args: T) => {
	const [type] = args

	if (editor.transformControl.angle) {
		ElMessage({
			type: 'warning',
			message: '暂不支持旋转状态的排列，请重新选中要排列的图形'
		})
		return
	}

	if (type === 'centerEquidistant' && editor.selectShapesWidthExceed) {
		ElMessage({
			type: 'warning',
			customClass: 'warningMsg',
			dangerouslyUseHTMLString: true,
			message: '选中的图形 <b>总宽度</b> 超出包围盒，请重新调整图形位置'
		})
		return
	}

	if (type === 'middleEquidistant' && editor.selectShapesHeightExceed) {
		ElMessage({
			type: 'warning',
			customClass: 'warningMsg',
			dangerouslyUseHTMLString: true,
			message: '选中的图形 <b>总高度</b> 超出包围盒，请重新调整图形位置'
		})
		return
	}

	return editor.arrangeAlignment(type)
}
</script>

<template>
	<section class="right_side">
		<div class="side scroll">
			<div class="card" v-if="!shapeEditAttrs">
				<div class="row title">
					<span class="label">画布设置</span>
				</div>
				<div class="row">
					<span class="label">宽度</span>
					<Input class="col" type="number" v-model="editorData.stageWidth" />
				</div>
				<div class="row">
					<span class="label">高度</span>
					<Input class="col" type="number" v-model="editorData.stageHeight" />
				</div>
				<div class="row">
					<span class="label">底图</span>
					<div class="upload" v-if="canvasImgSrc">
						<el-image
							class="img"
							:src="canvasImgSrc"
							:preview-src-list="[canvasImgSrc]"
							fit="cover"
							:preview-teleported="true"
						/>
						<div class="option">
							<Upload class="btn" :img="canvasImgSrc" @update:img="updateCanvasImg">
								<span>替换</span>
							</Upload>
							<span class="btn" @click="delCanvasImg">删除</span>
						</div>
					</div>
					<Upload :img="canvasImgSrc" @update:img="updateCanvasImg" v-else>
						<div class="upload empty">
							<i class="iconfont icon-baocun" />
							<span>上传</span>
						</div>
					</Upload>
				</div>
				<div class="row title">
					<span class="label">图形主题列表</span>
				</div>
				<div
					class="row list_item"
					v-for="(item, name) in editorData.shapeStyleMap"
					:key="name"
				>
					<span
						class="i_btn"
						:class="{
							ac:
								editor.unifyAllShapeStyle &&
								editorData.currentShapeStyleName === name
						}"
						@click="setEditStyle(name as string)"
					>
						<i class="iconfont icon-yulan" />
					</span>
					<div class="input">
						<Input
							type="text"
							:model-value="name"
							@update:model-value="(val: string) => changeStyleMapItemName((name as string), val)"
						/>
					</div>
					<div>
						<span class="i_btn" @click="copyStyle(name as string)">
							<i class="iconfont icon-tianjia" />
						</span>
						<span
							class="i_btn"
							:class="{ disable: name === 'base' }"
							@click="delStyle(name as string)"
						>
							<i class="iconfont icon-cuowu" />
						</span>
					</div>
				</div>

				<template v-if="editorData.unifyAllShapeStyle">
					<template v-for="(item, name) in editorData.shapeStyleMap" : key="name">
						<template v-if="name === editorData.currentShapeStyleName">
							<div class="row title">
								<span class="label">{{ name }}</span>
							</div>
							<CanvasForm :item="item" @update:item="updateItem" />
						</template>
					</template>
				</template>
			</div>
			<div class="card" v-if="shapeEditAttrs">
				<div class="row title long">
					<span class="label">图形被选中时的样式配置</span>
					<span
						class="i_btn"
						:class="{ ac: editorData.useSeparateStyleWhenSelected }"
						@click="previewSelectedStyle"
					>
						<i class="iconfont icon-yulan" />
					</span>
				</div>
				<CanvasForm
					v-if="editorData.useSeparateStyleWhenSelected"
					:item="editorData.selectedShapeStyle"
					@update:item="updateSelectedStyle"
				/>
				<div class="row title">
					<span class="label">已选中图形配置</span>
				</div>
				<div class="row arrange" :class="{ disable: isArrange && false }">
					<ElTooltip content="左对齐" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('left')">
							<i class="iconfont icon-zuoduiqi-" />
						</span>
					</ElTooltip>
					<ElTooltip content="水平居中对齐" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('center')">
							<i class="iconfont icon-juzhongduiqi-" />
						</span>
					</ElTooltip>
					<ElTooltip content="右对齐" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('right')">
							<i class="iconfont icon-youduiqi-" />
						</span>
					</ElTooltip>
					<ElTooltip content="顶部对齐" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('top')">
							<i class="iconfont icon-dingduiqi-" />
						</span>
					</ElTooltip>
					<ElTooltip content="垂直居中对齐" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('middle')">
							<i class="iconfont icon-chuizhijuzhong-" />
						</span>
					</ElTooltip>
					<ElTooltip content="底部对齐" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('bottom')">
							<i class="iconfont icon-diduiqi-" />
						</span>
					</ElTooltip>
					<ElTooltip content="垂直等距分布" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('middleEquidistant')">
							<i class="iconfont icon-shuipingdengjianju-" />
						</span>
					</ElTooltip>
					<ElTooltip content="水平等距分布" placement="top" :show-after="400">
						<span class="i_btn" @click="handleArrange('centerEquidistant')">
							<i class="iconfont icon-chuizhidengjianju-" />
						</span>
					</ElTooltip>
				</div>
				<div class="row">
					<span class="label">内容</span>
					<Input
						class="col"
						type="text"
						:model-value="shapeEditAttrs.name"
						@update:model-value="(val: never) => updateEditAttrs({ key: 'name', val })"
					/>
				</div>
				<CanvasForm :item="shapeEditAttrs" @update:item="updateEditAttrs" />
			</div>
		</div>

		<div class="footer">
			<BootomBar />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.right_side {
	input {
		display: block;
	}

	.top {
		position: absolute;
		top: 10px;
		right: calc(100% + 10px);
		background-color: #fff;
		padding: 6px;
		gap: 8px;
		border-radius: 8px;
	}
	.side {
		width: 240px;
		height: 100%;
		position: relative;

		.card {
			.row {
				padding: 6px 10px;
				@include flex_sb_center();

				&.title {
					border-bottom: 1px solid #228668;
					padding: 10px;
					margin-bottom: 10px;
					.label {
						width: 120px;
						font-weight: bold;
					}
				}
				&.long {
					.label {
						width: auto;
					}
				}

				&.list_item {
					padding-left: 6px;

					.input {
						display: block;
						flex: 1;
						padding: 1px 10px;
					}

					.ac {
						color: var(--ac_color);
					}

					.i_btn.disable {
						opacity: 0.3;
						cursor: not-allowed;
					}
				}

				.label {
					flex-shrink: 0;
					width: 80px;
				}

				.col {
					flex: 1;
				}

				.upload {
					width: 60px;
					height: 60px;
					border-radius: 4px;
					border: 1px solid #ddd;
					position: relative;
					overflow: hidden;
					cursor: pointer;

					&.empty {
						flex-direction: column;
						row-gap: 2px;
						@include flex_center_center();

						> i {
							font-size: 18px;
						}
						> span {
							font-size: 12px;
						}
					}

					& > input[type='file'] {
						cursor: pointer;
						position: absolute;
						top: -28px;
						width: 100%;
						height: calc(100% + 28px);
						overflow: hidden;
						display: block;
						box-sizing: border-box;
						opacity: 0;
					}

					.img {
						width: 100%;
						height: 100%;
					}
					&:hover {
						.option {
							display: flex;
						}
					}
					.option {
						@include flex_sb_center();
						display: none;
						position: absolute;
						top: 0;
						width: 100%;
						font-size: 12px;
						color: #fff;
						background-color: #898989;
						> .btn {
							padding: 4px 3px;

							&:hover {
								background-color: #555555;
							}
						}
					}
				}
			}

			.row_select {
				width: 170px;
			}
			.i_btn {
				padding: 4px;
				cursor: pointer;

				&.ac {
					color: $ac_color;
				}

				> i {
					font-size: 20px;
				}
			}

			.arrange {
				@include flex_sb_center();
				justify-content: space-around;

				&.disable {
					cursor: not-allowed;
					position: relative;
					padding-bottom: 20px;
					margin-bottom: 10px;

					&::before {
						content: '';
						position: absolute;
						top: 0;
						z-index: 1;
						width: 100%;
						height: 100%;
						pointer-events: all;
						background-color: #00000016;
					}

					&::after {
						content: '暂不支持旋转后的排列';
						position: absolute;
						bottom: 4px;
						font-size: 14px;
						color: #666;
					}

					.i_btn {
						opacity: 0.3;
					}
				}

				.i_btn {
					&:hover {
						border-radius: 4px;
						background-color: #f2f2f2;
					}
				}
			}
		}
	}
	.footer {
		position: absolute;
		bottom: 10px;
		right: calc(100% + 10px);
	}
}
</style>

<style lang="scss">
.warningMsg {
	i,
	p {
		font-size: 16px !important;
	}

	b {
		font-weight: bold;
	}
}
</style>
