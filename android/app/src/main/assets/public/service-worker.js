const CACHE_NAME = 'space4u-v1'
const STATIC_CACHE = 'space4u-static-v1'
const DYNAMIC_CACHE = 'space4u-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'mood-sync') {
    event.waitUntil(syncMoodData())
  }
})

// Sync mood data when back online
async function syncMoodData() {
  try {
    const pendingMoods = await getStoredData('pending_moods')
    if (pendingMoods && pendingMoods.length > 0) {
      // Process pending mood logs
      for (const mood of pendingMoods) {
        // In a real app, this would sync to a server
        console.log('Syncing mood:', mood)
      }
      // Clear pending moods after sync
      await clearStoredData('pending_moods')
    }
  } catch (error) {
    console.error('Failed to sync mood data:', error)
  }
}

// Helper functions for IndexedDB operations
function getStoredData(key) {
  return new Promise((resolve) => {
    const data = localStorage.getItem(key)
    resolve(data ? JSON.parse(data) : null)
  })
}

function clearStoredData(key) {
  return new Promise((resolve) => {
    localStorage.removeItem(key)
    resolve()
  })
}