import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import AuthFormCard from '../components/auth/AuthFormCard'
import InputField from '../components/auth/InputField'
import PasswordField from '../components/auth/PasswordField'
import RememberMeCheckbox from '../components/auth/RememberMeCheckbox'
import SocialLoginButton from '../components/auth/SocialLoginButton'
import AuthDivider from '../components/auth/AuthDivider'
import GuestAccessButton from '../components/auth/GuestAccessButton'
import AuthLink from '../components/auth/AuthLink'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, continueAsGuest, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: 'Invalid email or password' })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: 'Google login failed' })
    }
  }

  const handleGuestAccess = () => {
    continueAsGuest()
    navigate('/dashboard')
  }

  return (
    <PageContainer>
      <div className="min-h-screen flex items-start justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <AuthFormCard
            title="Welcome back"
            subtitle="Continue your expense tracking with AI-powered insights"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30">
                  <p className="text-sm text-error text-center">{errors.general}</p>
                </div>
              )}
              
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                required
              />
              
              <PasswordField
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />
              
              <div className="flex items-center justify-between">
                <RememberMeCheckbox
                  checked={formData.rememberMe}
                  onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                />
                <AuthLink to="/forgot-password">
                  Forgot password?
                </AuthLink>
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-primary-container font-semibold rounded-xl shadow-[0_0_40px_-10px_rgba(173,198,255,0.4)] hover:shadow-[0_0_50px_-5px_rgba(173,198,255,0.6)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </form>
            
            <AuthDivider />
            
            <div className="space-y-3">
              <SocialLoginButton
                provider="google"
                icon={Chrome}
                onClick={handleGoogleLogin}
                loading={isLoading}
              />
              
              <GuestAccessButton
                onClick={handleGuestAccess}
                loading={isLoading}
              />
            </div>
            
            <div className="text-center pt-4 border-t border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">
                Don't have an account?{' '}
                <AuthLink to="/signup">
                  Sign up
                </AuthLink>
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-on-surface-variant/60">
                Private. Secure. AI-powered expense insights.
              </p>
            </div>
          </AuthFormCard>
        </motion.div>
      </div>
    </PageContainer>
  )
}
