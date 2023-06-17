import { ShapeEditor } from 'shape-editor/dist/editor'

export type editorType = {
	editor: { value: ShapeEditor }
	updateEditorInstance: (instance: ShapeEditor) => void
}
