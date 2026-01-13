"use client"

import { useEffect, useState } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function AnalyticsWrapper({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<boolean | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedConsent = localStorage.getItem("cookie_consent")
      if (storedConsent === "granted") {
        setConsent(true)
      } else if (storedConsent === "denied") {
        setConsent(false)
      } else {
        setShowBanner(true)
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "granted")
    setConsent(true)
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "denied")
    setConsent(false)
    setShowBanner(false)
  }

  return (
    <>
      {consent && <GoogleAnalytics gaId={gaId} />}

      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card/90 p-4 shadow-2xl backdrop-blur-md md:flex md:items-center md:justify-between md:gap-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">
                  Cookie Protocol
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  We use cookies to enhance your experience and analyze site traffic.
                  By connecting, you agree to our data transmission protocols.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  className="bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  className="bg-foreground text-background hover:bg-foreground/90 transition-colors border-0"
                >
                  Initialize
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
