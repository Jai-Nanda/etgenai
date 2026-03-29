import React from 'react'
import { motion } from 'framer-motion'
import Button from '../Button'

export default function SocialLoginButton({
  provider,
  icon: Icon,
  onClick,
  loading = false,
  disabled = false,
  className = ''
}) {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          label: 'Continue with Google',
          variant: 'secondary',
          className: 'border-[#4285f4]/20 hover:border-[#4285f4]/40 hover:bg-[#4285f4]/5'
        }
      default:
        return {
          label: `Continue with ${provider}`,
          variant: 'secondary'
        }
    }
  }

  const config = getProviderConfig()

  return (
    <Button
      variant={config.variant}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={`w-full ${config.className} ${className}`}
      leftIcon={Icon}
    >
      {config.label}
    </Button>
  )
}
