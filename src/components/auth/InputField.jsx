import React from 'react'

export default function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-on-surface">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border border-outline-variant/50 
          bg-surface-container-low/40 text-on-surface placeholder-on-surface-variant/50
          focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error/60 focus:border-error/60 focus:ring-error/20' : ''}
        `.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}
