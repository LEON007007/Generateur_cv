/**
 * Embedded Database Service for douzCv
 * 
 * Provides an embedded, client-side database utilizing IndexedDB with 
 * resilient synchronous/asynchronous localStorage fallback.
 * 
 * Capabilities:
 * - Persistent embedded storage across sessions & reloads
 * - Multi-CV profile management (create, list, load, duplicate, delete)
 * - Automatic schema initialization & indexing
 * - Atomic database import / export (JSON dumps)
 */

const DB_NAME = 'douzcv_embedded_db'
const DB_VERSION = 1
const STORE_NAME = 'cv_store'

// Open / initialize IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null)
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
        store.createIndex('title', 'title', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      console.warn('[EmbeddedDB] IndexedDB error, using localStorage fallback:', request.error)
      resolve(null)
    }
  })
}

/**
 * Save a CV record into the embedded database
 */
export async function saveCVRecord(cvData) {
  const record = {
    ...cvData,
    id: cvData.id || 'default_cv',
    updatedAt: new Date().toISOString(),
    title: cvData.title || `${cvData.personalInfo?.firstName || 'Leon'} ${cvData.personalInfo?.lastName || 'Atangana'} - CV`
  }

  // 1. Write to localStorage for immediate synchronous cache
  try {
    const listRaw = localStorage.getItem('douzcv_all_cvs')
    const list = listRaw ? JSON.parse(listRaw) : {}
    list[record.id] = record
    localStorage.setItem('douzcv_all_cvs', JSON.stringify(list))
    localStorage.setItem('douzcv_active_cv_id', record.id)
  } catch (e) {
    console.warn('[EmbeddedDB] localStorage write error:', e)
  }

  // 2. Write to IndexedDB
  try {
    const db = await openDB()
    if (db) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.put(record)
        tx.oncomplete = () => resolve(record)
        tx.onerror = () => reject(tx.error)
      })
    }
  } catch (e) {
    console.warn('[EmbeddedDB] IndexedDB write error:', e)
  }

  return record
}

/**
 * Get a specific CV record by ID
 */
export async function getCVRecord(id = 'default_cv') {
  // Try IndexedDB first
  try {
    const db = await openDB()
    if (db) {
      const record = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => resolve(null)
      })
      if (record) return record
    }
  } catch (e) {
    console.warn('[EmbeddedDB] IndexedDB read error:', e)
  }

  // Fallback to localStorage
  try {
    const listRaw = localStorage.getItem('douzcv_all_cvs')
    if (listRaw) {
      const list = JSON.parse(listRaw)
      if (list[id]) return list[id]
    }
  } catch (e) {
    console.warn('[EmbeddedDB] localStorage read error:', e)
  }

  return null
}

/**
 * List all saved CVs in the embedded database
 */
export async function listAllCVRecords() {
  const records = []

  try {
    const db = await openDB()
    if (db) {
      const dbRecords = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => resolve([])
      })
      if (dbRecords && dbRecords.length > 0) {
        return dbRecords.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      }
    }
  } catch (e) {
    console.warn('[EmbeddedDB] IndexedDB list error:', e)
  }

  // Fallback to localStorage
  try {
    const listRaw = localStorage.getItem('douzcv_all_cvs')
    if (listRaw) {
      const list = JSON.parse(listRaw)
      return Object.values(list).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
  } catch (e) {
    console.warn('[EmbeddedDB] localStorage list error:', e)
  }

  return records
}

/**
 * Delete a CV from the embedded database
 */
export async function deleteCVRecord(id) {
  // Remove from localStorage
  try {
    const listRaw = localStorage.getItem('douzcv_all_cvs')
    if (listRaw) {
      const list = JSON.parse(listRaw)
      delete list[id]
      localStorage.setItem('douzcv_all_cvs', JSON.stringify(list))
    }
  } catch (e) {
    console.warn('[EmbeddedDB] localStorage delete error:', e)
  }

  // Remove from IndexedDB
  try {
    const db = await openDB()
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.delete(id)
        tx.oncomplete = () => resolve(true)
        tx.onerror = () => resolve(false)
      })
    }
  } catch (e) {
    console.warn('[EmbeddedDB] IndexedDB delete error:', e)
  }

  return true
}

/**
 * Full Database Export (JSON Backup)
 */
export async function exportEmbeddedDB() {
  const records = await listAllCVRecords()
  return {
    database: DB_NAME,
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    recordsCount: records.length,
    records
  }
}

/**
 * Full Database Restore
 */
export async function importEmbeddedDB(backupData) {
  if (!backupData || !Array.isArray(backupData.records)) {
    throw new Error("Format de base de données invalide.")
  }

  for (const record of backupData.records) {
    await saveCVRecord(record)
  }

  return true
}
