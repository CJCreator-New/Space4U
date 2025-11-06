export const isOnline = () => {
  return navigator.onLine
}

export const getCachedData = (key, maxAge = 3600000) => {
  try {
    const cached = localStorage.getItem(`cache_${key}`)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const age = Date.now() - timestamp

    if (age > maxAge) {
      localStorage.removeItem(`cache_${key}`)
      return null
    }

    return data
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

export const setCachedData = (key, data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

export const clearCache = (key) => {
  if (key) {
    localStorage.removeItem(`cache_${key}`)
  } else {
    // Clear all cache entries
    Object.keys(localStorage)
      .filter(k => k.startsWith('cache_'))
      .forEach(k => localStorage.removeItem(k))
  }
}

export const useOfflineData = (key, fetchFn) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isOnline()) {
          const freshData = await fetchFn()
          setCachedData(key, freshData)
          setData(freshData)
        } else {
          const cachedData = getCachedData(key)
          if (cachedData) {
            setData(cachedData)
          } else {
            setError('No cached data available offline')
          }
        }
      } catch (err) {
        const cachedData = getCachedData(key)
        if (cachedData) {
          setData(cachedData)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [key])

  return { data, loading, error, isOnline: isOnline() }
}
