function ProgressIndicator({ current, total }) {
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < current ? 'bg-primary' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default ProgressIndicator