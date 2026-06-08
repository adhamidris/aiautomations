"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Send, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/i18n-config"

interface ChatCopy {
  badge: string
  title: string
  subtitle: string
  mobileNudges: string[]
  placeholder: string
  send: string
  thinking: string
  openLabel: string
  closeLabel: string
  statusReady: string
  statusCaptured: string
  intro: string
  prompts: string[]
}

interface DodzieChatWidgetProps {
  lang: Locale
  copy: ChatCopy
}

interface UiMessage {
  id: string
  role: "assistant" | "user" | "system"
  content: string
}

interface ChatApiResponse {
  reply: string
  language: "en" | "ar"
  leadSubmitted?: boolean
  code?: string
  error?: string
}

function getStorageKey(lang: Locale) {
  return `autom8ed:dodzie-chat:${lang}`
}

const MAX_MOBILE_NUDGE_SHOWS = 3

function buildSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}`
}

function getActiveSectionId() {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-analytics-section], section[id]")
  )

  if (!sections.length) {
    return undefined
  }

  const viewportCenter = window.innerHeight / 2
  let bestId: string | undefined
  let bestDistance = Number.POSITIVE_INFINITY

  for (const section of sections) {
    const sectionId = section.dataset.analyticsSection || section.id

    if (!sectionId) {
      continue
    }

    const rect = section.getBoundingClientRect()
    const sectionCenter = rect.top + rect.height / 2
    const distance = Math.abs(sectionCenter - viewportCenter)

    if (rect.bottom > 0 && rect.top < window.innerHeight && distance < bestDistance) {
      bestDistance = distance
      bestId = sectionId
    }
  }

  return bestId
}

export function DodzieChatWidget({ lang, copy }: DodzieChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [showMobileNudge, setShowMobileNudge] = useState(false)
  const [mobileNudgeDismissed, setMobileNudgeDismissed] = useState(false)
  const [mobileNudgeShows, setMobileNudgeShows] = useState(0)
  const [consentResolved, setConsentResolved] = useState(false)
  const [isDodzieDemoOpen, setIsDodzieDemoOpen] = useState(false)
  const [isLauncherVisible, setIsLauncherVisible] = useState(false)
  const [isMobileCtaVisible, setIsMobileCtaVisible] = useState(false)
  const [isMobileContactVisible, setIsMobileContactVisible] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [mobileVisibleHeight, setMobileVisibleHeight] = useState<number | null>(null)
  const [isPanelEntered, setIsPanelEntered] = useState(false)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const scrollMetricsRef = useRef<{
    scrollTop: number
    scrollHeight: number
    clientHeight: number
  } | null>(null)

  const storageKey = useMemo(() => getStorageKey(lang), [lang])
  const hasUserMessages = messages.some((message) => message.role === "user")
  const isMobileSheet = isMobileViewport && isOpen
  const activeMobileNudge =
    copy.mobileNudges[
      Math.min(Math.max(mobileNudgeShows - 1, 0), Math.max(copy.mobileNudges.length - 1, 0))
    ] ?? ""

  const dismissMobileNudge = useCallback(() => {
    setShowMobileNudge(false)
    setMobileNudgeDismissed(true)
    window.sessionStorage.setItem(`${storageKey}:mobile-nudge-dismissed`, "true")
  }, [storageKey])

  const syncMobileViewportState = useCallback(() => {
    const nextHeight = window.visualViewport?.height ?? window.innerHeight
    setMobileVisibleHeight(Math.round(nextHeight))
  }, [])

  const closeChat = useCallback(() => {
    const finalizeClose = () => {
      setIsInputFocused(false)
      syncMobileViewportState()
      setIsOpen(false)
    }

    trackEvent({
      action: "dodzie_chat_close",
      category: "assistant",
      label: lang,
    })

    if (window.innerWidth >= 768) {
      finalizeClose()
      return
    }

    const activeElement = document.activeElement
    if (
      activeElement instanceof HTMLElement &&
      (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
    ) {
      activeElement.blur()
    }

    const viewport = window.visualViewport
    if (!viewport) {
      window.setTimeout(finalizeClose, 140)
      return
    }

    const targetHeight = Math.round(window.innerHeight)
    let lastHeight = Math.round(viewport.height)
    let stableFrames = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      viewport.removeEventListener("resize", checkViewport)
      viewport.removeEventListener("scroll", checkViewport)
      window.clearTimeout(fallbackTimer)
      finalizeClose()
    }

    const checkViewport = () => {
      const currentHeight = Math.round(viewport.height)
      const nearRestored = currentHeight >= targetHeight - 6
      const unchanged = Math.abs(currentHeight - lastHeight) <= 1

      stableFrames = nearRestored || unchanged ? stableFrames + 1 : 0
      lastHeight = currentHeight

      if (nearRestored || stableFrames >= 2) {
        finish()
      }
    }

    const fallbackTimer = window.setTimeout(finish, 420)

    viewport.addEventListener("resize", checkViewport)
    viewport.addEventListener("scroll", checkViewport)
    window.requestAnimationFrame(checkViewport)
  }, [lang, syncMobileViewportState])

  const openChat = useCallback(() => {
    if (window.innerWidth < 768) {
      syncMobileViewportState()
    }

    setIsOpen(true)
    setShowMobileNudge(false)
    trackEvent({
      action: "dodzie_chat_open",
      category: "assistant",
      label: lang,
    })
  }, [lang, syncMobileViewportState])

  useEffect(() => {
    const syncViewport = () => setIsMobileViewport(window.innerWidth < 768)
    syncViewport()
    window.addEventListener("resize", syncViewport)
    return () => window.removeEventListener("resize", syncViewport)
  }, [])

  useEffect(() => {
    const storedConsent = window.localStorage.getItem("cookie_consent")
    if (storedConsent === "granted" || storedConsent === "denied") {
      setConsentResolved(true)
      setIsLauncherVisible(true)
    }

    const handleConsentResolved = () => {
      setConsentResolved(true)
      requestAnimationFrame(() => {
        setIsLauncherVisible(true)
      })
    }

    const handleDemoVisibility = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen?: boolean }>
      const nextIsOpen = Boolean(customEvent.detail?.isOpen)
      setIsDodzieDemoOpen(nextIsOpen)

      if (nextIsOpen) {
        setIsOpen(false)
        setShowMobileNudge(false)
      }
    }

    const handleMobileCtaVisibility = (
      event: Event
    ) => {
      const customEvent = event as CustomEvent<{
        isVisible?: boolean
        isContactVisible?: boolean
      }>

      setIsMobileCtaVisible(Boolean(customEvent.detail?.isVisible))
      setIsMobileContactVisible(Boolean(customEvent.detail?.isContactVisible))
    }

    window.addEventListener(
      "autom8ed:cookie-consent-resolved",
      handleConsentResolved as EventListener
    )
    window.addEventListener(
      "autom8ed:dodzie-demo-visibility",
      handleDemoVisibility as EventListener
    )
    window.addEventListener(
      "autom8ed:mobile-cta-visibility",
      handleMobileCtaVisibility as EventListener
    )

    return () => {
      window.removeEventListener(
        "autom8ed:cookie-consent-resolved",
        handleConsentResolved as EventListener
      )
      window.removeEventListener(
        "autom8ed:dodzie-demo-visibility",
        handleDemoVisibility as EventListener
      )
      window.removeEventListener(
        "autom8ed:mobile-cta-visibility",
        handleMobileCtaVisibility as EventListener
      )
    }
  }, [])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("autom8ed:chat-visibility", {
        detail: {
          isOpen,
          isInputFocused,
        },
      })
    )
  }, [isInputFocused, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsPanelEntered(false)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      setIsPanelEntered(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isMobileViewport || !isOpen) {
      setMobileVisibleHeight(null)
      return
    }

    syncMobileViewportState()
    window.visualViewport?.addEventListener("resize", syncMobileViewportState)
    window.addEventListener("resize", syncMobileViewportState)

    return () => {
      window.visualViewport?.removeEventListener("resize", syncMobileViewportState)
      window.removeEventListener("resize", syncMobileViewportState)
    }
  }, [isMobileViewport, isOpen, syncMobileViewportState])

  useLayoutEffect(() => {
    if (!isMobileSheet) {
      scrollMetricsRef.current = null
      return
    }

    const scroller = viewportRef.current
    if (!scroller) {
      return
    }

    const previousMetrics = scrollMetricsRef.current
    const currentMetrics = {
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
    }

    if (
      previousMetrics &&
      previousMetrics.clientHeight !== currentMetrics.clientHeight
    ) {
      const previousBottomOffset =
        previousMetrics.scrollHeight - previousMetrics.scrollTop - previousMetrics.clientHeight
      const nextScrollTop = Math.max(
        0,
        scroller.scrollHeight - scroller.clientHeight - previousBottomOffset
      )

      scroller.scrollTop = nextScrollTop
      currentMetrics.scrollTop = nextScrollTop
    }

    scrollMetricsRef.current = currentMetrics
  }, [isMobileSheet, mobileVisibleHeight])

  useEffect(() => {
    if (!isMobileViewport || !isOpen) {
      return
    }

    const lockedScrollY = window.scrollY
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior
    const previousHtmlScrollBehavior = document.documentElement.style.scrollBehavior
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior

    document.documentElement.style.overflow = "hidden"
    document.documentElement.style.overscrollBehavior = "none"
    document.documentElement.style.scrollBehavior = "auto"
    document.body.style.overflow = "hidden"
    document.body.style.overscrollBehavior = "none"

    let restoringScroll = false

    const keepPageLocked = () => {
      if (restoringScroll) return

      if (Math.abs(window.scrollY - lockedScrollY) > 1) {
        restoringScroll = true
        window.scrollTo(0, lockedScrollY)
        window.requestAnimationFrame(() => {
          restoringScroll = false
        })
      }
    }

    const preventBackgroundScroll = (event: TouchEvent | WheelEvent) => {
      const target = event.target as Node | null
      const scroller = viewportRef.current

      if (scroller && target && scroller.contains(target)) {
        return
      }

      event.preventDefault()
    }

    document.addEventListener("touchmove", preventBackgroundScroll, { passive: false })
    document.addEventListener("wheel", preventBackgroundScroll, { passive: false })
    window.addEventListener("scroll", keepPageLocked, { passive: true })

    return () => {
      document.removeEventListener("touchmove", preventBackgroundScroll)
      document.removeEventListener("wheel", preventBackgroundScroll)
      window.removeEventListener("scroll", keepPageLocked)
      document.documentElement.style.overflow = previousHtmlOverflow
      document.documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior
      document.documentElement.style.scrollBehavior = "auto"
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior

      if (Math.abs(window.scrollY - lockedScrollY) > 1) {
        window.scrollTo(0, lockedScrollY)
      }

      window.requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior
      })
    }
  }, [isMobileViewport, isOpen])

  useEffect(() => {
    const stored = window.sessionStorage.getItem(storageKey)
    const storedSessionId = window.sessionStorage.getItem(`${storageKey}:session`)
    const storedDismissed = window.sessionStorage.getItem(
      `${storageKey}:mobile-nudge-dismissed`
    )
    const storedNudgeShows = window.sessionStorage.getItem(
      `${storageKey}:mobile-nudge-shows`
    )

    if (storedDismissed === "true") {
      setMobileNudgeDismissed(true)
    }

    if (storedNudgeShows) {
      const parsedShows = Number.parseInt(storedNudgeShows, 10)
      if (Number.isFinite(parsedShows) && parsedShows >= 0) {
        setMobileNudgeShows(parsedShows)
      }
    }

    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      const nextSessionId = buildSessionId()
      window.sessionStorage.setItem(`${storageKey}:session`, nextSessionId)
      setSessionId(nextSessionId)
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UiMessage[]
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed)
          return
        }
      } catch (error) {
        console.error("Unable to restore Dodzie chat state:", error)
      }
    }

    setMessages([
      {
        id: "intro",
        role: "assistant",
        content: copy.intro,
      },
    ])
  }, [copy.intro, storageKey])

  useEffect(() => {
    if (!messages.length) return
    window.sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-20)))
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: isMobileSheet ? "auto" : "smooth",
    })
    if (viewportRef.current) {
      scrollMetricsRef.current = {
        scrollTop: viewportRef.current.scrollTop,
        scrollHeight: viewportRef.current.scrollHeight,
        clientHeight: viewportRef.current.clientHeight,
      }
    }
  }, [isMobileSheet, messages, storageKey])

  useEffect(() => {
    if (!isOpen || !messages.length || !viewportRef.current) {
      return
    }

    viewportRef.current.scrollTop = viewportRef.current.scrollHeight
    scrollMetricsRef.current = {
      scrollTop: viewportRef.current.scrollTop,
      scrollHeight: viewportRef.current.scrollHeight,
      clientHeight: viewportRef.current.clientHeight,
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (!consentResolved || isDodzieDemoOpen || !isMobileViewport || isOpen || mobileNudgeDismissed) {
      setShowMobileNudge(false)
      return
    }

    let showTimer: number | null = null
    let hideTimer: number | null = null
    let cancelled = false

    const scheduleCycle = (delayMs: number) => {
      showTimer = window.setTimeout(() => {
        if (cancelled) return
        const showsKey = `${storageKey}:mobile-nudge-shows`
        const currentShows = Number.parseInt(
          window.sessionStorage.getItem(showsKey) ?? "0",
          10
        )

        if (currentShows >= MAX_MOBILE_NUDGE_SHOWS) {
          dismissMobileNudge()
          return
        }

        const nextShows = currentShows + 1
        window.sessionStorage.setItem(showsKey, String(nextShows))
        setMobileNudgeShows(nextShows)
        setShowMobileNudge(true)

        hideTimer = window.setTimeout(() => {
          if (cancelled) return
          setShowMobileNudge(false)

          if (nextShows >= MAX_MOBILE_NUDGE_SHOWS) {
            dismissMobileNudge()
            return
          }

          scheduleCycle(18000)
        }, 8000)
      }, delayMs)
    }

    scheduleCycle(8000)

    return () => {
      cancelled = true
      if (showTimer) window.clearTimeout(showTimer)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [consentResolved, dismissMobileNudge, isDodzieDemoOpen, isMobileViewport, isOpen, mobileNudgeDismissed, storageKey])

  useEffect(() => {
    if (mobileNudgeDismissed) {
      return
    }

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('a[href="#contact"]')) {
        dismissMobileNudge()
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest("#contact form")) {
        dismissMobileNudge()
      }
    }

    document.addEventListener("click", handleDocumentClick)
    document.addEventListener("focusin", handleFocusIn)

    return () => {
      document.removeEventListener("click", handleDocumentClick)
      document.removeEventListener("focusin", handleFocusIn)
    }
  }, [dismissMobileNudge, mobileNudgeDismissed])

  async function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed || isLoading || !sessionId) return
    const activeSectionId = getActiveSectionId()

    const nextUserMessage: UiMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    }

    const nextMessages = [...messages, nextUserMessage]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    trackEvent({
      action: "dodzie_chat_send",
      category: "assistant",
      label: activeSectionId ?? lang,
      value: trimmed.length,
    })

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          locale: lang,
          pathname: window.location.pathname,
          activeSection: activeSectionId,
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Response body is not readable")
      }

      const decoder = new TextDecoder()
      let buffer = ""
      let partialReply = ""
      let leadSubmitted = false
      let assistantMessageId: string | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          const cleanLine = line.trim()
          if (!cleanLine) continue

          try {
            const chunk = JSON.parse(cleanLine)
            if (chunk.type === "text") {
              partialReply += chunk.content
              
              if (!assistantMessageId) {
                setIsLoading(false)
                assistantMessageId = `${Date.now()}-assistant`
                setMessages((current) => [
                  ...current,
                  {
                    id: assistantMessageId!,
                    role: "assistant",
                    content: chunk.content,
                  },
                ])
              } else {
                setMessages((current) =>
                  current.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: partialReply }
                      : msg
                  )
                )
              }
            } else if (chunk.type === "meta") {
              leadSubmitted = chunk.leadSubmitted
            } else if (chunk.type === "error") {
              throw new Error(chunk.error)
            }
          } catch (e) {
            console.error("Error parsing stream chunk:", e)
          }
        }
      }

      if (leadSubmitted) {
        trackEvent({
          action: "dodzie_chat_lead_captured",
          category: "assistant",
          label: lang,
        })
      }
    } catch (error) {
      console.error(error)
      setMessages((current) => {
        const lastMsg = current[current.length - 1]
        if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content) {
          return [
            ...current.slice(0, -1),
            {
              id: `${Date.now()}-error`,
              role: "system",
              content:
                lang === "ar"
                  ? "تعذر إكمال الرد حالياً. جرّب مرة أخرى بعد لحظة."
                  : "Unable to complete that reply right now. Try again in a moment.",
            },
          ]
        }
        return [
          ...current,
          {
            id: `${Date.now()}-error`,
            role: "system",
            content:
              lang === "ar"
                ? "تعذر إكمال الرد حالياً. جرّب مرة أخرى بعد لحظة."
                : "Unable to complete that reply right now. Try again in a moment.",
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await sendMessage(input)
  }

  const shouldRenderLauncher =
    consentResolved &&
    !isDodzieDemoOpen &&
    !(isMobileViewport && isMobileContactVisible && !isOpen)
  const launcherVisibilityClass = isLauncherVisible
    ? "translate-y-0 opacity-100"
    : "translate-y-2 opacity-0"
  const launcherBottomClass =
    isMobileViewport && !isMobileCtaVisible ? "bottom-5" : "bottom-24 md:bottom-6"
  const mobileSheetHeight =
    isMobileSheet && mobileVisibleHeight
      ? Math.max(320, Math.round(mobileVisibleHeight - 16))
      : undefined
  const rootClassName = isMobileSheet
    ? `fixed inset-x-3 z-[70] flex items-stretch ${shouldRenderLauncher ? "opacity-100" : "pointer-events-none opacity-0"}`
    : `fixed right-4 z-[70] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-3 transition-all duration-300 md:right-6 ${launcherBottomClass} ${shouldRenderLauncher ? launcherVisibilityClass : "pointer-events-none opacity-0"}`
  const openPanelClassName = isMobileSheet
    ? `flex w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/95 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl max-md:h-full max-md:w-full max-md:origin-bottom max-md:transition-[opacity,transform] max-md:duration-300 ${isPanelEntered ? "max-md:translate-y-0 max-md:opacity-100" : "max-md:translate-y-4 max-md:opacity-0"}`
    : "flex w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/95 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl max-md:h-full max-md:w-full"

  return (
    <div
      className={rootClassName}
      aria-hidden={!shouldRenderLauncher}
      style={
        isMobileSheet && mobileSheetHeight
          ? {
              top: "8px",
              height: `${mobileSheetHeight}px`,
            }
          : undefined
      }
    >
      {isOpen ? (
        <div className={openPanelClassName}>
          <div className="relative overflow-hidden border-b border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(255,186,92,0.22),transparent_44%),linear-gradient(135deg,#ffffff_0%,#f6f1ea_100%)] px-5 py-4">
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/70">
                  <Image
                    src="/dodzie/dodziecs-cropped.png"
                    alt="Dodzie"
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
                    {copy.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-foreground/68">
                    {copy.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeChat}
                aria-label={copy.closeLabel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white transition hover:bg-black/90"
              >
                <X className="h-4 w-4 text-white" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            onScroll={(event) => {
              const scroller = event.currentTarget
              scrollMetricsRef.current = {
                scrollTop: scroller.scrollTop,
                scrollHeight: scroller.scrollHeight,
                clientHeight: scroller.clientHeight,
              }
            }}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,rgba(250,247,241,0.58)_0%,rgba(255,255,255,0.86)_100%)] px-4 py-4 md:max-h-[24rem]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[1.3rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : message.role === "system"
                        ? "border border-amber-300/70 bg-amber-50 text-amber-950 shadow-none"
                      : "border border-black/8 bg-white text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-[1.3rem] border border-black/8 bg-white/90 backdrop-blur-md px-4 py-3 text-sm text-foreground/80 shadow-sm">
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-t-2 border-r-2 border-transparent border-t-[#ff2ea0] border-r-[#2e6cff] animate-spin" style={{ animationDuration: "1.2s" }} />
                    <div className="absolute inset-0.5 rounded-full border border-t-2 border-l-2 border-transparent border-t-[#a855f7] border-l-[#ff2ea0] animate-spin" style={{ animationDuration: "1.8s", animationDirection: "reverse" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-[#ff2ea0] to-[#2e6cff] animate-pulse" />
                  </div>
                  <span className="font-semibold bg-gradient-to-r from-[#ff2ea0] via-[#a855f7] to-[#2e6cff] bg-clip-text text-transparent animate-pulse" style={{ animationDuration: "2s" }}>
                    {lang === "ar" ? "دودزي يجهّز الرد..." : "Dodzie is crafting a response..."}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-black/8 bg-white px-4 py-4">
            {!hasUserMessages ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {copy.prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-full border border-black/10 bg-[#f5f1eb] px-3 py-1.5 text-left text-xs font-medium text-foreground/78 transition hover:bg-[#ede6dc]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#fcfbf8] transition focus-within:border-black/20 focus-within:bg-white">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      void sendMessage(input)
                    }
                  }}
                  placeholder={copy.placeholder}
                  className="h-14 w-full bg-transparent px-4 pr-18 text-base text-foreground outline-none placeholder:text-foreground/45 md:text-sm"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label={copy.send}
                  className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-foreground p-0 text-background hover:bg-foreground/92"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <>
          <div className="relative hidden h-28 w-[21rem] md:block">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 overflow-visible">
              <div className="absolute bottom-[1.15rem] left-1/2 h-28 w-28 -translate-x-1/2">
                <Image
                  src="/dodzie/dodziecs-cropped.png"
                  alt="Dodzie holding the chat launcher"
                  fill
                  sizes="112px"
                  className="object-contain object-top drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={openChat}
              aria-label={copy.openLabel}
              className="group absolute inset-x-0 bottom-0 z-10 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fffdf8_0%,#f6eee3_100%)] p-1 shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
                <Image
                  src="/dodzie/dodziecs-cropped.png"
                  alt="Dodzie"
                  fill
                  sizes="44px"
                  className="rounded-full object-cover object-top drop-shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
                />
              </span>
              <span className="text-left">
                <span className="block font-heading text-sm font-bold tracking-tight text-foreground">
                  {copy.title}
                </span>
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={openChat}
            aria-label={copy.openLabel}
            className="group relative inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/95 px-3 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-white md:hidden"
          >
            {showMobileNudge ? (
              <span className="pointer-events-none absolute right-[calc(100%+0.7rem)] top-[42%] z-10 flex -translate-y-1/2 items-center">
                <span className="relative overflow-visible">
                  <span className="absolute -right-1.5 top-[62%] h-3.5 w-3.5 -translate-y-1/2 rotate-45 rounded-[0.35rem] bg-[#1a1714] shadow-[6px_6px_16px_rgba(0,0,0,0.16)]" />
                  <span className="absolute inset-0 rounded-[1.3rem] bg-[radial-gradient(circle_at_top_left,rgba(94,214,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,166,77,0.34),transparent_46%)] blur-md" />
                  <span className="relative block min-w-[11.5rem] max-w-[12.5rem] overflow-hidden rounded-[1.3rem] border border-white/12 bg-[linear-gradient(135deg,#141414_0%,#241b14_46%,#2f2217_100%)] px-3.5 py-2.5 text-left shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_65%)]" />
                    <span className="relative block text-xs font-medium leading-5 text-white">
                      {activeMobileNudge}
                    </span>
                  </span>
                </span>
              </span>
            ) : null}
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fffdf8_0%,#f6eee3_100%)] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
              <Image
                src="/dodzie/dodziecs-cropped.png"
                alt="Dodzie"
                fill
                sizes="48px"
                className="rounded-full object-cover object-top"
              />
            </span>
          </button>
        </>
      ) : null}
    </div>
  )
}
