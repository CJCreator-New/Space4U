const LEGACY_PREFIX = 'safespace_'
const CURRENT_PREFIX = 'space4u_'
const MIGRATION_FLAG = 'space4u_namespace_migrated'
const SESSION_MIGRATION_FLAG = 'space4u_session_namespace_migrated'

const migrateStorage = (storage, flagKey) => {
  if (typeof window === 'undefined' || !storage) {
    return
  }

  try {
    if (storage.getItem(flagKey) === 'true') {
      return
    }

    const legacyKeys = []
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (key && key.startsWith(LEGACY_PREFIX)) {
        legacyKeys.push(key)
      }
    }

    legacyKeys.forEach((legacyKey) => {
      const legacyValue = storage.getItem(legacyKey)
      if (legacyValue === null) {
        return
      }

      const newKey = `${CURRENT_PREFIX}${legacyKey.slice(LEGACY_PREFIX.length)}`
      if (storage.getItem(newKey) === null) {
        storage.setItem(newKey, legacyValue)
      }
    })

    if (legacyKeys.length > 0) {
      storage.setItem(flagKey, 'true')
    } else {
      // Mark as migrated to avoid repeated scans on fresh installs
      storage.setItem(flagKey, 'true')
    }
  } catch (error) {
    console.error('Namespace migration failed', error)
  }
}

export const migrateLegacyStorageNamespace = () => {
  if (typeof window === 'undefined') {
    return
  }

  migrateStorage(window.localStorage, MIGRATION_FLAG)
  migrateStorage(window.sessionStorage, SESSION_MIGRATION_FLAG)
}
