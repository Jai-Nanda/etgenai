import React from 'react'
import GlassCard from '../GlassCard'

export default function AuthFormCard({ 
  children, 
  title, 
  subtitle, 
  className = '',
  maxWidth = 'max-w-md' 
}) {
  return (
    <div className={`w-full ${maxWidth} mx-auto`}>
      <GlassCard className={`p-8 sm:p-10 ${className}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </GlassCard>
    </div>
  )
}
