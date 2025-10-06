import { Edit2, Trash2, Calendar } from 'lucide-react'

function GratitudeCard({ entry, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(entry.date)}</span>
          <span className="text-2xl ml-2">{['😔', '😕', '😊', '😄', '🤩'][entry.mood_rating - 1]}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(entry)} className="p-2 hover:bg-hover rounded-lg">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(entry.date)} className="p-2 hover:bg-hover rounded-lg text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {entry.items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xl">✨</span>
            <p className="text-text-primary flex-1">{item}</p>
          </div>
        ))}
      </div>

      {entry.notes && (
        <div className="pt-4 border-t border-border">
          <p className="text-text-secondary text-sm italic">{entry.notes}</p>
        </div>
      )}
    </div>
  )
}

export default GratitudeCard
