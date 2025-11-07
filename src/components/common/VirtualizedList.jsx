import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'

const VirtualizedList = memo(function VirtualizedList({
  items,
  itemHeight = 200,
  containerHeight = 600,
  renderItem,
  overscan = 5,
  className = ''
}) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeightState, setContainerHeightState] = useState(containerHeight)
  const scrollElementRef = useRef(null)
  const containerRef = useRef(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const itemCount = items.length
    const scrollTopValue = scrollTop
    const containerHeightValue = containerHeightState

    const startIndex = Math.max(0, Math.floor(scrollTopValue / itemHeight) - overscan)
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTopValue + containerHeightValue) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, containerHeightState, itemHeight, items.length, overscan])

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeightState(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight

  // Get visible items
  const visibleItems = items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id || index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default VirtualizedList