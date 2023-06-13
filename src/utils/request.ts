import axios from 'axios'
import { ElMessage } from 'element-plus'

export interface resDataType<T> {
	code: 0 | 1 | 3
	data: T
	msg: string
}

const request = axios.create({
	baseURL: import.meta.env.VITE_BASE_API,
	// 跨域时候允许携带凭证
	withCredentials: true
})

request.interceptors.request.use(config => {
	return config
})
request.interceptors.response.use(
	res => {
		const { status } = res
		const { code, data, msg } = res.data as resDataType<any>

		if (status === 200) {
			if (code === 1) return data
			if (code === 0) {
				ElMessage({
					type: 'error',
					message: msg
				})
				return Promise.reject(msg)
			}
			if (code === 3) {
				ElMessage({
					type: 'error',
					message: msg
				})
				return Promise.reject('没有权限！')
			}
		} else {
			ElMessage({
				type: 'error',
				message: '响应异常！'
			})
			return Promise.reject(res)
		}
	},
	error => {
		ElMessage({
			type: 'error',
			message: '请求异常！'
		})
		return Promise.reject(error)
	}
)

export default request
