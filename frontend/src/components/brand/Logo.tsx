'use client'

import React from 'react'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withTagline?: boolean
  variant?: 'auto' | 'light' | 'dark'
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  withTagline = false,
  variant = 'auto',
}) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const deadColor =
    variant === 'dark'
      ? 'text-white'
      : variant === 'light'
      ? 'text-zinc-900'
      : 'text-zinc-900 dark:text-zinc-100'

  const stockColor =
    variant === 'dark'
      ? 'text-[#14B8A6]'
      : variant === 'light'
      ? 'text-[#0D9488]'
      : 'text-[#0D9488] dark:text-[#14B8A6]'

  const taglineColor =
    variant === 'dark'
      ? 'text-zinc-400'
      : variant === 'light'
      ? 'text-zinc-500'
      : 'text-zinc-500 dark:text-zinc-400'

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact Isometric Crate Brand Icon Mark */}
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="190,86 190,166 120,206 120,126" fill="#CBD5E1" />
        <polygon points="50,86 50,166 120,206 120,126" fill="#94A3B8" />
        <line x1="50" y1="106" x2="120" y2="146" stroke="#7C8CA3" strokeWidth="1.5" />
        <line x1="50" y1="126" x2="120" y2="166" stroke="#7C8CA3" strokeWidth="1.5" />
        <line x1="50" y1="146" x2="120" y2="186" stroke="#7C8CA3" strokeWidth="1.5" />
        <line x1="190" y1="106" x2="120" y2="146" stroke="#B7C2D0" strokeWidth="1.5" />
        <line x1="190" y1="126" x2="120" y2="166" stroke="#B7C2D0" strokeWidth="1.5" />
        <line x1="190" y1="146" x2="120" y2="186" stroke="#B7C2D0" strokeWidth="1.5" />
        <polygon points="120,46 190,86 120,126 50,86" fill="url(#logoTopGrad)" />
        <path
          d="M120 78 L150 62 L142 62 L142 44 L128 44 L128 58 L120 58 Z"
          fill="#F8FAFC"
          transform="rotate(-8 135 60)"
        />
        <defs>
          <linearGradient
            id="logoTopGrad"
            x1="50"
            y1="46"
            x2="190"
            y2="126"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#14B8A6" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wordmark: DeadStock with Teal Accent on "Stock" */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight ${textSizes[size]}`}>
            <span className={deadColor}>Dead</span>
            <span className={stockColor}>Stock</span>
          </div>
          {withTagline && (
            <span
              className={`font-bold tracking-wider uppercase mt-1 ${taglineColor} ${
                size === 'sm'
                  ? 'text-[10px]'
                  : size === 'md'
                  ? 'text-[11px]'
                  : 'text-xs'
              }`}
            >
              Surplus Inventory, Recovered
            </span>
          )}
        </div>
      )}
    </div>
  )
}

