import html2pdf from 'html2pdf.js'
import { saveAs } from 'file-saver'

function replaceEditableFieldsWithText(root) {
  root.querySelectorAll('input, textarea, select').forEach((field) => {
    const text = field instanceof HTMLSelectElement
      ? field.options[field.selectedIndex]?.text || field.value
      : field.value
    const replacement = document.createElement(field.matches('textarea') ? 'div' : 'span')

    replacement.className = `${field.className} pdf-static-field`
    replacement.textContent = text || ''
    replacement.style.cssText = field.style.cssText
    replacement.style.display = field.matches('textarea') ? 'block' : 'inline'
    replacement.style.whiteSpace = field.matches('textarea') ? 'pre-wrap' : 'pre-wrap'
    replacement.style.height = 'auto'
    replacement.style.minHeight = field.matches('textarea') ? '0' : replacement.style.minHeight
    replacement.style.resize = 'none'
    replacement.removeAttribute('placeholder')
    field.replaceWith(replacement)
  })
}

/**
 * Exporte un élément DOM (aperçu A4) en PDF — même technique que Export.jsx
 */
export async function exportPreviewToPdf(sourceElement, filename) {
  if (!sourceElement) {
    throw new Error('Aucun aperçu à exporter.')
  }

  try {
    await document.fonts.ready
  } catch {
    /* fallback */
  }

  const offScreenContainer = document.createElement('div')
  offScreenContainer.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 794px;
    height: auto;
    overflow: visible;
    z-index: -1;
    background: white;
  `

  const clone = sourceElement.cloneNode(true)
  replaceEditableFieldsWithText(clone)

  clone.style.cssText = `
    width: 794px !important;
    min-width: 794px !important;
    max-width: 794px !important;
    min-height: 1123px !important;
    padding: 40px !important;
    margin: 0 !important;
    transform: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    position: relative !important;
    background: white !important;
    font-family: ${sourceElement.style.fontFamily || "'Inter', sans-serif"} !important;
  `

  clone.querySelectorAll(
    '.word-page-break-divider, .floating-zoom-controls, .cover-letter-no-print'
  ).forEach((el) => el.remove())

  offScreenContainer.appendChild(clone)
  document.body.appendChild(offScreenContainer)

  await new Promise((r) => setTimeout(r, 200))

  const opt = {
    margin: 0,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      windowWidth: 794
    },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait', hotfixes: ['px_scaling'] }
  }

  try {
    const pdf = await html2pdf().set(opt).from(clone).toPdf().get('pdf')
    const pdfBlob = pdf.output('blob')
    saveAs(pdfBlob, filename)
  } finally {
    document.body.removeChild(offScreenContainer)
  }
}
