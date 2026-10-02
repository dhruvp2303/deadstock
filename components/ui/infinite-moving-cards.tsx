'use client'

import React, { useEffect, useState } from 'react'

interface InfiniteMovingCardsProps {
  items: {
    quote?: string
    name: string
    title: string
    badge?: string
    icon?: React.ReactNode
  }[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className = '',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    addAnimation()
  }, [])

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        )
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        )
      }
    }
  }

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '35s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '65s')
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ${className}`}
    >
      <ul
        ref={scrollerRef}
        className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${
          start ? 'animate-marquee' : ''
        } ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[320px] max-w-full relative rounded-2xl border border-white/10 shrink-0 px-6 py-5 md:w-[380px] bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                {item.icon && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {item.icon}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-zinc-400">{item.title}</p>
                </div>
              </div>
              {item.badge && (
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400">
                  {item.badge}
                </span>
              )}
            </div>
            {item.quote && (
              <p className="text-xs leading-relaxed text-zinc-300 line-clamp-2">
                "{item.quote}"
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
