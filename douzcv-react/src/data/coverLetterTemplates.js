/** Modèles de lettre alignés sur les 12 modèles CV douzCv */
export const COVER_LETTER_TEMPLATES = [
  { id: "L'Exécutif", label: "L'Exécutif", layout: 'classic', accentColor: '#1B3041', fontFamily: 'Inter, sans-serif' },
  { id: 'Le Minimaliste (ATS)', label: 'Minimaliste ATS', layout: 'minimal', accentColor: '#334155', fontFamily: 'Inter, sans-serif' },
  { id: "L'Académique & Recherche", label: 'Académique', layout: 'classic', accentColor: '#0F766E', fontFamily: 'Merriweather, serif' },
  { id: 'Le Tech Lead', label: 'Tech Lead', layout: 'techBand', accentColor: '#2563EB', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  { id: 'Le Silicon Valley', label: 'Silicon Valley', layout: 'techBand', accentColor: '#4338CA', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  { id: "L'Ingénieur & Industriel", label: 'Ingénieur', layout: 'techBand', accentColor: '#0369A1', fontFamily: 'Inter, sans-serif' },
  { id: 'Le Créatif', label: 'Créatif', layout: 'sidebar', accentColor: '#BE185D', fontFamily: 'DM Sans, sans-serif' },
  { id: "L'Élégant Prestige", label: 'Prestige', layout: 'prestige', accentColor: '#881337', fontFamily: 'Playfair Display, serif' },
  { id: 'Le Portfolio Visuel', label: 'Portfolio', layout: 'sidebar', accentColor: '#4F46E5', fontFamily: 'DM Sans, sans-serif' },
  { id: 'Le Condensé 1-Page', label: 'Condensé', layout: 'minimal', accentColor: '#1E293B', fontFamily: 'Inter, sans-serif' },
  { id: "L'International / Expat", label: 'International', layout: 'international', accentColor: '#0D9488', fontFamily: 'Inter, sans-serif' },
  { id: 'Le Polyvalent Pro-Afrique', label: 'Pro-Afrique', layout: 'classic', accentColor: '#1B3041', fontFamily: 'Inter, sans-serif' }
]

export function getCoverLetterTemplate(id) {
  return COVER_LETTER_TEMPLATES.find((t) => t.id === id) || COVER_LETTER_TEMPLATES[0]
}
