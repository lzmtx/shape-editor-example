import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore(
	'editorStore',
	() => {
		const showRightSide = ref<boolean>(false)
		const scale = ref(1)
		const offset = ref({ x: 0, y: 0 })

		function setScale(num: number) {
			scale.value = num
		}
		function setOffset(x: number, y: number) {
			offset.value = { x, y }
		}

		return { scale, offset, showRightSide, setScale, setOffset }
	},
	{
		persist: true
	}
)
