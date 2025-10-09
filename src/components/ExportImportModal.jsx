import { useState } from 'react'
import { X, Download, Upload, FileJson, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { exportAllData, exportMoodsToCSV, importData } from '../utils/dataExport'

function ExportImportModal({ isOpen, onClose }) {
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState(null)

  if (!isOpen) return null

  const handleExportJSON = () => {
    try {
      exportAllData()
      setMessage({ type: 'success', text: 'Data exported successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Export failed. Please try again.' })
    }
  }

  const handleExportCSV = () => {
    try {
      exportMoodsToCSV()
      setMessage({ type: 'success', text: 'Moods exported to CSV!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Export failed. Please try again.' })
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImporting(true)
    try {
      const result = await importData(file)
      setMessage({ type: 'success', text: `Imported ${result.imported} data categories!` })
      setTimeout(() => {
        setMessage(null)
        window.location.reload()
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Import failed' })
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary dark:text-white">Export & Import</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Export Section */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-white mb-3 flex items-center gap-2">
              <Download size={20} />
              Export Your Data
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleExportJSON}
                className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl flex items-center gap-3 transition-colors"
              >
                <FileJson className="text-blue-600 dark:text-blue-400" size={24} />
                <div className="text-left flex-1">
                  <div className="font-medium text-text-primary dark:text-white">Complete Backup (JSON)</div>
                  <div className="text-sm text-text-secondary dark:text-gray-400">All data including moods, badges, settings</div>
                </div>
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl flex items-center gap-3 transition-colors"
              >
                <FileSpreadsheet className="text-green-600 dark:text-green-400" size={24} />
                <div className="text-left flex-1">
                  <div className="font-medium text-text-primary dark:text-white">Mood Data (CSV)</div>
                  <div className="text-sm text-text-secondary dark:text-gray-400">Spreadsheet format for analysis</div>
                </div>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="pt-4 border-t dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-3 flex items-center gap-2">
              <Upload size={20} />
              Import Data
            </h3>
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
              <div className={`w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                importing 
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'border-primary hover:border-primary-dark hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}>
                <Upload className="mx-auto mb-2 text-primary" size={32} />
                <div className="font-medium text-text-primary dark:text-white">
                  {importing ? 'Importing...' : 'Click to select backup file'}
                </div>
                <div className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                  JSON files only
                </div>
              </div>
            </label>
          </div>

          <div className="text-xs text-text-secondary dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
            💡 <strong>Tip:</strong> Export regularly to backup your data. Import will merge with existing data.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportImportModal
