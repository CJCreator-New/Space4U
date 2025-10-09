import { Navigate } from 'react-router-dom'
import { useSupabaseAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useSupabaseAuth()
  
  // Allow access if no auth attempt was made (local-only mode)
  const hasAttemptedAuth = localStorage.getItem('safespace_auth_attempted')

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  // Only redirect if user attempted auth but is not signed in
  if (!user && hasAttemptedAuth === 'true') {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
