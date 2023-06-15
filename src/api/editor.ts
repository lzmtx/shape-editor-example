import request from '@/utils/request'
import { ShapeEditorConfig } from 'shape-editor/editor'

export const getConfig = () => {
	return request.get<any, ShapeEditorConfig>('/json/getShapeEditorConfig')
}

export const setConfig = (config: ShapeEditorConfig) => {
	return request.post('/json/setShapeEditorConfig', config)
}
