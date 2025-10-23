import { useState } from 'react'
import { ArrowLeft, Heart, Star, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import Skeleton from '../components/common/Skeleton'
import MicroInteraction from '../components/common/MicroInteraction'
import AnimatedNumber from '../components/common/AnimatedNumber'

function VisualDemoPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="touch-target mb-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Visual Polish Demo</h1>
          <p className="text-indigo-100 mt-1">Animations & Micro-interactions</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Skeleton Loaders */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Skeleton Loaders</h2>
            <button
              onClick={simulateLoading}
              className="btn-primary mb-4"
            >
              Toggle Loading
            </button>
            
            {loading ? (
              <div className="space-y-4">
                <div className="card p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circle" width="48px" height="48px" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="title" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </div>
                  </div>
                  <Skeleton variant="rect" height="120px" />
                  <Skeleton variant="text" width="80%" />
                </div>
              </div>
            ) : (
              <div className="card p-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                  <div>
                    <h3 className="font-semibold">Content Loaded</h3>
                    <p className="text-sm text-text-secondary">Ready to view</p>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3" />
                <p className="text-text-secondary">This is the actual content that appears after loading.</p>
              </div>
            )}
          </section>

          {/* Micro-interactions */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Micro-interactions</h2>
            <div className="grid grid-cols-2 gap-4">
              <MicroInteraction type="scale">
                <div className="card p-6 text-center">
                  <Heart className="mx-auto mb-2 text-red-500" size={32} />
                  <p className="font-medium">Scale</p>
                </div>
              </MicroInteraction>

              <MicroInteraction type="bounce">
                <div className="card p-6 text-center">
                  <Star className="mx-auto mb-2 text-yellow-500" size={32} />
                  <p className="font-medium">Bounce</p>
                </div>
              </MicroInteraction>

              <MicroInteraction type="press">
                <div className="card p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 text-green-500" size={32} />
                  <p className="font-medium">Press</p>
                </div>
              </MicroInteraction>

              <MicroInteraction type="lift">
                <div className="card p-6 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
                  <p className="font-medium">Lift</p>
                </div>
              </MicroInteraction>
            </div>
          </section>

          {/* Animated Numbers */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Animated Numbers</h2>
            <div className="card p-6">
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <AnimatedNumber value={count} className="text-3xl font-bold text-indigo-600" />
                  <p className="text-sm text-text-secondary mt-1">Count</p>
                </div>
                <div>
                  <AnimatedNumber value={count * 10} className="text-3xl font-bold text-purple-600" />
                  <p className="text-sm text-text-secondary mt-1">Points</p>
                </div>
                <div>
                  <AnimatedNumber value={count * 5} className="text-3xl font-bold text-green-600" />
                  <p className="text-sm text-text-secondary mt-1">Streak</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCount(c => c + 10)}
                  className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-medium"
                >
                  +10
                </button>
                <button
                  onClick={() => setCount(c => c + 50)}
                  className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-medium"
                >
                  +50
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Animation Classes */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Animation Classes</h2>
            <div className="space-y-3">
              <div className="card p-4 animate-fadeIn">
                <p className="font-medium">Fade In Animation</p>
              </div>
              <div className="card p-4 animate-slideUp">
                <p className="font-medium">Slide Up Animation</p>
              </div>
              <div className="card p-4 animate-scaleIn">
                <p className="font-medium">Scale In Animation</p>
              </div>
              <div className="card p-4 animate-slideInRight">
                <p className="font-medium">Slide In Right Animation</p>
              </div>
              <div className="card p-4 animate-pulse">
                <p className="font-medium">Pulse Animation (Infinite)</p>
              </div>
            </div>
          </section>

          {/* Ripple Effect */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Ripple Effect</h2>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-medium ripple">
              Tap for Ripple Effect
            </button>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}

export default VisualDemoPage
