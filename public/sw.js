// Service Worker for Space4U
const CACHE_NAME = 'space4u-v1'
const RUNTIME_CACHE = 'space4u-runtime'

// Assets to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map(name => caches.delete(name))
            )
        }).then(() => self.clients.claim())
    )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return
    }

    // Handle API requests with network-first strategy
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Clone the response before caching
                    const responseClone = response.clone()
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(event.request, responseClone)
                    })
                    return response
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request)
                })
        )
        return
    }

    // Handle other requests with cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse
                }

                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response
                    }

                    const responseClone = response.clone()
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(event.request, responseClone)
                    })

                    return response
                })
            })
            .catch(() => {
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html')
                }
            })
    )
})

// Background sync for mood entries
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-mood-entries') {
        event.waitUntil(syncMoodEntries())
    }
})

async function syncMoodEntries() {
    // Get pending mood entries from IndexedDB
    const db = await openDB()
    const pendingEntries = await db.getAll('pending-moods')

    for (const entry of pendingEntries) {
        try {
            await fetch('/api/moods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            })
            // Remove from pending if successful
            await db.delete('pending-moods', entry.id)
        } catch (error) {
            console.error('Failed to sync mood entry:', error)
        }
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('space4u-db', 1)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains('pending-moods')) {
                db.createObjectStore('pending-moods', { keyPath: 'id' })
            }
        }
    })
}
