// Performance test script for image optimizations
// Run this in the browser console to test image loading performance

function runImagePerformanceTest() {
  console.log('🚀 Starting Image Performance Test...')

  const testImages = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/1200/900?random=3',
    'https://picsum.photos/200/150?random=4',
    'https://picsum.photos/600/450?random=5'
  ]

  const results = {
    totalImages: testImages.length,
    loadedImages: 0,
    failedImages: 0,
    loadTimes: [],
    totalSize: 0,
    startTime: Date.now()
  }

  function trackImage(url, success, loadTime, size = 0) {
    if (success) {
      results.loadedImages++
      results.loadTimes.push(loadTime)
      results.totalSize += size
    } else {
      results.failedImages++
    }

    if (results.loadedImages + results.failedImages === results.totalImages) {
      displayResults()
    }
  }

  function displayResults() {
    const endTime = Date.now()
    const totalTime = endTime - results.startTime
    const averageLoadTime = results.loadTimes.reduce((a, b) => a + b, 0) / results.loadTimes.length
    const successRate = (results.loadedImages / results.totalImages) * 100

    console.log('📊 Image Performance Test Results:')
    console.log('=====================================')
    console.log(`Total Images: ${results.totalImages}`)
    console.log(`Loaded: ${results.loadedImages}`)
    console.log(`Failed: ${results.failedImages}`)
    console.log(`Success Rate: ${successRate.toFixed(1)}%`)
    console.log(`Average Load Time: ${averageLoadTime.toFixed(2)}ms`)
    console.log(`Total Size: ${(results.totalSize / 1024).toFixed(2)} KB`)
    console.log(`Total Test Time: ${totalTime}ms`)
    console.log('=====================================')

    // Test device capabilities detection
    console.log('📱 Device Capabilities:')
    const pixelRatio = window.devicePixelRatio || 1
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const connection = navigator.connection?.effectiveType || 'unknown'
    const memory = navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'unknown'

    console.log(`Pixel Ratio: ${pixelRatio}x`)
    console.log(`Screen Size: ${screenWidth}×${screenHeight}`)
    console.log(`Connection: ${connection}`)
    console.log(`Memory: ${memory}`)
    console.log(`Device Type: ${screenWidth < 768 ? 'Mobile' : screenWidth < 1024 ? 'Tablet' : 'Desktop'}`)

    // Test WebP support
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    })()

    const supportsAVIF = (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
    })()

    console.log(`WebP Support: ${supportsWebP ? '✅' : '❌'}`)
    console.log(`AVIF Support: ${supportsAVIF ? '✅' : '❌'}`)
  }

  // Load test images
  testImages.forEach(url => {
    const img = new Image()
    const startTime = Date.now()

    img.onload = () => {
      const loadTime = Date.now() - startTime
      trackImage(url, true, loadTime)
    }

    img.onerror = () => {
      const loadTime = Date.now() - startTime
      trackImage(url, false, loadTime)
    }

    img.src = url
  })

  console.log('⏳ Loading test images...')
}

// Auto-run the test
if (typeof window !== 'undefined') {
  runImagePerformanceTest()
}

export { runImagePerformanceTest }