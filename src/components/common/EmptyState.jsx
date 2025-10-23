function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon || '📭'}</div>
      <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-text-secondary dark:text-gray-300 mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="btn-primary"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  )
}

export default EmptyState
