// Consolidated Export Utility - Single Source of Truth

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const exportJSON = (data, filename) => {
  downloadFile(
    JSON.stringify(data, null, 2),
    filename || `space4u-${Date.now()}.json`,
    'application/json'
  )
}

export const exportCSV = (rows, filename) => {
  const csv = rows.map(row => row.join(',')).join('\n')
  downloadFile(
    csv,
    filename || `space4u-${Date.now()}.csv`,
    'text/csv'
  )
}

export const collectAllData = () => ({
  version: '1.0.0',
  exportDate: new Date().toISOString(),
  moods: JSON.parse(localStorage.getItem('space4u_moods') || '{}'),
  user: JSON.parse(localStorage.getItem('space4u_user') || '{}'),
  badges: JSON.parse(localStorage.getItem('space4u_badges') || '{}'),
  settings: JSON.parse(localStorage.getItem('space4u_settings') || '{}'),
  habits: JSON.parse(localStorage.getItem('space4u_habits') || '[]'),
  gratitude: JSON.parse(localStorage.getItem('space4u_gratitude') || '[]'),
  journal: JSON.parse(localStorage.getItem('space4u_journal') || '[]')
})
