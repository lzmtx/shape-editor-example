import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('mainStore', () => {
	const filePath = ref<string>(import.meta.env.VITE_FILE_PATH)

	return { filePath }
})
