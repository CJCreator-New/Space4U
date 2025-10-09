// Data Export/Import Utilities

export const exportAllData = () => {
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    moods: JSON.parse(localStorage.getItem('safespace_moods') || '{}'),
    user: JSON.parse(localStorage.getItem('safespace_user') || '{}'),
    badges: JSON.parse(localStorage.getItem('safespace_badges') || '{}'),
    settings: JSON.parse(localStorage.getItem('safespace_settings') || '{}'),
    premium: JSON.parse(localStorage.getItem('safespace_premium') || '{}'),
    habits: JSON.parse(localStorage.getItem('safespace_habits') || '[]'),
    gratitude: JSON.parse(localStorage.getItem('safespace_gratitude') || '[]'),
    journal: JSON.parse(localStorage.getItem('safespace_journal') || '[]')
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `space4u-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  return true
}

export const exportMoodsToCSV = () => {
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  const entries = Object.entries(moods).map(([date, mood]) => ({
    date,
    mood: mood.mood,
    label: mood.label,
    note: mood.note || '',
    timestamp: mood.timestamp
  }))
  
  const csv = [
    ['Date', 'Mood', 'Label', 'Note', 'Timestamp'],
    ...entries.map(e => [e.date, e.mood, e.label, `"${e.note.replace(/"/g, '""')}"`, e.timestamp])
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `space4u-moods-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
  
  return true
}

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate data structure
        if (!data.version || !data.exportDate) {
          throw new Error('Invalid backup file format')
        }
        
        // Merge with existing data
        const keys = ['moods', 'user', 'badges', 'settings', 'premium', 'habits', 'gratitude', 'journal']
        keys.forEach(key => {
          if (data[key]) {
            const existing = JSON.parse(localStorage.getItem(`safespace_${key}`) || (Array.isArray(data[key]) ? '[]' : '{}'))
            const merged = Array.isArray(data[key]) 
              ? [...existing, ...data[key]]
              : { ...existing, ...data[key] }
            localStorage.setItem(`safespace_${key}`, JSON.stringify(merged))
          }
        })
        
        resolve({ success: true, imported: keys.filter(k => data[k]).length })
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export const generateWeeklyReport = () => {
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const weekMoods = Object.entries(moods)
    .filter(([date]) => new Date(date) >= weekAgo)
    .map(([date, mood]) => ({ date, ...mood }))
  
  if (weekMoods.length === 0) return null
  
  const avg = weekMoods.reduce((sum, m) => sum + m.mood, 0) / weekMoods.length
  const best = weekMoods.reduce((max, m) => m.mood > max.mood ? m : max)
  const worst = weekMoods.reduce((min, m) => m.mood < min.mood ? m : min)
  
  return {
    period: 'Last 7 Days',
    entries: weekMoods.length,
    average: avg.toFixed(1),
    best: { date: best.date, mood: best.mood, label: best.label },
    worst: { date: worst.date, mood: worst.mood, label: worst.label },
    consistency: ((weekMoods.length / 7) * 100).toFixed(0)
  }
}

export const generateMonthlyReport = () => {
  const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const monthMoods = Object.entries(moods)
    .filter(([date]) => new Date(date) >= monthAgo)
    .map(([date, mood]) => ({ date, ...mood }))
  
  if (monthMoods.length === 0) return null
  
  const avg = monthMoods.reduce((sum, m) => sum + m.mood, 0) / monthMoods.length
  const best = monthMoods.reduce((max, m) => m.mood > max.mood ? m : max)
  const worst = monthMoods.reduce((min, m) => m.mood < min.mood ? m : min)
  
  return {
    period: 'Last 30 Days',
    entries: monthMoods.length,
    average: avg.toFixed(1),
    best: { date: best.date, mood: best.mood, label: best.label },
    worst: { date: worst.date, mood: worst.mood, label: worst.label },
    consistency: ((monthMoods.length / 30) * 100).toFixed(0)
  }
}
