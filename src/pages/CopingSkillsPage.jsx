import { useState } from 'react'
import { Search, Heart, Star, Crown, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'

const SKILLS = [
  { id: 1, name: 'Deep Breathing', category: 'relaxation', situation: ['anxiety', 'stress'], duration: 5, description: '4-7-8 breathing technique', premium: false },
  { id: 2, name: '5-4-3-2-1 Grounding', category: 'grounding', situation: ['anxiety', 'panic'], duration: 5, description: 'Sensory grounding technique', premium: false },
  { id: 3, name: 'Progressive Muscle Relaxation', category: 'relaxation', situation: ['anxiety', 'stress'], duration: 15, description: 'Tense and release muscles', premium: false },
  { id: 4, name: 'Call a Friend', category: 'social', situation: ['loneliness', 'sadness'], duration: 20, description: 'Reach out for support', premium: false },
  { id: 5, name: 'Go for a Walk', category: 'physical', situation: ['stress', 'anger'], duration: 15, description: 'Physical activity outdoors', premium: false },
  { id: 6, name: 'Journaling', category: 'distraction', situation: ['overwhelm', 'confusion'], duration: 10, description: 'Write down thoughts', premium: false },
  { id: 7, name: 'Listen to Music', category: 'distraction', situation: ['stress', 'sadness'], duration: 10, description: 'Calming playlist', premium: false },
  { id: 8, name: 'Cold Water Splash', category: 'grounding', situation: ['panic', 'overwhelm'], duration: 2, description: 'Splash face with cold water', premium: false },
  { id: 9, name: 'Mindful Observation', category: 'grounding', situation: ['anxiety', 'racing thoughts'], duration: 5, description: 'Focus on one object', premium: false },
  { id: 10, name: 'Body Scan', category: 'relaxation', situation: ['stress', 'insomnia'], duration: 10, description: 'Mental body scan', premium: false },
  { id: 11, name: 'TIPP Skills', category: 'grounding', situation: ['crisis', 'panic'], duration: 5, description: 'Temperature, Intense exercise, Paced breathing, Paired muscle relaxation', premium: true },
  { id: 12, name: 'Radical Acceptance', category: 'mindfulness', situation: ['grief', 'anger'], duration: 15, description: 'DBT acceptance practice', premium: true },
  { id: 13, name: 'Opposite Action', category: 'behavioral', situation: ['depression', 'avoidance'], duration: 10, description: 'Act opposite to emotion urge', premium: true },
  { id: 14, name: 'Self-Soothing Kit', category: 'self-care', situation: ['overwhelm', 'stress'], duration: 20, description: 'Engage all 5 senses', premium: true },
  { id: 15, name: 'Cognitive Defusion', category: 'cognitive', situation: ['rumination', 'worry'], duration: 10, description: 'ACT technique for thoughts', premium: true }
]

function CopingSkillsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('safespace_favorite_coping_skills')
    return saved ? JSON.parse(saved) : []
  })
  const { isPremium } = getPremiumStatus()
  const MAX_FREE_FAVORITES = 10

  const toggleFavorite = (id) => {
    if (!isPremium && !favorites.includes(id) && favorites.length >= MAX_FREE_FAVORITES) {
      navigate('/premium')
      return
    }
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(updated)
    localStorage.setItem('safespace_favorite_coping_skills', JSON.stringify(updated))
  }

  const handleSkillClick = (skill) => {
    if (skill.premium && !isPremium) {
      navigate('/premium')
    }
  }

  const filtered = SKILLS.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || skill.category === filter || skill.situation.includes(filter)
    return matchesSearch && matchesFilter
  })

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Coping Skills Library</h1>
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
              <Crown size={12} />
              Premium
            </div>
          )}
        </div>
        <p className="text-text-secondary">Evidence-based strategies for managing difficult emotions • {isPremium ? '100+' : '50'} skills available</p>
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
          <div 
            key={skill.id} 
            className={`card p-6 hover:shadow-lg transition-shadow ${skill.premium && !isPremium ? 'opacity-70 cursor-pointer' : ''}`}
            onClick={() => handleSkillClick(skill)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                {skill.premium && !isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(skill.id)
                }}
                className="p-1 hover:scale-110 transition-transform"
                disabled={skill.premium && !isPremium}
              >
                <Star className={`w-5 h-5 ${favorites.includes(skill.id) ? 'fill-yellow-500 text-yellow-500' : 'text-text-secondary'}`} />
              </button>
            </div>
            <p className="text-text-secondary text-sm mb-3">{skill.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="px-2 py-1 bg-hover rounded-lg capitalize">{skill.category}</span>
              <span className="text-text-secondary">{skill.duration} min</span>
            </div>
            {skill.premium && !isPremium && (
              <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 font-medium">
                <Lock size={12} />
                Premium Skill
              </div>
            )}
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
  
    </SafeComponent>
  )
}

export default CopingSkillsPage
