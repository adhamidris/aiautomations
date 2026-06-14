import { sendGAEvent } from "@next/third-parties/google"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type GAEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

export const isAnalyticsReady = () => {
  if (typeof window === "undefined") {
    return false
  }

  return typeof window.gtag === "function" || Array.isArray(window.dataLayer)
}

export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (!isAnalyticsReady()) {
    return false
  }

  sendGAEvent("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })

  return true
}
