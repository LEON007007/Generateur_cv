import React from 'react'
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
  'list', 'bullet',
  'link',
  'align',
  'color'
]

export default function RichTextEditor({ value, onChange, placeholder }) {
  const handleChange = (content, delta, source, editor) => {
    // Prevent saving empty paragraphs when the user clears the editor
    const text = editor.getText().trim()
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
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}
