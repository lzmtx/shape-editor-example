import request from '@/utils/request'
import { AxiosProgressEvent } from 'axios'
import { Upload } from './interface'

export const uploadImg = (file: File, onProgress?: (progressEvent: AxiosProgressEvent) => void) => {
	const formData = new FormData()
	formData.append('file', file)

	return request.post<any, Upload.Img>('/upload/img', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		onUploadProgress: onProgress
	})
}
