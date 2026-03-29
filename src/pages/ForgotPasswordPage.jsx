import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import AuthFormCard from '../components/auth/AuthFormCard'
import InputField from '../components/auth/InputField'
import Button from '../components/Button'
import AuthLink from '../components/auth/AuthLink'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { forgotPassword, isLoading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) return
    
    try {
      await forgotPassword(email)
      setSuccess(true)
    } catch (error) {
      setError('Failed to send reset link')
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  if (success) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <AuthFormCard
              title="Reset link sent"
              subtitle="Check your email for instructions to reset your password"
            >
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 text-secondary mb-6"
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
                
                <p className="text-on-surface-variant mb-6">
                  We've sent a password reset link to:
                </p>
                
                <div className="p-3 rounded-lg bg-surface-container-low/40 border border-outline-variant/30 mb-6">
                  <p className="font-medium text-on-surface">{email}</p>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Back to sign in
                  </Button>
                  
                  <AuthLink to="/signup" className="block text-center">
                    Create a new account
                  </AuthLink>
                </div>
              </div>
            </AuthFormCard>
          </motion.div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <AuthFormCard
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a link to reset your password"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30">
                  <p className="text-sm text-error text-center">{error}</p>
                </div>
              )}
              
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                error={error}
                required
                icon={Mail}
              />
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-primary-container font-semibold rounded-xl shadow-[0_0_40px_-10px_rgba(173,198,255,0.4)] hover:shadow-[0_0_50px_-5px_rgba(173,198,255,0.6)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </motion.button>
            </form>
            
            <div className="text-center pt-4 border-t border-outline-variant/20">
              <AuthLink to="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </AuthLink>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-on-surface-variant/60">
                Private. Secure. Story-driven finance insights.
              </p>
            </div>
          </AuthFormCard>
        </motion.div>
      </div>
    </PageContainer>
  )
}
