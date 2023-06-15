import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore(
	'editorStore',
	() => {
		const showRightSide = ref<boolean>(false)
		const scale = ref(1)
		const offset = ref({ x: 0, y: 0 })
		const random = ref<number>(0)
		const canvasImgSrc = ref<string>('')

		const setScale = (num: number) => {
			scale.value = num
		}
		const setOffset = (x: number, y: number) => {
			offset.value = { x, y }
		}
		const setRandom = () => {
			random.value = Math.round(Math.random() * 1000)
		}
		const setCanvasImgSrc = (string: string) => {
			canvasImgSrc.value = string
		}

		return {
			scale,
			offset,
			showRightSide,
			setScale,
			setOffset,
			random,
			setRandom,
			canvasImgSrc,
			setCanvasImgSrc
		}
	},
	{
		persist: false
	}
)
