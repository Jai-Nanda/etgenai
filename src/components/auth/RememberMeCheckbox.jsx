import React from 'react'

export default function RememberMeCheckbox({
  checked,
  onChange,
  disabled = false,
  className = ''
}) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-outline-variant/50 bg-surface-container-low/40 text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary/60"
      />
      <span className="text-sm text-on-surface-variant select-none">
        Remember me
      </span>
    </label>
  )
}
