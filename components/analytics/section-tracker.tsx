"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { isAnalyticsReady, trackEvent } from "@/lib/analytics"

interface SectionTrackerProps {
    id: string
    name: string
    children: React.ReactNode
    className?: string
    threshold?: number // How much of the section must be visible (0-1)
    minDuration?: number // Minimum time in ms to count as a "view"
}

export function SectionTracker({
    id,
    name,
    children,
    className,
    threshold = 0.2, // Default: 20% visible
    minDuration = 2000, // Default: 2 seconds
}: SectionTrackerProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { amount: threshold })
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const hasTrackedRef = useRef(false) // Track only once per session/mount? Or every time? Let's do once per mount for now to avoid spam.
    const [analyticsReady, setAnalyticsReady] = useState(() => isAnalyticsReady())

    useEffect(() => {
        const handleAnalyticsReady = () => {
            setAnalyticsReady(isAnalyticsReady())
        }

        handleAnalyticsReady()
        window.addEventListener("autom8ed:analytics-ready", handleAnalyticsReady as EventListener)

        return () => {
            window.removeEventListener("autom8ed:analytics-ready", handleAnalyticsReady as EventListener)
        }
    }, [])

    useEffect(() => {
        if (isInView && analyticsReady && !hasTrackedRef.current) {
            // Start timer
            timerRef.current = setTimeout(() => {
                const didTrack = trackEvent({
                    action: "section_view",
                    category: "navigation",
                    label: name,
                })

                if (didTrack) {
                    hasTrackedRef.current = true
                }
            }, minDuration)
        } else {
            // Clear timer if user scrolls away quickly
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [analyticsReady, isInView, name, minDuration])

    return (
        <div ref={ref} id={id} data-analytics-section={id} className={className}>
            {children}
        </div>
    )
}
