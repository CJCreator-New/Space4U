import jsPDF from 'jspdf'

export function generateMoodReport(startDate, endDate) {
  const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
  const user = JSON.parse(localStorage.getItem('space4u_user') || '{}')
  
  const filteredMoods = Object.entries(moods)
    .filter(([date]) => {
      const d = new Date(date)
      return d >= new Date(startDate) && d <= new Date(endDate)
    })
    .sort(([a], [b]) => new Date(a) - new Date(b))

  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text('Space4U Mood Report', 20, 20)
  
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30)
  doc.text(`Period: ${startDate} to ${endDate}`, 20, 36)
  doc.text(`User: ${user.username || 'Anonymous'}`, 20, 42)
  
  // Summary
  doc.setFontSize(14)
  doc.text('Summary', 20, 55)
  
  const avgMood = filteredMoods.reduce((sum, [, m]) => sum + m.mood, 0) / filteredMoods.length
  doc.setFontSize(10)
  doc.text(`Total Entries: ${filteredMoods.length}`, 20, 65)
  doc.text(`Average Mood: ${avgMood.toFixed(1)}/5`, 20, 71)
  
  // Mood Entries
  doc.setFontSize(14)
  doc.text('Mood Log', 20, 85)
  
  let y = 95
  doc.setFontSize(9)
  
  filteredMoods.forEach(([date, mood]) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(`${date}: ${mood.emoji} ${mood.mood}/5 - ${mood.label}`, 20, y)
    if (mood.note) {
      y += 5
      doc.text(`  Note: ${mood.note.substring(0, 80)}`, 20, y)
    }
    y += 7
  })
  
  // Footer
  doc.setFontSize(8)
  doc.text('Space4U - Your Mental Health Companion', 20, 285)
  
  return doc
}

export function downloadPDF(doc, filename) {
  doc.save(filename)
}
