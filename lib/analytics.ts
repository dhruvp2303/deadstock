/**
 * DeadStock Privacy-Preserving Analytics & Event Tracking Helper
 */

type EventName =
  | 'page_view'
  | 'cta_clicked'
  | 'buyer_match_viewed'
  | 'sku_created'
  | 'listing_published'
  | 'quote_requested'
  | 'pricing_plan_selected'
  | 'cookie_consent_updated'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

export const trackEvent = (eventName: EventName, properties?: EventProperties) => {
  if (typeof window === 'undefined') return

  // Check user consent
  const consent = localStorage.getItem('deadstock_cookie_consent')
  if (consent === 'essential' && eventName !== 'cookie_consent_updated') {
    return // Skip analytics if user opted for essential cookies only
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DeadStock Analytics] ${eventName}`, properties || {})
  }

  // Dispatch custom browser event for integrations (Google Tag Manager, PostHog, Vercel)
  window.dispatchEvent(
    new CustomEvent('deadstock_analytics', {
      detail: { event: eventName, ...properties, timestamp: Date.now() },
    })
  )
}
