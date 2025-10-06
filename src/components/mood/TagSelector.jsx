import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTags } from '../../hooks/useTags'
import { TAG_COLORS, TAG_CATEGORIES } from '../../constants/tags'

function TagSelector({ selectedTags = [], onChange, maxTags = 5 }) {
  const { tags, createTag } = useTags()
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagLabel, setNewTagLabel] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleTagToggle = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId))
    } else if (selectedTags.length < maxTags) {
      onChange([...selectedTags, tagId])
    }
  }

  const handleCreateTag = () => {
    if (newTagLabel.trim()) {
      const result = createTag(newTagLabel.trim(), selectedColor, 'custom')
      if (result.success) {
        onChange([...selectedTags, result.tag.id])
        setNewTagLabel('')
        setShowCreateTag(false)
      }
    }
  }

  const filteredTags = activeCategory === 'all' 
    ? tags 
    : tags.filter(tag => tag.category === activeCategory)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">
          Tags ({selectedTags.length}/{maxTags})
        </label>
        <button
          type="button"
          onClick={() => setShowCreateTag(!showCreateTag)}
          className="text-sm text-primary flex items-center gap-1"
        >
          <Plus size={16} />
          Create Tag
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          All
        </button>
        {Object.entries(TAG_CATEGORIES).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === key ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {showCreateTag && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
          <input
            type="text"
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            placeholder="Tag name..."
            className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
            maxLength={20}
          />
          <div className="flex gap-2 flex-wrap">
            {Object.keys(TAG_COLORS).map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full ${TAG_COLORS[color]} ${
                  selectedColor === color ? 'ring-2 ring-primary' : ''
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreateTag}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateTag(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                TAG_COLORS[tag.color]
              } ${isSelected ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
            >
              {tag.label}
              {isSelected && <span className="ml-1">✓</span>}
            </button>
          )
        })}
      </div>

      {selectedTags.length >= maxTags && (
        <p className="text-sm text-orange-600">Maximum {maxTags} tags reached</p>
      )}
    </div>
  )
}

export default TagSelector
