const SECTION_LABELS = {
  experience: /^(exp[eé]riences?|parcours professionnel|work experience|professional experience)\b/i,
  education: /^(formations?|[eé]ducation|cursus|education)\b/i,
  skills: /^(comp[eé]tences?|skills|expertise)\b/i,
  languages: /^(langues?|languages)\b/i,
  summary: /^(profil|r[eé]sum[eé]|about|profile|summary|objectif professionnel)\b/i
}

const cleanLine = (line) => line.replace(/^\s*(?:[•*\-–—▪◦]|\d+[.)])\s*/, '').trim()

const findSection = (lines, expression) => {
  const index = lines.findIndex((line) => expression.test(line.trim()))
  if (index < 0) return []

  const content = []
  for (const line of lines.slice(index + 1)) {
    if (Object.values(SECTION_LABELS).some((label) => label.test(line.trim()))) break
    if (line.trim()) content.push(cleanLine(line))
  }
  return content
}

const parseResumeText = (text) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const normalizedText = lines.join('\n')
  const email = normalizedText.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || ''
  const phone = normalizedText.match(/(?:\+?\d[\d\s()./-]{7,}\d)/)?.[0]?.trim() || ''
  const emailLine = email ? lines.findIndex((line) => line.includes(email)) : -1
  const nameLine = lines.find((line, index) => index < 8 && index !== emailLine && !/@|\d{3,}|https?:|linkedin|portfolio/i.test(line) && line.split(/\s+/).length >= 2)
  const nameParts = nameLine ? nameLine.split(/\s+/) : []
  const firstName = nameParts.shift() || ''
  const lastName = nameParts.join(' ')
  const title = nameLine
    ? lines.slice(lines.indexOf(nameLine) + 1).find((line) => line !== email && line !== phone && !/@|\d{3,}|https?:/i.test(line) && line.split(/\s+/).length <= 12) || ''
    : ''

  const summaryLines = findSection(lines, SECTION_LABELS.summary)
  const skillLines = findSection(lines, SECTION_LABELS.skills)
  const languageLines = findSection(lines, SECTION_LABELS.languages)
  const experienceLines = findSection(lines, SECTION_LABELS.experience)
  const educationLines = findSection(lines, SECTION_LABELS.education)

  const experiences = []
  for (let index = 0; index < experienceLines.length;) {
    const heading = experienceLines[index]
    const dateMatch = heading.match(/(\d{4}\s*[-–—]\s*(?:\d{4}|pr[eé]sent|actuel))\s*$/i)
    const titleCompany = (dateMatch ? heading.slice(0, dateMatch.index) : heading).split(/\s+[|•—-]\s+/)
    if (titleCompany[0]) {
      experiences.push({
        id: Date.now() + index,
        title: titleCompany[0].trim(),
        company: titleCompany[1]?.trim() || '',
        startDate: dateMatch?.[1]?.split(/[-–—]/)[0]?.trim() || '',
        endDate: dateMatch?.[1]?.split(/[-–—]/)[1]?.trim() || '',
        description: experienceLines[index + 1] || ''
      })
    }
    index += 2
  }

  const education = educationLines.filter(Boolean).map((line, index) => ({
    id: Date.now() + 1000 + index,
    degree: line,
    school: '',
    startDate: '',
    endDate: '',
    description: ''
  }))

  const skills = skillLines.flatMap((line) => line.split(/[,;|•]/)).map(cleanLine).filter(Boolean)
  const languages = languageLines.map((line, index) => {
    const parts = line.split(/\s*[-–—:|]\s*/)
    return { id: Date.now() + 2000 + index, name: parts[0], level: parts[1] || '' }
  })

  const location = lines.find((line) => /\b(?:Paris|Lyon|Marseille|Dakar|Yaound[eé]|Montr[eé]al|Bruxelles|Gen[eè]ve)\b/i.test(line) && line !== nameLine) || ''

  if (!firstName && !lastName && !email && !phone && !title && !summaryLines.length && !experiences.length && !education.length && !skills.length) {
    throw new Error('Aucune information de CV lisible n’a été trouvée dans ce fichier.')
  }

  return {
    personalInfo: {
      firstName,
      lastName,
      title,
      email,
      phone,
      location,
      summary: summaryLines.join('\n')
    },
    experiences,
    education,
    skills,
    languages
  }
}

const extractPdfText = async (file) => {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
  const pdf = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  const pages = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  return pages.join('\n')
}

export async function importCVFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'json') {
    const data = JSON.parse(await file.text())
    if (!data.personalInfo || typeof data.personalInfo !== 'object') {
      throw new Error('Ce JSON ne contient pas les données d’un CV douzCv.')
    }
    return {
      personalInfo: data.personalInfo,
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      languages: Array.isArray(data.languages) ? data.languages : []
    }
  }

  if (extension === 'docx') {
    const mammothModule = await import('mammoth/mammoth.browser')
    const mammoth = mammothModule.default || mammothModule
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    return parseResumeText(result.value)
  }

  if (extension === 'pdf') return parseResumeText(await extractPdfText(file))
  if (extension === 'txt') return parseResumeText(await file.text())

  throw new Error('Format non pris en charge. Choisissez un fichier PDF, DOCX, TXT ou JSON douzCv.')
}