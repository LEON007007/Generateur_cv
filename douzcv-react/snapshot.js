import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const templates = [
  { value: "L'Exécutif", filename: 'cv_executive.jpg' },
  { value: "Le Minimaliste (ATS)", filename: 'cv_minimalist.jpg' },
  { value: "L'Académique & Recherche", filename: 'cv_academic.jpg' },
  { value: "Le Tech Lead", filename: 'cv_techlead.jpg' },
  { value: "Le Silicon Valley", filename: 'cv_silicon.jpg' },
  { value: "L'Ingénieur & Industriel", filename: 'cv_engineer.jpg' },
  { value: "Le Créatif", filename: 'cv_creative.jpg' },
  { value: "L'Élégant Prestige", filename: 'cv_prestige.jpg' },
  { value: "Le Portfolio Visuel", filename: 'cv_portfolio.jpg' },
  { value: "Le Condensé 1-Page", filename: 'cv_compact.jpg' },
  { value: "L'International / Expat", filename: 'cv_international.jpg' },
  { value: "Le Polyvalent Pro-Afrique", filename: 'cv_proafrique.jpg' }
]

async function run() {
  console.log('Starting puppeteer with system Chrome...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  
  // Set viewport
  await page.setViewport({ width: 1440, height: 1800, deviceScaleFactor: 2 })
  
  console.log('Navigating to editor...')
  await page.goto('http://localhost:5174/editeur', { waitUntil: 'networkidle2' })
  
  // Hide overlays and clean up styling for perfect screenshot capture
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .floating-zoom-controls, .a4-page-break-guide { display: none !important; }
      .cv-preview-container { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; border-radius: 4px !important; }
    `
    document.head.appendChild(style)
  })

  // Ensure output directory exists
  const outputDir = path.resolve('public/templates')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (const t of templates) {
    console.log(`Processing ${t.value}...`)
    
    await page.evaluate((val) => {
      const selects = Array.from(document.querySelectorAll('select'))
      const templateSelect = selects.find(s => {
        return Array.from(s.options).some(opt => opt.value === val)
      })
      if (templateSelect) {
        templateSelect.value = val
        templateSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }, t.value)

    // Wait for template to render
    await new Promise(r => setTimeout(r, 700))

    const cvElement = await page.$('.cv-preview-container')
    if (cvElement) {
      const targetPath = path.join(outputDir, t.filename)
      await cvElement.screenshot({
        path: targetPath,
        type: 'jpeg',
        quality: 95
      })
      console.log(`✓ Saved ${t.filename}`)
    } else {
      console.error(`✗ Failed to find .cv-preview-container for ${t.value}`)
    }
  }

  await browser.close()
  console.log('All 12 template screenshots captured successfully!')
}

run().catch(console.error)
