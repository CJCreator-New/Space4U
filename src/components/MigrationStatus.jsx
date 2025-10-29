import { useState, useEffect } from 'react'
import { CheckCircle, Upload, AlertCircle } from '../config/icons'
import { fullMigrationService } from '../services/fullMigrationService'
import { useSupabaseAuth } from '../contexts/AuthContext'

function MigrationStatus() {
  const { user } = useSupabaseAuth()
  const [status, setStatus] = useState(null)
  const [migrating, setMigrating] = useState(false)

  useEffect(() => {
    if (user && !fullMigrationService.isMigrationComplete()) {
      checkMigrationNeeded()
    }
  }, [user])

  function checkMigrationNeeded() {
    const hasMoods = localStorage.getItem('safespace_moods')
    const hasProfile = localStorage.getItem('safespace_user_profile')
    const hasBadges = localStorage.getItem('safespace_badges')
    
    if (hasMoods || hasProfile || hasBadges) {
      setStatus('needed')
    }
  }

  async function handleMigrate() {
    setMigrating(true)
    try {
      const results = await fullMigrationService.migrateAllData(user.id)
      setStatus('complete')
      console.log('Migration complete:', results)
    } catch (error) {
      setStatus('error')
      console.error('Migration failed:', error)
    }
    setMigrating(false)
  }

  if (!user || fullMigrationService.isMigrationComplete() || !status) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-sm border-2 border-primary/20 z-50">
      {status === 'needed' && (
        <>
          <div className="flex items-start gap-3 mb-3">
            <Upload className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-text-primary">Sync Your Data</h3>
              <p className="text-sm text-text-secondary mt-1">
                We found local data. Sync it to access across devices.
              </p>
            </div>
          </div>
          <button
            onClick={handleMigrate}
            disabled={migrating}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {migrating ? 'Syncing...' : 'Sync Now'}
          </button>
        </>
      )}
      
      {status === 'complete' && (
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Data synced successfully!</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Sync failed. Try again later.</span>
        </div>
      )}
    </div>
  )
}

export default MigrationStatus
