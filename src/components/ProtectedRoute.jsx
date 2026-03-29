import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isGuest } = useAuth()

  // Allow access if user is authenticated OR is in guest mode
  if (isAuthenticated || isGuest) {
    return children
  }

  // Redirect to login if not authenticated and not in guest mode
  return <Navigate to="/login" replace />
}
