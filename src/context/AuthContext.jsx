import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('storyboard_user')
    const savedGuest = localStorage.getItem('storyboard_guest')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else if (savedGuest) {
      setIsGuest(true)
    }
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    
    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock successful login
    const mockUser = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      createdAt: new Date().toISOString()
    }
    
    setUser(mockUser)
    setIsGuest(false)
    localStorage.setItem('storyboard_user', JSON.stringify(mockUser))
    localStorage.removeItem('storyboard_guest')
    setIsLoading(false)
    
    return { success: true }
  }

  const signup = async (name, email, password) => {
    setIsLoading(true)
    
    // Mock signup logic
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockUser = {
      id: 'user_' + Date.now(),
      email,
      name,
      createdAt: new Date().toISOString()
    }
    
    setUser(mockUser)
    setIsGuest(false)
    localStorage.setItem('storyboard_user', JSON.stringify(mockUser))
    localStorage.removeItem('storyboard_guest')
    setIsLoading(false)
    
    return { success: true }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    
    // Mock Google login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser = {
      id: 'google_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4d8eff&color=fff',
      provider: 'google',
      createdAt: new Date().toISOString()
    }
    
    setUser(mockUser)
    setIsGuest(false)
    localStorage.setItem('storyboard_user', JSON.stringify(mockUser))
    localStorage.removeItem('storyboard_guest')
    setIsLoading(false)
    
    return { success: true }
  }

  const continueAsGuest = () => {
    setUser(null)
    setIsGuest(true)
    localStorage.setItem('storyboard_guest', 'true')
    localStorage.removeItem('storyboard_user')
  }

  const logout = () => {
    setUser(null)
    setIsGuest(false)
    localStorage.removeItem('storyboard_user')
    localStorage.removeItem('storyboard_guest')
  }

  const forgotPassword = async (email) => {
    // Mock forgot password
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true, message: 'Reset link sent to your email' }
  }

  const value = {
    user,
    isGuest,
    isLoading,
    isAuthenticated: !!user || isGuest,
    login,
    signup,
    loginWithGoogle,
    continueAsGuest,
    logout,
    forgotPassword
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
