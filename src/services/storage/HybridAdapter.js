import { StorageAdapter } from './StorageAdapter'
import { LocalStorageAdapter } from './LocalStorageAdapter'
import { SupabaseAdapter } from './SupabaseAdapter'

/**
 * Hybrid Storage Adapter
 * Uses remote when available, falls back to local
 * Implements sync queue for offline support
 */
export class HybridAdapter extends StorageAdapter {
  constructor() {
    super()
    this.local = new LocalStorageAdapter()
    this.remote = new SupabaseAdapter()
    this.syncQueue = []
  }

  async get(key) {
    try {
      // Try remote first if healthy
      const isHealthy = await this.remote.healthCheck()
      if (isHealthy) {
        const remoteData = await this.remote.get(key)
        if (remoteData !== null) {
          // Cache in local storage
          await this.local.set(key, remoteData)
          return remoteData
        }
      }
    } catch (error) {
      console.warn('Remote get failed, using local:', error)
    }

    // Fallback to local
    return await this.local.get(key)
  }

  async set(key, value) {
    // Always write to local immediately
    await this.local.set(key, value)

    try {
      // Try to write to remote
      const isHealthy = await this.remote.healthCheck()
      if (isHealthy) {
        await this.remote.set(key, value)
      } else {
        // Queue for later sync
        this.queueSync(key, value)
      }
    } catch (error) {
      console.warn('Remote set failed, queued for sync:', error)
      this.queueSync(key, value)
    }
  }

  async remove(key) {
    await this.local.remove(key)
    
    try {
      const isHealthy = await this.remote.healthCheck()
      if (isHealthy) {
        await this.remote.remove(key)
      }
    } catch (error) {
      console.warn('Remote remove failed:', error)
    }
  }

  async getKeys(prefix = '') {
    try {
      const isHealthy = await this.remote.healthCheck()
      if (isHealthy) {
        return await this.remote.getKeys(prefix)
      }
    } catch (error) {
      console.warn('Remote getKeys failed, using local:', error)
    }
    
    return await this.local.getKeys(prefix)
  }

  async clear() {
    await this.local.clear()
    
    try {
      const isHealthy = await this.remote.healthCheck()
      if (isHealthy) {
        await this.remote.clear()
      }
    } catch (error) {
      console.warn('Remote clear failed:', error)
    }
  }

  async healthCheck() {
    const localHealthy = await this.local.healthCheck()
    const remoteHealthy = await this.remote.healthCheck()
    return localHealthy || remoteHealthy
  }

  queueSync(key, value) {
    this.syncQueue.push({ key, value, timestamp: Date.now() })
    this.saveSyncQueue()
  }

  saveSyncQueue() {
    localStorage.setItem('space4u_sync_queue', JSON.stringify(this.syncQueue))
  }

  async processSyncQueue() {
    const isHealthy = await this.remote.healthCheck()
    if (!isHealthy) return

    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift()
      try {
        await this.remote.set(item.key, item.value)
      } catch (error) {
        console.error('Sync failed for item:', item, error)
        this.syncQueue.unshift(item)
        break
      }
    }
    
    this.saveSyncQueue()
  }
}
