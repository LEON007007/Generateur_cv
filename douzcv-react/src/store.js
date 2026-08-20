import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { saveCVRecord, getCVRecord, listAllCVRecords, deleteCVRecord } from './services/embeddedDB'

const defaultState = {
  activeCVId: 'default_cv',
  guestUser: {
    name: '',
    title: '',
    email: '',
    avatar: ''
  },
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    summary: ''
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  
  // Customization settings
  selectedTemplate: "L'Exécutif",
  accentColor: '#1B3041',
  fontFamily: 'Inter',
  zoomLevel: 1,
  spacing: 'normal',
  showPageBreaks: true,
  lastSavedAt: new Date().toISOString(),
  dbStatus: 'synced' // 'synced' | 'saving'
}

export const useCVStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      // Guest User Account
      setGuestUser: (user) => {
        const parts = (user.name || '').trim().split(/\s+/)
        const firstName = parts[0] || ''
        const lastName = parts.slice(1).join(' ') || ''
        set((state) => ({
          guestUser: {
            ...state.guestUser,
            ...user
          },
          personalInfo: {
            ...state.personalInfo,
            firstName: firstName || state.personalInfo.firstName,
            lastName: lastName || state.personalInfo.lastName,
            title: user.title || state.personalInfo.title,
            email: user.email || state.personalInfo.email,
            avatar: user.avatar || state.personalInfo.avatar
          },
          lastSavedAt: new Date().toISOString()
        }))
      },

      // Settings
      setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId, lastSavedAt: new Date().toISOString() }),
      setAccentColor: (color) => set({ accentColor: color, lastSavedAt: new Date().toISOString() }),
      setFontFamily: (font) => set({ fontFamily: font, lastSavedAt: new Date().toISOString() }),
      setZoomLevel: (zoom) => set({ zoomLevel: Math.max(0.5, Math.min(1.4, zoom)) }),
      setSpacing: (spacing) => set({ spacing, lastSavedAt: new Date().toISOString() }),
      setShowPageBreaks: (show) => set({ showPageBreaks: show }),
      togglePageBreaks: () => set((state) => ({ showPageBreaks: !state.showPageBreaks })),

      // Personal Info
      updatePersonalInfo: (field, value) => set((state) => ({
        personalInfo: { ...state.personalInfo, [field]: value },
        lastSavedAt: new Date().toISOString()
      })),

      // Experiences CRUD
      addExperience: () => set((state) => ({
        experiences: [
          ...state.experiences,
          {
            id: Date.now(),
            title: 'Nouveau Poste',
            company: 'Entreprise',
            startDate: '2023',
            endDate: 'Présent',
            description: 'Description de vos missions et réalisations...'
          }
        ],
        lastSavedAt: new Date().toISOString()
      })),

      updateExperience: (id, field, value) => set((state) => ({
        experiences: state.experiences.map((exp) => 
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
        lastSavedAt: new Date().toISOString()
      })),

      removeExperience: (id) => set((state) => ({
        experiences: state.experiences.filter((exp) => exp.id !== id),
        lastSavedAt: new Date().toISOString()
      })),

      // Education CRUD
      addEducation: () => set((state) => ({
        education: [
          ...state.education,
          {
            id: Date.now(),
            degree: 'Nouveau Diplôme',
            school: 'École / Université',
            startDate: '2020',
            endDate: '2023',
            description: ''
          }
        ],
        lastSavedAt: new Date().toISOString()
      })),

      updateEducation: (id, field, value) => set((state) => ({
        education: state.education.map((edu) => 
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
        lastSavedAt: new Date().toISOString()
      })),

      removeEducation: (id) => set((state) => ({
        education: state.education.filter((edu) => edu.id !== id),
        lastSavedAt: new Date().toISOString()
      })),

      // Skills CRUD
      addSkill: (skillName) => set((state) => {
        if (!skillName || state.skills.includes(skillName.trim())) return state
        return { 
          skills: [...state.skills, skillName.trim()],
          lastSavedAt: new Date().toISOString()
        }
      }),

      removeSkill: (skillToRemove) => set((state) => ({
        skills: state.skills.filter((s) => s !== skillToRemove),
        lastSavedAt: new Date().toISOString()
      })),

      // Languages CRUD
      addLanguage: () => set((state) => ({
        languages: [
          ...state.languages,
          {
            id: Date.now(),
            name: 'Nouvelle Langue',
            level: 'Intermédiaire (B2)'
          }
        ],
        lastSavedAt: new Date().toISOString()
      })),

      updateLanguage: (id, field, value) => set((state) => ({
        languages: state.languages.map((lang) => 
          lang.id === id ? { ...lang, [field]: value } : lang
        ),
        lastSavedAt: new Date().toISOString()
      })),

      removeLanguage: (id) => set((state) => ({
        languages: state.languages.filter((lang) => lang.id !== id),
        lastSavedAt: new Date().toISOString()
      })),

      // Embedded Database Multi-CV Actions
      createNewCV: () => {
        const newId = `cv_${Date.now()}`
        set({
          ...defaultState,
          activeCVId: newId,
          personalInfo: {
            ...defaultState.personalInfo,
            firstName: '',
            lastName: ''
          },
          lastSavedAt: new Date().toISOString()
        })
      },

      loadCVFromData: (data) => {
        set({
          ...data,
          lastSavedAt: new Date().toISOString()
        })
      },

      resetToDefault: () => {
        set({
          ...defaultState,
          lastSavedAt: new Date().toISOString()
        })
      }
    }),
    {
      name: 'douzcv_embedded_storage', // Key for embedded local persistence
      storage: createJSONStorage(() => localStorage),
      version: 1, // Bump version to force clear old prefilled states
    }
  )
)
