'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ShimmerButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className = '',
  shimmerColor = '#06b6d4',
  shimmerSize = '0.1em',
  borderRadius = '9999px',
  shimmerDuration = '3s',
  background = 'rgba(8, 10, 16, 0.95)',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as React.CSSProperties
      }
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 font-semibold text-white [background:var(--bg)] [border-radius:var(--radius)] ${className}`}
      {...props}
    >
      {/* Spark container */}
      <div className="pointer-events-none absolute -inset-[100%] z-[-1] [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] w-[100cqw] animate-[conic-spin_3s_linear_infinite] [background:conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_140deg,var(--shimmer-color)_180deg,transparent_220deg,transparent_360deg)]" />
      </div>

      {/* Backdrop fill */}
      <div className="absolute inset-[1px] -z-[1] rounded-[inherit] bg-[#080a10]/90 backdrop-blur-md transition-colors group-hover:bg-[#0c101b]" />

      {/* Inner subtle glow */}
      <div className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]" />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
