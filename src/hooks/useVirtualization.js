import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

/**
 * useVirtualization Hook
 *
 * A hook for implementing virtual scrolling to improve performance
 * with large lists, calendars, and heat maps.
 *
 * @param {Object} config
 * @param {number} config.itemCount - Total number of items
 * @param {number} config.itemHeight - Height of each item (or estimated height)
 * @param {number} config.containerHeight - Height of the scrollable container
 * @param {number} config.overscan - Number of extra items to render outside viewport (default: 5)
 * @param {Function} config.getItemHeight - Optional function to get dynamic item heights
 * @returns {Object} Virtual scrolling state and utilities
 */
export function useVirtualization({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
  getItemHeight
}) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (getItemHeight) {
      // Dynamic heights: calculate total
      let height = 0
      for (let i = 0; i < itemCount; i++) {
        height += getItemHeight(i)
      }
      return height
    } else {
      // Fixed heights: simple calculation
      return itemCount * itemHeight
    }
  }, [itemCount, itemHeight, getItemHeight])

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    if (containerHeight === 0) {
      return { startIndex: 0, endIndex: 0, offsetY: 0 }
    }

    let startIdx = 0
    let offset = 0

    if (getItemHeight) {
      // Dynamic heights: find start index by accumulating heights
      let accumulatedHeight = 0
      for (let i = 0; i < itemCount; i++) {
        const itemH = getItemHeight(i)
        if (accumulatedHeight + itemH > scrollTop) {
          startIdx = Math.max(0, i - overscan)
          offset = accumulatedHeight
          break
        }
        accumulatedHeight += itemH
      }
    } else {
      // Fixed heights: simple calculation
      startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
      offset = startIdx * itemHeight
    }

    // Calculate end index
    let endIdx = startIdx
    let visibleHeight = 0

    while (endIdx < itemCount && visibleHeight < containerHeight + (overscan * itemHeight)) {
      const currentHeight = getItemHeight ? getItemHeight(endIdx) : itemHeight
      visibleHeight += currentHeight
      endIdx++
    }

    endIdx = Math.min(itemCount, endIdx + overscan)

    return {
      startIndex: startIdx,
      endIndex: endIdx,
      offsetY: offset
    }
  }, [scrollTop, itemCount, itemHeight, containerHeight, overscan, getItemHeight])

  // Get visible items
  const visibleItems = useMemo(() => {
    const items = []
    for (let i = startIndex; i < endIndex; i++) {
      const height = getItemHeight ? getItemHeight(i) : itemHeight
      items.push({
        index: i,
        height,
        offsetTop: getItemHeight
          ? items.reduce((sum, item, idx) => sum + (idx === 0 ? 0 : item.height), 0)
          : i * itemHeight
      })
    }
    return items
  }, [startIndex, endIndex, itemHeight, getItemHeight])

  // Scroll handler
  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop)
  }, [])

  // Scroll to item
  const scrollToItem = useCallback((index, align = 'start') => {
    if (!containerRef.current) return

    let targetOffset = 0

    if (getItemHeight) {
      for (let i = 0; i < index; i++) {
        targetOffset += getItemHeight(i)
      }
    } else {
      targetOffset = index * itemHeight
    }

    // Adjust alignment
    if (align === 'center') {
      targetOffset -= containerHeight / 2
    } else if (align === 'end') {
      targetOffset -= containerHeight
    }

    containerRef.current.scrollTo({
      top: Math.max(0, targetOffset),
      behavior: 'smooth'
    })
  }, [itemHeight, containerHeight, getItemHeight])

  // Get item position info
  const getItemPosition = useCallback((index) => {
    if (index < 0 || index >= itemCount) {
      return null
    }

    let offsetTop = 0
    const height = getItemHeight ? getItemHeight(index) : itemHeight

    if (getItemHeight) {
      for (let i = 0; i < index; i++) {
        offsetTop += getItemHeight(i)
      }
    } else {
      offsetTop = index * itemHeight
    }

    return {
      index,
      height,
      offsetTop,
      isVisible: index >= startIndex && index < endIndex
    }
  }, [itemCount, itemHeight, startIndex, endIndex, getItemHeight])

  return {
    // Refs
    containerRef,

    // Dimensions
    totalHeight,
    containerHeight,
    itemHeight,

    // Visible range
    startIndex,
    endIndex,
    visibleItems,

    // Scroll state
    scrollTop,
    offsetY,

    // Handlers
    handleScroll,
    scrollToItem,

    // Utilities
    getItemPosition,

    // Computed properties
    visibleCount: endIndex - startIndex,
    isAtTop: scrollTop === 0,
    isAtBottom: scrollTop >= totalHeight - containerHeight
  }
}

export default useVirtualization