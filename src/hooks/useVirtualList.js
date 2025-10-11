import { useState, useEffect, useRef } from 'react'

export function useVirtualList({ items, itemHeight, containerHeight, overscan = 3 }) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight)
  
  const start = Math.max(0, visibleStart - overscan)
  const end = Math.min(items.length, visibleEnd + overscan)
  
  const visibleItems = items.slice(start, end).map((item, index) => ({
    ...item,
    index: start + index,
    offsetTop: (start + index) * itemHeight
  }))

  const totalHeight = items.length * itemHeight

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }

  return {
    visibleItems,
    totalHeight,
    containerRef,
    handleScroll
  }
}
