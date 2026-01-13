"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { CyberInput, CyberTextArea } from "@/components/ui/cyber-input"
import { CyberPanel } from "@/components/ui/cyber-panel"
import { CyberBadge } from "@/components/ui/cyber-badge"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

export function ContactForm() {
  const [status, setStatus] = useState<"IDLE" | "PLOTTING" | "TRANSMIT" | "SUCCESS" | "ERROR">("IDLE")

  // Simulated "boot up" lines for the left panel terminal
  // const [terminalLines, setTerminalLines] = useState<string[]>([
  //   "> SYSTEM_READY...",
  //   "> INITIALIZING_SECURE_UPLINK...",
  //   "> WAITING_FOR_INPUT..."
  // ])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("PLOTTING") // Visual delay for effect

    // Simulate "Plotting coordinates" phase
    // setTerminalLines(prev => [...prev, "> PARSING_DATA_PACKET...", "> ENCRYPTING_PAYLOAD..."])

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // Artificial delay for the "Tech" feel before network request
    await new Promise(resolve => setTimeout(resolve, 800))
    setStatus("TRANSMIT")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) throw new Error("Failed to submit")

      trackEvent({
        action: "form_submit",
        category: "contact",
        label: "lead_generation",
      })

      // setTerminalLines(prev => [...prev, "> UPLINK_ESTABLISHED.", "> TRANSMISSION_COMPLETE."])
      setStatus("SUCCESS")
    } catch (error) {
      console.error(error)
      // setTerminalLines(prev => [...prev, "> ERROR: CONNECTION_REFUSED.", "> RETRY_ADVISED."])
      setStatus("ERROR")
      setTimeout(() => setStatus("IDLE"), 4000)
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full pt-8 pb-32 md:pt-24 md:pb-64 overflow-hidden"
    >
      {/* Technical Background Grid - uses CSS variable for color */}
      <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-20 pointer-events-none" />

      {/* Edge Fade Mask */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-40 pointer-events-none" />

      {/* Top Fade for Smooth Transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      {/* Bottom Fade for Smooth Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6">
        <CyberPanel variant="list" className="min-h-0 md:min-h-[620px]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Context + Terminal */}
            <div className="flex flex-col justify-between border-b border-border bg-card/50 px-6 py-8 md:px-12 md:py-14 md:border-b-0 md:border-r">
              <div className="space-y-6 md:space-y-8">
                <CyberBadge
                  text={status === "IDLE" ? "Contact Us" : status}
                  status={status === "IDLE" ? "online" : "audit"}
                  className="border-none"
                />
                <div className="space-y-3 md:space-y-4">
                  <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                    Get in <span className="text-muted-foreground">Touch</span>
                  </h2>
                </div>
              </div>

              {/* Terminal Removed */}

            </div>

            {/* Right: Pure Form */}
            <div className="flex flex-col justify-center bg-foreground/[0.02] px-6 py-8 md:px-12 md:py-14 relative md:overflow-hidden">
              <motion.div layout className="w-full relative z-10">
                <AnimatePresence mode="wait">
                  {status === "SUCCESS" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col items-center justify-center space-y-8 text-center py-10"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/40 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
                      >
                        <CheckCircle className="h-12 w-12" strokeWidth={1.5} />
                        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse" />
                      </motion.div>

                      <div className="space-y-3 max-w-xs mx-auto">
                        <h3 className="font-heading text-3xl font-bold text-foreground tracking-tight">
                          Message Sent
                        </h3>
                        <p className="font-sans text-base leading-relaxed text-muted-foreground">
                          Thanks for reaching out! We&apos;ve received your inquiry and will be in touch shortly.
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setStatus("IDLE");
                          // setTerminalLines(["> SYSTEM_RESET...", "> READY."]);
                        }}
                        className="mt-4 border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="w-full max-w-md mx-auto space-y-6"
                    >
                      <CyberInput
                        label="Name"
                        name="name"
                        placeholder="Enter your name"
                        required
                      />
                      <CyberInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+123 456 7890"
                        required
                      />
                      <CyberInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                      />
                      <CyberTextArea
                        label="Message"
                        name="message"
                        placeholder="How can we help you?"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={status !== "IDLE"}
                        className={cn(
                          "h-12 w-full rounded-md border text-sm font-medium transition-all duration-300",
                          status === "IDLE"
                            ? "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                            : "border-accent/20 bg-accent/10 text-accent"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {status === "IDLE" ? (
                            <>Send Message</>
                          ) : (
                            "Sending..."
                          )}
                        </span>
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </CyberPanel>
      </div>
    </section>
  )
}
