import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * usePagination Hook
 *
 * A reusable hook for handling pagination logic with support for:
 * - Configurable page size
 * - Loading states
 * - Load more functionality
 * - Infinite scroll support
 * - Data filtering and sorting
 *
 * @param {Object} config
 * @param {Array} config.data - Full dataset to paginate
 * @param {number} config.pageSize - Number of items per page (default: 20)
 * @param {boolean} config.infinite - Enable infinite scroll mode (default: false)
 * @param {Function} config.filterFn - Optional filter function
 * @param {Function} config.sortFn - Optional sort function
 * @param {Array} config.dependencies - Dependencies for data reloading
 * @returns {Object} Pagination state and controls
 */
export function usePagination({
  data = [],
  pageSize = 20,
  infinite = false,
  filterFn,
  sortFn,
  dependencies = []
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Process data with filtering and sorting
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply filtering
    if (filterFn) {
      result = result.filter(filterFn)
    }

    // Apply sorting
    if (sortFn) {
      result = result.sort(sortFn)
    }

    return result
  }, [data, filterFn, sortFn, ...dependencies])

  // Calculate pagination metadata
  const totalItems = processedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const hasMore = infinite ? currentPage * pageSize < totalItems : currentPage < totalPages

  // Get current page data
  const currentData = useMemo(() => {
    if (infinite) {
      // Infinite scroll: return all loaded pages
      return processedData.slice(0, currentPage * pageSize)
    } else {
      // Regular pagination: return current page only
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      return processedData.slice(start, end)
    }
  }, [processedData, currentPage, pageSize, infinite])

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [processedData.length, ...dependencies])

  // Navigation functions
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore])

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return

    setLoading(true)
    setError(null)

    try {
      // Simulate async loading (replace with actual async operation)
      await new Promise(resolve => setTimeout(resolve, 100))
      setCurrentPage(prev => prev + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [hasMore, loading])

  const reset = useCallback(() => {
    setCurrentPage(1)
    setLoading(false)
    setError(null)
  }, [])

  return {
    // Data
    data: currentData,
    allData: processedData,

    // Pagination state
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasMore,

    // Status
    loading,
    error,

    // Navigation
    goToPage,
    nextPage,
    prevPage,
    loadMore,
    reset,

    // Computed properties
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, totalItems),

    // Page info for UI
    pageInfo: {
      current: currentPage,
      total: totalPages,
      showing: `${Math.min(currentPage * pageSize, totalItems)} of ${totalItems} items`
    }
  }
}

export default usePagination