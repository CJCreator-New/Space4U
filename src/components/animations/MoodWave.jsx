function MoodWave({ mood = 3, className = '' }) {
  const moodColors = {
    1: { from: '#FF6B6B', to: '#FF8C42' },
    2: { from: '#FF8C42', to: '#FFD93D' },
    3: { from: '#4ECDC4', to: '#95E1D3' },
    4: { from: '#6B73FF', to: '#9B59B6' },
    5: { from: '#2ECC71', to: '#FFD93D' }
  }

  const colors = moodColors[mood] || moodColors[3]

  return (
    <div className={`relative w-full h-32 overflow-hidden ${className}`}>
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`waveGradient${mood}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.from} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.to} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 */}
        <path
          d="M0,60 C300,90 600,30 900,60 C1050,75 1200,60 1200,60 L1200,120 L0,120 Z"
          fill={`url(#waveGradient${mood})`}
          className="animate-wave"
        />
        
        {/* Wave 2 */}
        <path
          d="M0,80 C300,50 600,100 900,80 C1050,70 1200,80 1200,80 L1200,120 L0,120 Z"
          fill={colors.from}
          opacity="0.5"
          className="animate-wave-slow"
        />
        
        {/* Wave 3 */}
        <path
          d="M0,90 C300,110 600,70 900,90 C1050,100 1200,90 1200,90 L1200,120 L0,120 Z"
          fill={colors.to}
          opacity="0.3"
          className="animate-wave-slower"
        />
      </svg>

      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 10s linear infinite;
        }
        .animate-wave-slow {
          animation: wave 15s linear infinite;
        }
        .animate-wave-slower {
          animation: wave 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default MoodWave
