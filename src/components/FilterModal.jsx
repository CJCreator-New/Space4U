import { X } from '../config/icons'
import BottomSheet from './common/BottomSheet'

function FilterModal({ isOpen, onClose, filters, onFiltersChange }) {

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'support', label: 'Support Groups' }
  ]

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'active', label: 'Active now' },
    { value: 'members', label: 'Largest communities' },
    { value: 'growth', label: 'Growing fastest' }
  ]

  const handleApply = () => {
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
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
    </BottomSheet>
  )
}

export default FilterModal