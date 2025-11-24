import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  // GitHub Pages base path - set to repository name for github.io or empty for custom domain
  base: process.env.GITHUB_PAGES ? '/Space4U/' : '/',
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: true,
      timeout: 30000
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
    }
  },
  build: {
    rollupOptions: {
      external: [
        '@aparajita/capacitor-biometric-auth',
        '@capacitor/biometric-auth'
      ],
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts'
            }
            if (id.includes('lucide-react') || id.includes('@heroicons')) {
              return 'icons'
            }
            if (id.includes('@chakra-ui') || id.includes('@emotion') || id.includes('framer-motion')) {
              return 'ui-vendor'
            }
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('react-spring') || id.includes('@react-spring')) {
              return 'animation'
            }
            // Group smaller utilities together
            if (id.includes('date-fns') || id.includes('lodash') || id.includes('axios')) {
              return 'utils'
            }
            return 'vendor'
          }

          // Application chunks - split large feature areas
          if (id.includes('src/pages/InsightsPage') || id.includes('src/components/charts')) {
            return 'analytics'
          }
          if (id.includes('src/pages/TherapeuticToolsPage') || id.includes('src/components/tools')) {
            return 'therapeutic'
          }
          if (id.includes('src/pages/SettingsPage') || id.includes('src/components/settings')) {
            return 'settings'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Enable compression for static assets
    reportCompressedSize: true,
    sourcemap: false // Disable sourcemaps in production for smaller bundles
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '*.config.js',
        'src/main.jsx'
      ],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})