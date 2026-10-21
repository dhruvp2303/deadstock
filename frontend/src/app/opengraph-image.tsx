import { ImageResponse } from 'next/og'

export const alt = 'DeadStock — Global Surplus Inventory Marketplace'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #072433 0%, #0A3A52 50%, #071827 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: '#38BDF8',
              transform: 'rotate(45deg)',
            }}
          />
          <span style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            DeadStock
          </span>
          <span
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38BDF8',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 700,
              marginLeft: '12px',
            }}
          >
            B2B RECOVERY NETWORK
          </span>
        </div>

        {/* Center Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              margin: 0,
            }}
          >
            Dead Stock Finds Home.
          </h1>
          <p style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '800px', margin: 0 }}>
            AI finds risky inventory early and matches it with verified industrial buyers before it turns into a loss.
          </p>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: '#34D399' }}>₹12Cr+</span>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Recovered Capital</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: '#38BDF8' }}>93%</span>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Top Buyer Match</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF' }}>2,400+</span>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Active SKUs Rescued</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
