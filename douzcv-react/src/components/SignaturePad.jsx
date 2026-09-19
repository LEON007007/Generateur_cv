import React, { useEffect, useRef, useState } from 'react'

const CANVAS_WIDTH = 560
const CANVAS_HEIGHT = 180
const MAX_DATA_URL_LENGTH = 180000

function getCanvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
  }
}

export default function SignaturePad({ value = '', onChange }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const [hasDrawing, setHasDrawing] = useState(Boolean(value))

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ratio = Math.max(1, window.devicePixelRatio || 1)
    canvas.width = CANVAS_WIDTH * ratio
    canvas.height = CANVAS_HEIGHT * ratio
    canvas.style.aspectRatio = `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`

    const context = canvas.getContext('2d')
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 3
    context.strokeStyle = '#172B3A'
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    if (!value || !canvasRef.current) return

    const image = new Image()
    image.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    image.src = value
  }, [value])

  const saveCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    if (dataUrl.length <= MAX_DATA_URL_LENGTH) {
      onChange(dataUrl)
    }
  }

  const handlePointerDown = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    const point = getCanvasPoint(canvas, event)
    const context = canvas.getContext('2d')
    context.beginPath()
    context.moveTo(point.x, point.y)
    context.lineTo(point.x + 0.01, point.y + 0.01)
    context.stroke()
    drawingRef.current = true
    setHasDrawing(true)
  }

  const handlePointerMove = (event) => {
    if (!drawingRef.current) return

    event.preventDefault()
    const canvas = canvasRef.current
    const point = getCanvasPoint(canvas, event)
    const context = canvas.getContext('2d')
    context.lineTo(point.x, point.y)
    context.stroke()
  }

  const finishDrawing = (event) => {
    if (!drawingRef.current) return

    drawingRef.current = false
    if (event?.pointerId !== undefined) {
      canvasRef.current?.releasePointerCapture(event.pointerId)
    }
    saveCanvas()
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    setHasDrawing(false)
    onChange('')
  }

  return (
    <div className="signature-pad cover-letter-no-print">
      <div className="signature-pad-header">
        <span className="signature-pad-label">Dessinez votre signature</span>
        {hasDrawing && (
          <button type="button" className="signature-pad-clear" onClick={clearSignature}>
            Effacer
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="signature-pad-canvas"
        aria-label="Zone de dessin de la signature"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
        onPointerLeave={finishDrawing}
      />
      <p className="signature-pad-hint">Souris, doigt ou stylet</p>
    </div>
  )
}