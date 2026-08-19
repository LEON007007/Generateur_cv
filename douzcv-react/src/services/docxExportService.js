import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType 
} from 'docx'

/**
 * Generate a pristine native Microsoft Word (.docx) file from CV Store data
 */
export async function generateNativeDocx({ personalInfo, experiences, education, skills, languages, accentColor, selectedTemplate }) {
  // Convert hex color to 6-digit hex string without '#' for docx
  const cleanHex = (accentColor || '#1B3041').replace('#', '')
  const primaryColor = cleanHex.length === 6 ? cleanHex : '1B3041'
  const textColor = '1E293B'
  const mutedColor = '64748B'

  const children = []

  // 1. Candidate Full Name Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: `${personalInfo.firstName || 'Leon'} ${personalInfo.lastName || 'Atangana'}`.toUpperCase(),
          bold: true,
          size: 38, // 19pt
          color: primaryColor,
          font: 'Calibri'
        })
      ]
    })
  )

  // 2. Professional Subtitle / Title
  if (personalInfo.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({
            text: personalInfo.title,
            bold: true,
            size: 24, // 12pt
            color: mutedColor,
            font: 'Calibri'
          })
        ]
      })
    )
  }

  // 3. Contact Info Bar
  const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean)
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 280 },
        border: {
          bottom: {
            color: primaryColor,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 12
          }
        },
        children: [
          new TextRun({
            text: contactParts.join('   |   '),
            size: 20, // 10pt
            color: '475569',
            font: 'Calibri'
          })
        ]
      })
    )
  }

  // Helper: Section Heading
  const createSectionHeader = (title) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 3,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 23, // 11.5pt
          color: primaryColor,
          font: 'Calibri'
        })
      ]
    })
  }

  // 4. Professional Summary (Profil)
  if (personalInfo.summary) {
    children.push(createSectionHeader('Profil & Résumé Professionnel'))
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 180 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 21, // 10.5pt
            color: textColor,
            font: 'Calibri'
          })
        ]
      })
    )
  }

  // 5. Work Experiences
  if (experiences && experiences.length > 0) {
    children.push(createSectionHeader('Expériences Professionnelles'))

    experiences.forEach((exp) => {
      // Job title + Company + Dates line
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.title || 'Poste',
              bold: true,
              size: 22,
              color: '0F172A',
              font: 'Calibri'
            }),
            new TextRun({
              text: `  —  ${exp.company || 'Entreprise'}`,
              bold: true,
              color: primaryColor,
              size: 21,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  (${exp.startDate || ''} - ${exp.endDate || 'Présent'})`,
              color: mutedColor,
              size: 19,
              font: 'Calibri'
            })
          ]
        })
      )

      // Description / Bullet Points
      if (exp.description) {
        const lines = exp.description.split('\n').filter(Boolean)
        lines.forEach((line) => {
          const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim()
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: cleanLine,
                  size: 20, // 10pt
                  color: textColor,
                  font: 'Calibri'
                })
              ]
            })
          )
        })
      }
    })
  }

  // 6. Education & Formation
  if (education && education.length > 0) {
    children.push(createSectionHeader('Formation & Diplômes'))

    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: edu.degree || 'Diplôme',
              bold: true,
              size: 21,
              color: '0F172A',
              font: 'Calibri'
            }),
            new TextRun({
              text: `  —  ${edu.school || 'Établissement'}`,
              color: primaryColor,
              size: 20,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  (${edu.startDate || ''} - ${edu.endDate || ''})`,
              color: mutedColor,
              size: 19,
              font: 'Calibri'
            })
          ]
        })
      )
    })
  }

  // 7. Skills (Compétences)
  if (skills && skills.length > 0) {
    children.push(createSectionHeader('Compétences Clés'))
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: skills.join('   •   '),
            bold: true,
            size: 20,
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    )
  }

  // 8. Languages (Langues)
  if (languages && languages.length > 0) {
    children.push(createSectionHeader('Langues'))
    languages.forEach((lang) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 30, after: 30 },
          children: [
            new TextRun({
              text: `${lang.name || 'Langue'} : `,
              bold: true,
              size: 20,
              color: '0F172A',
              font: 'Calibri'
            }),
            new TextRun({
              text: lang.level || 'Courant',
              size: 20,
              color: '475569',
              font: 'Calibri'
            })
          ]
        })
      )
    })
  }

  // Create native Word Document
  const doc = new Document({
    creator: 'douzCv Generator',
    title: `CV - ${personalInfo.firstName} ${personalInfo.lastName}`,
    description: `Généré par douzCv avec le modèle ${selectedTemplate || 'Standard'}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2cm
              right: 1134,
              bottom: 1134,
              left: 1134
            }
          }
        },
        children
      }
    ]
  })

  // Pack into Blob
  return await Packer.toBlob(doc)
}
