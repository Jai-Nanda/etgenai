import React from 'react'

export default function AuthDivider({ text = 'or', className = '' }) {
  return (
    <div className={`relative my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant/30"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-surface text-on-surface-variant font-medium">
          {text}
        </span>
      </div>
    </div>
  )
}
