import { useState } from 'react'
import { Trash, Edit, Archive, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SwipeableView from '../components/common/SwipeableView'
import SwipeableListItem from '../components/common/SwipeableListItem'
import Card from '../components/common/Card'

function GesturesDemoPage() {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState(0)
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']

  const items = [
    { id: 1, title: 'Mood Entry', subtitle: 'Feeling great today!' },
    { id: 2, title: 'Gratitude Note', subtitle: 'Thankful for family' },
    { id: 3, title: 'Journal Entry', subtitle: 'Productive day at work' }
  ]

  const handleSwipeLeft = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1)
    }
  }

  const handleSwipeRight = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="touch-target"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Gesture Demo</h1>
      </div>

      {/* Swipeable Tabs */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Swipeable Tabs</h2>
        <p className="text-sm text-text-secondary mb-4">
          Swipe left or right to change tabs
        </p>
        
        <div className="flex gap-2 mb-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setCurrentTab(index)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                currentTab === index
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <SwipeableView
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        >
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">{tabs[currentTab]}</h3>
            <p className="text-text-secondary">
              Content for {tabs[currentTab]}. Swipe to navigate!
            </p>
          </div>
        </SwipeableView>
      </Card>

      {/* Swipeable List Items */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Swipeable List Items</h2>
        <p className="text-sm text-text-secondary mb-4">
          Swipe left for delete, right for edit
        </p>

        <div className="space-y-2">
          {items.map((item) => (
            <SwipeableListItem
              key={item.id}
              leftActions={[
                {
                  icon: <Trash size={20} />,
                  color: '#EF4444',
                  onPress: () => console.log('Delete', item.id)
                }
              ]}
              rightActions={[
                {
                  icon: <Edit size={20} />,
                  color: '#3B82F6',
                  onPress: () => console.log('Edit', item.id)
                },
                {
                  icon: <Archive size={20} />,
                  color: '#8B5CF6',
                  onPress: () => console.log('Archive', item.id)
                }
              ]}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.subtitle}</p>
              </div>
            </SwipeableListItem>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default GesturesDemoPage
