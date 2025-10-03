import { X } from 'lucide-react'

function FilterModal({ isOpen, onClose, filters, onFiltersChange }) {
  if (!isOpen) return null

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'support', label: 'Support Groups' }
  ]

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'members', label: 'Most Members' },
    { value: 'active', label: 'Most Active' },
    { value: 'recent', label: 'Recently Joined' }
  ]

  const handleApply = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Filter Circles</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Sort by</h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={filters.sort === option.value}
                  onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default FilterModal