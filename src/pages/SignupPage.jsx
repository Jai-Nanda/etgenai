import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import AuthFormCard from '../components/auth/AuthFormCard'
import InputField from '../components/auth/InputField'
import PasswordField from '../components/auth/PasswordField'
import SocialLoginButton from '../components/auth/SocialLoginButton'
import AuthDivider from '../components/auth/AuthDivider'
import AuthLink from '../components/auth/AuthLink'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, loginWithGoogle, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await signup(formData.name, formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: 'Failed to create account' })
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: 'Google signup failed' })
    }
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
            title="Create your account"
            subtitle="Start your expense tracking with AI-powered insights"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30">
                  <p className="text-sm text-error text-center">{errors.general}</p>
                </div>
              )}
              
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                required
              />
              
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />
              
              <PasswordField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-primary-container font-semibold rounded-xl shadow-[0_0_40px_-10px_rgba(173,198,255,0.4)] hover:shadow-[0_0_50px_-5px_rgba(173,198,255,0.6)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </motion.button>
            </form>
            
            <AuthDivider />
            
            <SocialLoginButton
              provider="google"
              icon={Chrome}
              onClick={handleGoogleSignup}
              loading={isLoading}
            />
            
            <div className="text-center pt-4 border-t border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">
                Already have an account?{' '}
                <AuthLink to="/login">
                  Sign in
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
