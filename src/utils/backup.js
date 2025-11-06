/**
 * Backup & Migration Utilities
 * Safe data backup and restoration for migration safety
 */

/**
 * Create a complete backup of all Space4U data
 * @returns {Object} Backup object with all localStorage data
 */
export function createBackup() {
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: {}
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('space4u_')) {
      backup.data[key] = localStorage.getItem(key)
    }
  }

  return backup
}

/**
 * Export backup as downloadable JSON file
 */
export function exportBackup() {
  const backup = createBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `space4u-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Restore data from backup
 * @param {Object} backup - Backup object
 * @returns {boolean} Success status
 */
export function restoreBackup(backup) {
  try {
    if (!backup.data) throw new Error('Invalid backup format')

    Object.entries(backup.data).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })

    return true
  } catch (error) {
    console.error('Restore backup error:', error)
    return false
  }
}

/**
 * Emergency rollback to localStorage mode
 */
export function emergencyRollback() {
  localStorage.setItem('space4u_feature_USE_BACKEND', 'false')
  localStorage.setItem('space4u_emergency_mode', 'true')
  window.location.reload()
}
