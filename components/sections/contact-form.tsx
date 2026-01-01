"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, Terminal } from "lucide-react"
import { CyberInput, CyberTextArea } from "@/components/ui/cyber-input"
import { CyberPanel } from "@/components/ui/cyber-panel"
import { CyberBadge } from "@/components/ui/cyber-badge"
import { cn } from "@/lib/utils"

export function ContactForm() {
  const [status, setStatus] = useState<"IDLE" | "PLOTTING" | "TRANSMIT" | "SUCCESS" | "ERROR">("IDLE")
  
  // Simulated "boot up" lines for the left panel terminal
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "> SYSTEM_READY...",
    "> INITIALIZING_SECURE_UPLINK...",
    "> WAITING_FOR_INPUT..."
  ])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("PLOTTING") // Visual delay for effect
    
    // Simulate "Plotting coordinates" phase
    setTerminalLines(prev => [...prev, "> PARSING_DATA_PACKET...", "> ENCRYPTING_PAYLOAD..."])
    
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
      
      setTerminalLines(prev => [...prev, "> UPLINK_ESTABLISHED.", "> TRANSMISSION_COMPLETE."])
      setStatus("SUCCESS")
    } catch (error) {
      console.error(error)
      setTerminalLines(prev => [...prev, "> ERROR: CONNECTION_REFUSED.", "> RETRY_ADVISED."])
      setStatus("ERROR")
      setTimeout(() => setStatus("IDLE"), 4000)
    }
  }

  return (
    <section
      id="contact"
      className="relative container mx-auto max-w-7xl px-4 py-24 md:px-6 overflow-hidden"
    >
      {/* Hero-Style Background Grid (Replicated) */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
               backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)", 
               backgroundSize: "4rem 4rem" 
           }} 
      />
      
      {/* Edge Fade Mask */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] opacity-80 pointer-events-none" />

      {/* Bottom Fade for Smooth Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-0 pointer-events-none" />

      <div className="relative z-10">
      <CyberPanel variant="list" className="min-h-[620px]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Context + Terminal */}
          <div className="flex flex-col justify-between border-b border-white/5 bg-black/50 px-8 py-10 md:px-12 md:py-14 md:border-b-0 md:border-r">
            <div className="space-y-8">
              <CyberBadge
                text={status === "IDLE" ? "SYSTEM_ONLINE" : status}
                status={status === "IDLE" ? "online" : "audit"}
                className="border-none"
              />
              <div className="space-y-4">
                <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Direct <span className="text-white/50">Uplink</span>
                </h2>
                <p className="max-w-sm font-mono text-sm leading-relaxed text-white/40">
                  Initialize a secure channel to our ops team. All transmissions are encrypted end-to-end.
                </p>
              </div>
            </div>

            {/* Terminal Removed */}

          </div>

          {/* Right: Pure Form */}
          <div className="flex flex-col justify-center bg-white/[0.02] px-8 py-10 md:px-12 md:py-14">
            {status === "SUCCESS" ? (
              <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                >
                  <CheckCircle className="h-10 w-10" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl text-white">
                    Transmission Received
                  </h3>
                  <p className="font-mono text-sm text-white/40">
                    Ref ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("IDLE");
                    setTerminalLines(["> SYSTEM_RESET...", "> READY."]);
                  }}
                  className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                >
                  [ INITIALIZE_NEW ]
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
                <CyberInput
                  label="OPERATOR_NAME"
                  name="name"
                  placeholder="Enter designation..."
                  required
                />
                <CyberInput
                  label="CONTACT_UPLINK"
                  name="email"
                  type="email"
                  placeholder="name@organization.com"
                  required
                />
                <CyberTextArea
                  label="MISSION_BRIEF"
                  name="message"
                  placeholder="Describe tactical requirements..."
                  required
                />
                <Button
                  type="submit"
                  disabled={status !== "IDLE"}
                  className={cn(
                    "h-12 w-full rounded-sm border text-xs font-mono uppercase tracking-widest transition-all",
                    status === "IDLE"
                      ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white"
                      : "border-accent/20 bg-accent/10 text-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {status === "IDLE" ? (
                      <>Initialize_Audit <Terminal className="h-3 w-3" /></>
                    ) : (
                      "Processing..."
                    )}
                  </span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </CyberPanel>
      </div>
    </section>
  )
}
