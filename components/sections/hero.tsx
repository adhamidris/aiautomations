"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background"

export function Hero() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
            <Zap className="mr-2 h-3.5 w-3.5 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Scale your operations automatically
            </span>
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-white">
            Marketing Automation for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              High-Growth Teams
            </span>
          </h1>

          <p className="mx-auto max-w-[700px] text-zinc-300 md:text-xl">
            Expert implementation of HubSpot, n8n, Make, and Salesforce. 
            We build the systems that run your business while you sleep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/20 w-full sm:w-auto">
              Start Your Automation Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/5 hover:bg-white/10 w-full sm:w-auto">
              View Case Studies
            </Button>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
