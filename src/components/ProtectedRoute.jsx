import { Navigate } from 'react-router-dom'
import { useSupabaseAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
