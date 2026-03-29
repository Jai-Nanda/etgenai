import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthLink({
  to,
  children,
  className = ''
}) {
  return (
    <Link 
      to={to}
      className={`text-primary hover:text-primary/80 text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </Link>
  )
}
