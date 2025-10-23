// Safe localStorage wrapper with error handling

export const safeStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
      return { success: true }
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('❌ Storage quota exceeded')
        return { success: false, error: 'QUOTA_EXCEEDED' }
      }
      console.error('❌ Storage error:', e)
      return { success: false, error: e.message }
    }
  },
  
  getItem: (key, defaultValue = null) => {
    try {
      return localStorage.getItem(key) || defaultValue
    } catch (e) {
      console.error('❌ Storage read error:', e)
      return defaultValue
    }
  },
  
  getJSON: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error('❌ Storage JSON parse error:', e)
      return defaultValue
    }
  },
  
  setJSON: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return { success: true }
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('❌ Storage quota exceeded')
        return { success: false, error: 'QUOTA_EXCEEDED' }
      }
      console.error('❌ Storage error:', e)
      return { success: false, error: e.message }
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return { success: true }
    } catch (e) {
      console.error('❌ Storage remove error:', e)
      return { success: false, error: e.message }
    }
  }
}
