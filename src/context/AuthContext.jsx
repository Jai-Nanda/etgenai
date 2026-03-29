import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check for guest session first
      const guestSession = localStorage.getItem('guest_session')
      if (guestSession === 'true') {
        setIsGuest(true)
        return
      }

      // Then check for authenticated session
      const token = authService.getToken()
      if (token) {
        setIsLoading(true)
        const response = await authService.getProfile()
        if (response.success) {
          setUser(response.data)
        } else {
          // Token invalid, clear it
          authService.logout()
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      authService.logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.login(email, password)
      
      if (response.success) {
        setUser(response.data.user)
        setIsGuest(false)
        return { success: true }
      } else {
        setError(response.message || 'Login failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      const authError = authService.handleAuthError(error)
      setError(authError.message)
      return { success: false, message: authError.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name, email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.signup(name, email, password)
      
      if (response.success) {
        setUser(response.data.user)
        setIsGuest(false)
        return { success: true }
      } else {
        setError(response.message || 'Signup failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      const authError = authService.handleAuthError(error)
      setError(authError.message)
      return { success: false, message: authError.message }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    // For now, this is a placeholder for future Google OAuth integration
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate Google login with demo account
      const response = await authService.login('demo@example.com', 'demo123456')
      
      if (response.success) {
        setUser(response.data.user)
        setIsGuest(false)
        return { success: true }
      } else {
        setError('Google login failed')
        return { success: false, message: 'Google login failed' }
      }
    } catch (error) {
      setError('Google login failed')
      return { success: false, message: 'Google login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const continueAsGuest = () => {
    setUser(null)
    setIsGuest(true)
    setError(null)
    authService.logout()
    // Store guest session
    localStorage.setItem('guest_session', 'true')
  }

  const logout = () => {
    setUser(null)
    setIsGuest(false)
    setError(null)
    authService.logout()
    // Clear guest session
    localStorage.removeItem('guest_session')
  }

  const updateProfile = async (name) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.updateProfile(name)
      
      if (response.success) {
        setUser(response.data)
        return { success: true }
      } else {
        setError(response.message || 'Profile update failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      const authError = authService.handleAuthError(error)
      setError(authError.message)
      return { success: false, message: authError.message }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    isGuest,
    isLoading,
    isAuthenticated: !!user || isGuest,
    error,
    login,
    signup,
    loginWithGoogle,
    continueAsGuest,
    logout,
    updateProfile,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
