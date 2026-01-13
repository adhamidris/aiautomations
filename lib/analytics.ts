import { sendGAEvent } from "@next/third-parties/google"

type GAEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window.gtag !== "undefined") {
    sendGAEvent("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
