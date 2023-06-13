// import { ShapeEditor } from '../../../../src'
import { ShapeEditor } from 'shape-editor/editor'

export type editorType = {
	editor: { value: ShapeEditor }
	updateEditorInstance: (instance: ShapeEditor) => void
}
