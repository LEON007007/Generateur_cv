import React from 'react'

export function CoverLetterEditable({
  value,
  onChange,
  multiline = false,
  inline = false,
  placeholder = '',
  rows = 3,
  style = {},
  className = ''
}) {
  const shared = {
    className: [
      'cover-letter-editable',
      inline ? 'cover-letter-editable--inline' : '',
      multiline ? 'cover-letter-editable--multiline' : '',
      className
    ]
      .filter(Boolean)
      .join(' '),
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    placeholder,
    style
  }

  if (multiline) {
    return <textarea {...shared} rows={rows} spellCheck />
  }

  return <input type="text" {...shared} spellCheck />
}
