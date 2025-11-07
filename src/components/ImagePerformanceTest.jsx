import { useState, useEffect, useRef } from 'react'
import OptimizedImage from '../components/OptimizedImage'
import OptimizedAvatar from '../components/OptimizedAvatar'
import { useDeviceCapabilities, useResponsiveImage } from '../hooks/useResponsiveImage'
import { useImagePreloader, useImagePerformanceTracker } from '../hooks/useImagePreloader'

function ImagePerformanceTest() {
  const [testResults, setTestResults] = useState({
    loadTimes: [],
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    successRate: 0
  })

  const capabilities = useDeviceCapabilities()
  const { metrics, trackImageLoad, getAverageLoadTime, getSuccessRate } = useImagePerformanceTracker()

  // Test images with different sizes and formats
  const testImages = [
    { src: 'https://picsum.photos/400/300?random=1', alt: 'Test Image 1 (400x300)' },
    { src: 'https://picsum.photos/800/600?random=2', alt: 'Test Image 2 (800x600)' },
    { src: 'https://picsum.photos/1200/900?random=3', alt: 'Test Image 3 (1200x900)' },
    { src: 'https://picsum.photos/200/150?random=4', alt: 'Test Image 4 (200x150)' },
    { src: 'https://picsum.photos/600/450?random=5', alt: 'Test Image 5 (600x450)' }
  ]

  // Test avatars
  const testAvatars = [
    { src: 'https://picsum.photos/100/100?random=6', fallback: '😊', alt: 'Avatar 1' },
    { src: 'https://picsum.photos/100/100?random=7', fallback: '🚀', alt: 'Avatar 2' },
    { src: '', fallback: '⭐', alt: 'Avatar 3 (emoji only)' },
    { src: '', fallback: '☕', alt: 'Avatar 4 (emoji only)' }
  ]

  const trackImagePerformance = (url, success, size = 0, time = 0) => {
    trackImageLoad(url, success, size, time)
    setTestResults(prev => ({
      ...prev,
      totalImages: metrics.loaded + metrics.failed,
      loadedImages: metrics.loaded,
      failedImages: metrics.failed,
      averageLoadTime: getAverageLoadTime(),
      successRate: getSuccessRate()
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">🖼️ Image Optimization Performance Test</h1>

        {/* Device Capabilities */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">📱 Device Capabilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="font-medium">Pixel Ratio</div>
              <div className="text-lg">{capabilities.pixelRatio}x</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="font-medium">Connection</div>
              <div className="text-lg">{capabilities.connection}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="font-medium">Screen Size</div>
              <div className="text-sm">{capabilities.screenWidth}×{capabilities.screenHeight}</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="font-medium">Device Type</div>
              <div className="text-lg">
                {capabilities.isMobile ? '📱 Mobile' :
                 capabilities.isTablet ? '📱 Tablet' : '💻 Desktop'}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">📊 Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="font-medium">Total Images</div>
              <div className="text-2xl font-bold">{testResults.totalImages}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="font-medium">Loaded</div>
              <div className="text-2xl font-bold text-green-600">{testResults.loadedImages}</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <div className="font-medium">Failed</div>
              <div className="text-2xl font-bold text-red-600">{testResults.failedImages}</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="font-medium">Success Rate</div>
              <div className="text-2xl font-bold">{testResults.successRate.toFixed(1)}%</div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Load Time: <span className="font-semibold">{testResults.averageLoadTime.toFixed(2)}ms</span>
            </div>
          </div>
        </div>

        {/* Test Images */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">🖼️ Responsive Images Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testImages.map((image, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                  responsive={true}
                  onLoad={() => trackImagePerformance(image.src, true, 0, Date.now())}
                  onError={() => trackImagePerformance(image.src, false, 0, Date.now())}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{image.alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Avatars */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">👤 Avatar Optimization Test</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {testAvatars.map((avatar, index) => (
              <div key={index} className="text-center">
                <OptimizedAvatar
                  src={avatar.src}
                  fallback={avatar.fallback}
                  alt={avatar.alt}
                  size={60}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">{avatar.alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lazy Loading Test */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">⚡ Lazy Loading Test</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Scroll down to see lazy-loaded images. They should only load when near the viewport.
          </p>
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <OptimizedAvatar
                    src={`https://picsum.photos/50/50?random=${i + 10}`}
                    fallback={`😀`}
                    alt={`Lazy Avatar ${i + 1}`}
                    size={50}
                  />
                  <div>
                    <h3 className="font-medium">Lazy Loaded Item {i + 1}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This content loads immediately, but the image only loads when near viewport.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Test Instructions</h3>
          <ul className="text-sm space-y-1">
            <li>• Check that images load progressively and responsively</li>
            <li>• Verify avatars show images or fall back to emojis</li>
            <li>• Scroll to test lazy loading behavior</li>
            <li>• Monitor performance metrics above</li>
            <li>• Test on different screen sizes for responsive behavior</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ImagePerformanceTest