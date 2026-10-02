'use client'

import React from 'react'

const LOGOS = [
  'ElectroTech',
  'NOVA',
  'Pioneer Steel',
  'Kiran Plastics',
  'Apex Mills',
]

export const DSTrustedLogos: React.FC = () => (
  <section className="py-10 px-6 bg-white border-b border-gray-100">
    <div className="max-w-[1360px] mx-auto text-center">
      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-6">
        Trusted by 2,400+ sellers and buyers across India
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 sm:gap-x-16 gap-y-4">
        {LOGOS.map((name) => (
          <span
            key={name}
            className="text-base sm:text-lg font-bold tracking-tight text-gray-400 hover:text-[#0B1E2D] transition-colors duration-200 select-none cursor-default"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
)

