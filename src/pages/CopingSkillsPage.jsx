import { useState } from 'react'
import { Search, Heart, Star } from 'lucide-react'

const SKILLS = [
  { id: 1, name: 'Deep Breathing', category: 'relaxation', situation: ['anxiety', 'stress'], duration: 5, description: '4-7-8 breathing technique' },
  { id: 2, name: '5-4-3-2-1 Grounding', category: 'grounding', situation: ['anxiety', 'panic'], duration: 5, description: 'Sensory grounding technique' },
  { id: 3, name: 'Progressive Muscle Relaxation', category: 'relaxation', situation: ['anxiety', 'stress'], duration: 15, description: 'Tense and release muscles' },
  { id: 4, name: 'Call a Friend', category: 'social', situation: ['loneliness', 'sadness'], duration: 20, description: 'Reach out for support' },
  { id: 5, name: 'Go for a Walk', category: 'physical', situation: ['stress', 'anger'], duration: 15, description: 'Physical activity outdoors' },
  { id: 6, name: 'Journaling', category: 'distraction', situation: ['overwhelm', 'confusion'], duration: 10, description: 'Write down thoughts' },
  { id: 7, name: 'Listen to Music', category: 'distraction', situation: ['stress', 'sadness'], duration: 10, description: 'Calming playlist' },
  { id: 8, name: 'Cold Water Splash', category: 'grounding', situation: ['panic', 'overwhelm'], duration: 2, description: 'Splash face with cold water' },
  { id: 9, name: 'Mindful Observation', category: 'grounding', situation: ['anxiety', 'racing thoughts'], duration: 5, description: 'Focus on one object' },
  { id: 10, name: 'Body Scan', category: 'relaxation', situation: ['stress', 'insomnia'], duration: 10, description: 'Mental body scan' }
]

function CopingSkillsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('safespace_favorite_coping_skills')
    return saved ? JSON.parse(saved) : []
  })

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(updated)
    localStorage.setItem('safespace_favorite_coping_skills', JSON.stringify(updated))
  }

  const filtered = SKILLS.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || skill.category === filter || skill.situation.includes(filter)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coping Skills Library</h1>
        <p className="text-text-secondary">Evidence-based strategies for managing difficult emotions</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-10"
            placeholder="Search coping skills..."
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === 'all' ? 'bg-primary text-white' : 'bg-hover'}`}
          >
            All
          </button>
          {['anxiety', 'stress', 'sadness', 'anger', 'panic'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filter === cat ? 'bg-primary text-white' : 'bg-hover'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(skill => (
          <div key={skill.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{skill.name}</h3>
              <button
                onClick={() => toggleFavorite(skill.id)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className={`w-5 h-5 ${favorites.includes(skill.id) ? 'fill-yellow-500 text-yellow-500' : 'text-text-secondary'}`} />
              </button>
            </div>
            <p className="text-text-secondary text-sm mb-3">{skill.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="px-2 py-1 bg-hover rounded-lg capitalize">{skill.category}</span>
              <span className="text-text-secondary">{skill.duration} min</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No skills found</h3>
          <p className="text-text-secondary">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default CopingSkillsPage
