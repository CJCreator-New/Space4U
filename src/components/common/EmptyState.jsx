function EmptyState({ illustration, title, description, actionLabel, onAction, className = "" }) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="text-6xl mb-4">{illustration}</div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export const EmptyStates = {
  NoMoods: (props) => (
    <EmptyState
      illustration="📅"
      title="Start Your Wellness Journey"
      description="Track your mood to understand patterns and improve your mental health"
      actionLabel="Log Your First Mood"
      {...props}
    />
  ),
  
  NoCircles: (props) => (
    <EmptyState
      illustration="👥"
      title="Find Your Community"
      description="Join circles to connect with people who understand your journey"
      actionLabel="Explore Circles"
      {...props}
    />
  ),
  
  NoPosts: (props) => (
    <EmptyState
      illustration="💬"
      title="Be the First to Share"
      description="Start a conversation in this community and help others feel less alone"
      actionLabel="Create Post"
      {...props}
    />
  ),
  
  NoBookmarks: (props) => (
    <EmptyState
      illustration="🔖"
      title="No Saved Resources Yet"
      description="Bookmark helpful resources to find them quickly when you need them"
      actionLabel="Browse Resources"
      {...props}
    />
  ),
  
  NoSearchResults: (props) => (
    <EmptyState
      illustration="🔍"
      title="No Results Found"
      description="Try different keywords or browse all available content"
      actionLabel="Clear Search"
      {...props}
    />
  ),
  
  NoActivity: (props) => (
    <EmptyState
      illustration="⭐"
      title="Your Journey Starts Here"
      description="Complete activities to see your progress and achievements"
      actionLabel="Get Started"
      {...props}
    />
  )
}

export default EmptyState