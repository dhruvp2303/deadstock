'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Recycle, ShieldCheck, Award, Leaf } from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'

export const SustainabilitySection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const metrics = [
    {
      label: 'Inventory Recovered',
      value: 6.8, prefix: '₹', suffix: 'Cr', decimals: 1,
      sub: 'Working capital unlocked from idle lots',
      note: 'Illustrative Benchmark', noteColor: '#10B981', color: '#10B981',
      icon: <Award className="h-4 w-4" />,
    },
    {
      label: 'Units Reused',
      value: 82400, prefix: '', suffix: '', decimals: 0,
      sub: 'Industrial parts redistributed to manufacturing',
      note: '+18% Monthly Growth', noteColor: '#34D399', color: '#F8FAFF',
      icon: <Recycle className="h-4 w-4" />,
    },
    {
      label: 'Solid Waste Avoided',
      value: 14.2, prefix: '', suffix: ' Tons', decimals: 1,
      sub: 'Diverted from industrial scrap dumps',
      note: 'Scope-3 Certified Standard', noteColor: '#10B981', color: '#10B981',
      icon: <Leaf className="h-4 w-4" />,
    },
    {
      label: 'Circular Factor',
      value: 88.4, prefix: '', suffix: '%', decimals: 1,
      sub: 'Average lot recovery vs total loss',
      note: 'Audited Multi-Channel Output', noteColor: '#60A5FA', color: '#60A5FA',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ]

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#091828] to-[#0A1628]" />
      <div className="pointer-events-none absolute top-0 left-1/3 w-[500px] h-[300px] bg-green-600/8 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-blue-600/6 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400"
          >
            <Recycle className="h-3.5 w-3.5" />
            <span>Circular Economy Impact</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            Recover value.{' '}
            <span className="text-gradient-blue-green">Reduce waste.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base text-slate-400"
          >
            Every lot matched on DeadStock is an industrial asset kept in the productive economic cycle — not entering the landfill scrap stream.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card-elevated rounded-3xl p-6 space-y-2"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${m.color}18`, border: `1px solid ${m.color}40`, color: m.color }}>
                {m.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{m.label}</span>
              <div className="text-3xl font-black font-mono" style={{ color: m.color }}>
                {m.prefix}
                <NumberTicker value={m.value} decimalPlaces={m.decimals} suffix={m.suffix} />
              </div>
              <span className="text-xs text-slate-400 block leading-snug">{m.sub}</span>
              <span className="text-[10px] font-semibold font-mono block" style={{ color: m.noteColor }}>{m.note}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
