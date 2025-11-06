import { useState } from 'react'
import { Cloud, Download, Upload, CheckCircle, AlertTriangle, Loader } from 'lucide-react'
import { storage } from '../services/storage'
import { LocalStorageAdapter } from '../services/storage/LocalStorageAdapter'
import { SupabaseAdapter } from '../services/storage/SupabaseAdapter'
import { createBackup } from '../utils/backup'

function MigrationWizard({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backup, setBackup] = useState(null)
  const [conflicts, setConflicts] = useState([])
  const [migrationComplete, setMigrationComplete] = useState(false)

  const handleBackup = () => {
    setLoading(true)
    try {
      const backupData = createBackup()
      setBackup(backupData)
      setStep(2)
    } catch (err) {
      setError('Failed to create backup: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDryRun = async () => {
    setLoading(true)
    setError('')
    try {
      const local = new LocalStorageAdapter()
      const remote = new SupabaseAdapter()
      
      const isHealthy = await remote.healthCheck()
      if (!isHealthy) {
        throw new Error('Backend is not available')
      }

      const keys = await local.getKeys('space4u_')
      const foundConflicts = []

      for (const key of keys) {
        const localData = await local.get(key)
        const remoteData = await remote.get(key)
        
        if (remoteData && JSON.stringify(localData) !== JSON.stringify(remoteData)) {
          foundConflicts.push({ key, local: localData, remote: remoteData })
        }
      }

      setConflicts(foundConflicts)
      setStep(3)
    } catch (err) {
      setError('Dry run failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMigrate = async () => {
    setLoading(true)
    setError('')
    try {
      const local = new LocalStorageAdapter()
      const remote = new SupabaseAdapter()
      
      const keys = await local.getKeys('space4u_')
      
      for (const key of keys) {
        const data = await local.get(key)
        await remote.set(key, data)
      }

      setMigrationComplete(true)
      setStep(4)
    } catch (err) {
      setError('Migration failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Backend Migration Wizard</h2>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Backup */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Download className="text-primary" size={32} />
                <div>
                  <h3 className="text-xl font-semibold">Create Backup</h3>
                  <p className="text-text-secondary">Backup your data before migration</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-yellow-900">Important</p>
                    <p className="text-sm text-yellow-800">
                      This will create a backup of all your local data. Keep this file safe in case you need to rollback.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBackup}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : 'Create Backup'}
              </button>
            </div>
          )}

          {/* Step 2: Dry Run */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Cloud className="text-primary" size={32} />
                <div>
                  <h3 className="text-xl font-semibold">Check Compatibility</h3>
                  <p className="text-text-secondary">Verify backend connection</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-green-900">Backup Created</p>
                    <p className="text-sm text-green-800">
                      Your data has been backed up successfully.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDryRun}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : 'Run Compatibility Check'}
              </button>
            </div>
          )}

          {/* Step 3: Review Conflicts */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Upload className="text-primary" size={32} />
                <div>
                  <h3 className="text-xl font-semibold">Review & Migrate</h3>
                  <p className="text-text-secondary">
                    {conflicts.length > 0 ? `${conflicts.length} conflicts found` : 'No conflicts detected'}
                  </p>
                </div>
              </div>
              {conflicts.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                  {conflicts.map((conflict, idx) => (
                    <div key={idx} className="mb-2 text-sm">
                      <p className="font-medium">{conflict.key}</p>
                      <p className="text-yellow-800">Local and remote data differ</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleMigrate}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : 'Start Migration'}
              </button>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && migrationComplete && (
            <div className="text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold mb-2">Migration Complete!</h3>
              <p className="text-text-secondary mb-6">
                Your data has been successfully migrated to the backend.
              </p>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Cancel Button */}
          {step < 4 && (
            <button
              onClick={onClose}
              className="w-full mt-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MigrationWizard
