import { useState } from 'react'
import { Download, FileText, Table, Code } from 'lucide-react'

function DataExport() {
  const [selectedTypes, setSelectedTypes] = useState(['moods', 'habits', 'gratitude'])
  const [format, setFormat] = useState('json')

  const dataTypes = [
    { id: 'moods', label: 'Mood Logs', count: Object.keys(JSON.parse(localStorage.getItem('space4u_moods') || '{}')).length },
    { id: 'habits', label: 'Habits', count: JSON.parse(localStorage.getItem('space4u_habits') || '[]').length },
    { id: 'gratitude', label: 'Gratitude Entries', count: JSON.parse(localStorage.getItem('space4u_gratitude_entries') || '[]').length },
    { id: 'emotions', label: 'Emotion Logs', count: JSON.parse(localStorage.getItem('space4u_emotion_logs') || '[]').length },
    { id: 'triggers', label: 'Triggers', count: JSON.parse(localStorage.getItem('space4u_triggers') || '[]').length },
    { id: 'journal', label: 'Journal Entries', count: JSON.parse(localStorage.getItem('space4u_journal_entries') || '[]').length }
  ]

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const exportData = () => {
    const data = {}
    selectedTypes.forEach(type => {
      const key = `space4u_${type}`
      data[type] = JSON.parse(localStorage.getItem(key) || '{}')
    })

    const exportObj = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data
    }

    let content, filename, mimeType

    if (format === 'json') {
      content = JSON.stringify(exportObj, null, 2)
      filename = `space4u-export-${Date.now()}.json`
      mimeType = 'application/json'
    } else if (format === 'csv') {
      content = convertToCSV(data)
      filename = `space4u-export-${Date.now()}.csv`
      mimeType = 'text/csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    const logs = JSON.parse(localStorage.getItem('space4u_export_logs') || '[]')
    logs.push({ date: new Date().toISOString(), format, types: selectedTypes })
    localStorage.setItem('space4u_export_logs', JSON.stringify(logs))
  }

  const convertToCSV = (data) => {
    let csv = 'Type,Date,Data\n'
    Object.entries(data).forEach(([type, entries]) => {
      const items = Array.isArray(entries) ? entries : Object.values(entries)
      items.forEach(item => {
        csv += `${type},${item.date || item.created_at || ''},${JSON.stringify(item).replace(/"/g, '""')}\n`
      })
    })
    return csv
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Export Your Data</h3>
        <p className="text-sm text-text-secondary mb-6">
          Download your mental health data for backup or to share with healthcare providers
        </p>

        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Select Data Types</h4>
          <div className="space-y-2">
            {dataTypes.map(type => (
              <label key={type.id} className="flex items-center gap-3 p-3 bg-background rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => toggleType(type.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <span className="font-medium text-text-primary">{type.label}</span>
                  <span className="text-sm text-text-secondary ml-2">({type.count} items)</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Export Format</h4>
          <div className="flex gap-3">
            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                format === 'json' ? 'bg-primary text-white' : 'bg-background text-text-secondary'
              }`}
            >
              <Code size={18} />
              JSON
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                format === 'csv' ? 'bg-primary text-white' : 'bg-background text-text-secondary'
              }`}
            >
              <Table size={18} />
              CSV
            </button>
          </div>
        </div>

        <button
          onClick={exportData}
          disabled={selectedTypes.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          <Download size={20} />
          Export Data ({selectedTypes.length} types)
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2"> Data Privacy</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your data is stored locally on your device</li>
          <li>• Exports are generated in your browser</li>
          <li>• No data is sent to external servers</li>
          <li>• Keep exported files secure</li>
        </ul>
      </div>
    </div>
  )
}

export default DataExport

