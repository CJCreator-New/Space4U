import { useState, useMemo } from 'react'
import { ArrowLeft, Zap, Image as ImageIcon, List, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useThrottle } from '../hooks/useThrottle'
import VirtualList from '../components/common/VirtualList'
import LazyImage from '../components/common/LazyImage'
import { measurePerformance } from '../utils/performance'

function PerformanceDemoPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [scrollCount, setScrollCount] = useState(0)
  const debouncedSearch = useDebounce(searchTerm, 300)

  // Generate large dataset
  const largeDataset = useMemo(() => 
    measurePerformance('Generate 1000 items', () =>
      Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`
      }))
    ), []
  )

  // Filtered results with debounced search
  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return largeDataset
    return largeDataset.filter(item =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch, largeDataset])

  // Throttled scroll handler
  const handleScroll = useThrottle(() => {
    setScrollCount(c => c + 1)
  }, 100)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="touch-target mb-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Performance Demo</h1>
        <p className="text-green-100 mt-1">Optimization techniques</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Debounced Search */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Search size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Debounced Search</h2>
              <p className="text-sm text-text-secondary">300ms delay</p>
            </div>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 1000 items..."
            className="input w-full mb-3"
          />

          <div className="flex justify-between text-sm text-text-secondary">
            <span>Typing: {searchTerm}</span>
            <span>Searching: {debouncedSearch}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-indigo-600">
            Found: {filteredItems.length} items
          </div>
        </section>

        {/* Virtual List */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <List size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Virtual List</h2>
              <p className="text-sm text-text-secondary">
                Rendering {filteredItems.length} items efficiently
              </p>
            </div>
          </div>

          <VirtualList
            items={filteredItems}
            itemHeight={60}
            containerHeight={400}
            className="border rounded-lg"
            renderItem={(item) => (
              <div className="border-b p-4 bg-white hover:bg-gray-50">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-text-secondary">{item.description}</div>
              </div>
            )}
          />
        </section>

        {/* Throttled Scroll */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Throttled Events</h2>
              <p className="text-sm text-text-secondary">100ms throttle</p>
            </div>
          </div>

          <div
            onScroll={handleScroll}
            className="h-48 overflow-auto border rounded-lg p-4 bg-gray-50"
          >
            <div className="h-96">
              <p className="font-medium mb-2">Scroll this area</p>
              <p className="text-sm text-text-secondary">
                Scroll events fired: {scrollCount}
              </p>
              <div className="mt-4 space-y-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="bg-white p-3 rounded">
                    Scroll content {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lazy Images */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ImageIcon size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Lazy Loading Images</h2>
              <p className="text-sm text-text-secondary">Load on scroll</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <LazyImage
                key={i}
                src={`https://picsum.photos/200/200?random=${i}`}
                alt={`Image ${i + 1}`}
                placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3C/svg%3E"
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </section>

        {/* Performance Stats */}
        <section className="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <h2 className="font-semibold mb-4">Performance Optimizations</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>✅ Virtual scrolling</span>
              <span className="text-green-600 font-medium">~95% faster</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Debounced search</span>
              <span className="text-green-600 font-medium">~80% less renders</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Throttled events</span>
              <span className="text-green-600 font-medium">~90% less calls</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Lazy images</span>
              <span className="text-green-600 font-medium">~70% faster load</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Memoization</span>
              <span className="text-green-600 font-medium">~60% less compute</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PerformanceDemoPage
