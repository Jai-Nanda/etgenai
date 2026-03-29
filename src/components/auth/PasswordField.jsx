import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  showToggle = true,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-on-surface">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant/50 
            bg-surface-container-low/40 text-on-surface placeholder-on-surface-variant/50
            focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error/60 focus:border-error/60 focus:ring-error/20' : ''}
          `.trim()}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={togglePassword}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-container-high/50 transition-colors disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-on-surface-variant" />
            ) : (
              <Eye className="w-4 h-4 text-on-surface-variant" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}
