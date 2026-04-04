"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"))

  if (!sections.length) {
    return undefined
  }

  const viewportCenter = window.innerHeight / 2
  let bestId: string | undefined
  let bestDistance = Number.POSITIVE_INFINITY

  for (const section of sections) {
    const rect = section.getBoundingClientRect()
    const sectionCenter = rect.top + rect.height / 2
    const distance = Math.abs(sectionCenter - viewportCenter)

    if (rect.bottom > 0 && rect.top < window.innerHeight && distance < bestDistance) {
      bestDistance = distance
      bestId = section.id
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

  const storageKey = useMemo(() => getStorageKey(lang), [lang])
  const hasUserMessages = messages.some((message) => message.role === "user")
  const activeMobileNudge =
    copy.mobileNudges[
      Math.min(Math.max(mobileNudgeShows - 1, 0), Math.max(copy.mobileNudges.length - 1, 0))
    ] ?? ""

  const dismissMobileNudge = useCallback(() => {
    setShowMobileNudge(false)
    setMobileNudgeDismissed(true)
    window.sessionStorage.setItem(`${storageKey}:mobile-nudge-dismissed`, "true")
  }, [storageKey])

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

    const updateVisibleHeight = () => {
      const nextHeight = window.visualViewport?.height ?? window.innerHeight
      setMobileVisibleHeight(Math.round(nextHeight))
    }

    updateVisibleHeight()
    window.visualViewport?.addEventListener("resize", updateVisibleHeight)
    window.visualViewport?.addEventListener("scroll", updateVisibleHeight)
    window.addEventListener("resize", updateVisibleHeight)

    return () => {
      window.visualViewport?.removeEventListener("resize", updateVisibleHeight)
      window.visualViewport?.removeEventListener("scroll", updateVisibleHeight)
      window.removeEventListener("resize", updateVisibleHeight)
    }
  }, [isMobileViewport, isOpen])

  useEffect(() => {
    if (!isMobileViewport || !isOpen) {
      return
    }

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior

    document.documentElement.style.overflow = "hidden"
    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overflow = "hidden"
    document.body.style.overscrollBehavior = "none"

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

    return () => {
      document.removeEventListener("touchmove", preventBackgroundScroll)
      document.removeEventListener("wheel", preventBackgroundScroll)
      document.documentElement.style.overflow = previousHtmlOverflow
      document.documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior
    }
  }, [isMobileViewport, isOpen])

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey)
    const storedSessionId = window.localStorage.getItem(`${storageKey}:session`)
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
      window.localStorage.setItem(`${storageKey}:session`, nextSessionId)
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
    window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-20)))
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, storageKey])

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
      label: trimmed.slice(0, 80),
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
          activeSection: getActiveSectionId(),
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      })

      const payload = (await response.json()) as ChatApiResponse

      if (!response.ok) {
        const systemMessage =
          payload.code === "MODEL_FORMAT_ERROR"
            ? lang === "ar"
              ? "حصلت مشكلة تقنية في تنسيق رد النموذج. أعد إرسال آخر رسالة، وسأكمل من نفس النقطة."
              : "There was a model-format issue on that turn. Resend your last message and I’ll continue from the same point."
            : payload.error ||
              (lang === "ar"
                ? "تعذر إكمال الرد حالياً. جرّب مرة أخرى بعد لحظة."
                : "Unable to complete that reply right now. Try again in a moment.")

        setMessages((current) => [
          ...current,
          {
            id: `${Date.now()}-system`,
            role: "system",
            content: systemMessage,
          },
        ])
        return
      }

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: payload.reply,
        },
      ])

      if (payload.leadSubmitted) {
        trackEvent({
          action: "dodzie_chat_lead_captured",
          category: "assistant",
          label: lang,
        })
      }
    } catch (error) {
      console.error(error)
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "system",
          content:
            lang === "ar"
              ? "تعذر إكمال الرد حالياً. جرّب مرة أخرى بعد لحظة."
              : "Unable to complete that reply right now. Try again in a moment.",
        },
      ])
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
  const isMobileSheet = isMobileViewport && isOpen
  const mobileSheetHeight =
    isMobileSheet && mobileVisibleHeight
      ? Math.max(320, Math.round(mobileVisibleHeight - 32))
      : undefined
  const rootClassName = isMobileSheet
    ? `fixed inset-x-3 bottom-2 z-[70] flex items-stretch ${shouldRenderLauncher ? "opacity-100" : "pointer-events-none opacity-0"}`
    : `fixed right-4 z-[70] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-3 transition-all duration-300 md:right-6 ${launcherBottomClass} ${shouldRenderLauncher ? launcherVisibilityClass : "pointer-events-none opacity-0"}`
  const openPanelClassName = isMobileSheet
    ? `flex w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/95 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl max-md:h-full max-md:w-full max-md:origin-bottom max-md:transition-[opacity,transform] max-md:duration-300 ${isPanelEntered ? "max-md:translate-y-0 max-md:opacity-100" : "max-md:translate-y-4 max-md:opacity-0"}`
    : "flex w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/95 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl max-md:h-full max-md:w-full"

  return (
    <div
      className={rootClassName}
      aria-hidden={!shouldRenderLauncher}
      style={isMobileSheet && mobileSheetHeight ? { height: `${mobileSheetHeight}px` } : undefined}
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
                onClick={() => {
                  setIsOpen(false)
                  trackEvent({
                    action: "dodzie_chat_close",
                    category: "assistant",
                    label: lang,
                  })
                }}
                aria-label={copy.closeLabel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white transition hover:bg-black/90"
              >
                <X className="h-4 w-4 text-white" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
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
                <div className="rounded-[1.3rem] border border-black/8 bg-white px-4 py-3 text-sm text-foreground/70 shadow-sm">
                  {copy.thinking}
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
              onClick={() => {
                setIsOpen(true)
                setShowMobileNudge(false)
                trackEvent({
                  action: "dodzie_chat_open",
                  category: "assistant",
                  label: lang,
                })
              }}
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
            onClick={() => {
              setIsOpen(true)
              setShowMobileNudge(false)
              trackEvent({
                action: "dodzie_chat_open",
                category: "assistant",
                label: lang,
              })
            }}
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
