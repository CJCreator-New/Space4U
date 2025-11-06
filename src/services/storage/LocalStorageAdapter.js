import { StorageAdapter } from './StorageAdapter'

/**
 * LocalStorage Adapter
 * Wraps existing localStorage functionality in the adapter interface
 */
export class LocalStorageAdapter extends StorageAdapter {
  async get(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`LocalStorageAdapter.get error for key ${key}:`, error)
      return null
    }
  }

  async set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`LocalStorageAdapter.set error for key ${key}:`, error)
      throw error
    }
  }

  async remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`LocalStorageAdapter.remove error for key ${key}:`, error)
      throw error
    }
  }

  async getKeys(prefix = '') {
    try {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          keys.push(key)
        }
      }
      return keys
    } catch (error) {
      console.error('LocalStorageAdapter.getKeys error:', error)
      return []
    }
  }

  async clear() {
    try {
      const keys = await this.getKeys('space4u_')
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('LocalStorageAdapter.clear error:', error)
      throw error
    }
  }

  async healthCheck() {
    try {
      const testKey = 'space4u_health_check'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}
