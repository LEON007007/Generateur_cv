import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './RichTextEditor.css'

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'bullet' }, { 'list': 'ordered' }],
    ['link'],
    [{ 'align': [] }],
    [{ 'color': [] }],
    ['clean'] // remove formatting button
  ],
}

const formats = [
  'bold', 'italic', 'underline',
  'list',
  'link',
  'align',
  'color'
]

export default function RichTextEditor({ value, onChange, placeholder }) {
  const [editorValue, setEditorValue] = useState(value || '')

  useEffect(() => {
    const nextValue = value || ''
    setEditorValue((currentValue) => currentValue === nextValue ? currentValue : nextValue)
  }, [value])

  const handleChange = (content, delta, source, editor) => {
    // Prevent saving empty paragraphs when the user clears the editor
    const text = editor.getText().trim()
    const nextValue = !text && content.includes('<p><br></p>') ? '' : content
    setEditorValue(nextValue)

    if (!text && content.includes('<p><br></p>')) {
      onChange('')
    } else {
      onChange(content)
    }
  }

  return (
    <div className="rich-text-container">
      <ReactQuill 
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}
