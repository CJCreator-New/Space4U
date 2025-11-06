/**
 * Storage Adapter Interface
 * Abstract interface for data persistence - allows switching between localStorage and backend
 */

export class StorageAdapter {
  /**
   * Get data by key
   * @param {string} key - Storage key
   * @returns {Promise<any>} - Parsed data or null
   */
  async get(key) {
    throw new Error('StorageAdapter.get() must be implemented')
  }

  /**
   * Set data by key
   * @param {string} key - Storage key
   * @param {any} value - Data to store (will be JSON serialized)
   * @returns {Promise<void>}
   */
  async set(key, value) {
    throw new Error('StorageAdapter.set() must be implemented')
  }

  /**
   * Remove data by key
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  async remove(key) {
    throw new Error('StorageAdapter.remove() must be implemented')
  }

  /**
   * Get all keys matching a prefix
   * @param {string} prefix - Key prefix to match
   * @returns {Promise<string[]>} - Array of matching keys
   */
  async getKeys(prefix = '') {
    throw new Error('StorageAdapter.getKeys() must be implemented')
  }

  /**
   * Clear all data (use with caution)
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error('StorageAdapter.clear() must be implemented')
  }

  /**
   * Check if adapter is healthy and connected
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    return true
  }
}
