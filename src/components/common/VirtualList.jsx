import { useVirtualList } from '../../hooks/useVirtualList'

function VirtualList({ items, itemHeight, containerHeight, renderItem, className = '' }) {
  const { visibleItems, totalHeight, containerRef, handleScroll } = useVirtualList({
    items,
    itemHeight,
    containerHeight
  })

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div
            key={item.index}
            style={{
              position: 'absolute',
              top: item.offsetTop,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualList
