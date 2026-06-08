import { NextResponse } from "next/server"
import {
  buildDodzieExtractionMessages,
  buildDodzieReplyMessages,
} from "@/lib/chat/prompt"
import {
  OpenRouterFormatError,
  getDodzieExtraction,
  getDodzieReply,
  callOpenRouterStream,
} from "@/lib/chat/openrouter"
import { retrieveKnowledge } from "@/lib/chat/knowledge"
import type {
  ChatMessage,
  DodzieExtraction,
  LeadFields,
  SupportedLanguage,
} from "@/lib/chat/types"
import { isValidEmail, isValidPhone, submitLead } from "@/lib/leads"

export const runtime = "nodejs"

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 12
const MAX_MESSAGES = 12
const MAX_MESSAGE_CHARS = 1200
const SESSION_TTL_MS = 30 * 60 * 1000

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
const activeSessionStore = new Map<string, number>()
const sessionLeadStore = new Map<
  string,
  {
    lead: LeadFields
    stableSummary: string
    submitted: boolean
    rowNumber: number | null
    persistedFingerprint: string | null
    updatedAt: number
  }
>()

function cleanupStores() {
  const now = Date.now()

  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }

  for (const [key, value] of activeSessionStore.entries()) {
    if (value <= now) {
      activeSessionStore.delete(key)
    }
  }

  for (const [key, value] of sessionLeadStore.entries()) {
    if (value.updatedAt + SESSION_TTL_MS <= now) {
      sessionLeadStore.delete(key)
    }
  }
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  return forwardedFor?.split(",")[0]?.trim() || realIp || "anonymous"
}

function applyRateLimit(key: string) {
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return true
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  current.count += 1
  return true
}

function isPromptAbuse(message: string) {
  return /(system prompt|developer message|reveal.*instruction|ignore previous|jailbreak|hidden prompt)/i.test(
    message
  )
}

function extractEmailFromText(value: string) {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return match?.[0] ?? ""
}

function extractPhoneFromText(value: string) {
  const candidates = value.match(/(?:\+?\d[\d\s\-().]{6,}\d)/g) ?? []

  for (const candidate of candidates) {
    const normalized = candidate.trim()
    if (isValidPhone(normalized)) {
      return normalized
    }
  }

  return ""
}

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return []
  }

  return messages
    .filter((message): message is ChatMessage => {
      return (
        Boolean(message) &&
        typeof message === "object" &&
        "role" in message &&
        "content" in message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
      )
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES)
}

function mergeLeadFields(previous: LeadFields, incoming: LeadFields) {
  const currentEmail = previous.email?.trim() || ""
  const incomingEmail = incoming.email?.trim() || ""
  const currentPhone = previous.phone?.trim() || ""
  const incomingPhone = incoming.phone?.trim() || ""

  return {
    name: mergeName(previous.name, incoming.name),
    email:
      incomingEmail && isValidEmail(incomingEmail)
        ? incomingEmail
        : currentEmail,
    phone:
      incomingPhone && isValidPhone(incomingPhone)
        ? incomingPhone
        : currentPhone,
    projectNeed: mergeTextField(previous.projectNeed, incoming.projectNeed),
  }
}

function normalizeLeadText(value?: string, maxLength = 1200) {
  return value?.trim().replace(/\s+/g, " ").slice(0, maxLength) ?? ""
}

function mergeName(current?: string, incoming?: string) {
  const currentValue = normalizeLeadText(current, 120)
  const incomingValue = normalizeLeadText(incoming, 120)

  if (!incomingValue) return currentValue
  if (!currentValue) return incomingValue

  const currentLower = currentValue.toLowerCase()
  const incomingLower = incomingValue.toLowerCase()

  if (
    currentLower === incomingLower ||
    (incomingLower.includes(currentLower) && incomingValue.length >= currentValue.length)
  ) {
    return incomingValue
  }

  return currentValue
}

function mergeTextField(current?: string, incoming?: string) {
  const currentValue = normalizeLeadText(current)
  const incomingValue = normalizeLeadText(incoming)

  return incomingValue || currentValue
}

function buildFallbackLeadSummary(locale: SupportedLanguage) {
  return locale === "ar"
    ? "مهتم بخدمات AUTOM8ED عبر دردشة دودزي."
    : "Interested in AUTOM8ED services via Dodzie chat."
}

function isSafeLeadSummary(params: {
  summary?: string
  latestUserMessage: string
}) {
  const normalizedSummary = normalizeLeadText(params.summary)
  const normalizedLatest = normalizeLeadText(params.latestUserMessage)

  if (!normalizedSummary) {
    return false
  }

  return normalizedSummary.toLowerCase() !== normalizedLatest.toLowerCase()
}

function buildPersistenceFingerprint(params: {
  lead: LeadFields
  handoffSummary: string
}) {
  const { lead, handoffSummary } = params

  return JSON.stringify({
    name: lead.name || "",
    email: lead.email || "",
    phone: lead.phone || "",
    projectNeed: lead.projectNeed || "",
    handoffSummary,
  })
}

function promptAbuseResponse(language: SupportedLanguage) {
  if (language === "ar") {
    return {
      reply:
        "الجزء هذا يبقى خلف الستار. لكن إذا أردت معرفة ما يمكن لـ AUTOM8ED بناؤه فعلاً، أنا حاضر.",
      language: "ar" as const,
    }
  }

  return {
    reply:
      "That part stays behind the curtain. If you want to know what AUTOM8ED can actually build, I’m useful there.",
    language: "en" as const,
  }
}

export async function POST(request: Request) {
  cleanupStores()
  let lockedSessionId: string | null = null

  try {
    const clientKey = getClientKey(request)

    if (!applyRateLimit(clientKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again shortly." },
        { status: 429 }
      )
    }

    const body = (await request.json()) as {
      sessionId?: string
      locale?: string
      pathname?: string
      activeSection?: string
      messages?: unknown
    }

    const sessionId = body.sessionId?.trim()
    const locale: SupportedLanguage = body.locale === "ar" ? "ar" : "en"
    const pathname = body.pathname?.trim()
    const activeSection = body.activeSection?.trim()
    const messages = sanitizeMessages(body.messages)

    if (!sessionId || sessionId.length < 8) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 })
    }

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user")?.content

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "A user message is required" },
        { status: 400 }
      )
    }

    if (activeSessionStore.has(sessionId)) {
      return NextResponse.json(
        { error: "A reply is already being generated for this session." },
        { status: 429 }
      )
    }

    if (isPromptAbuse(latestUserMessage)) {
      const guarded = promptAbuseResponse(locale)
      return NextResponse.json({
        reply: guarded.reply,
        language: guarded.language,
        leadSubmitted: false,
      })
    }

    activeSessionStore.set(sessionId, Date.now() + 60 * 1000)
    lockedSessionId = sessionId

    const sessionState = sessionLeadStore.get(sessionId) ?? {
      lead: {},
      stableSummary: "",
      submitted: false,
      rowNumber: null,
      persistedFingerprint: null,
      updatedAt: Date.now(),
    }

    const knowledge = retrieveKnowledge({
      locale,
      query: messages.map((message) => message.content).join("\n"),
      pathname,
      activeSection,
    })

    const replyMessages = buildDodzieReplyMessages({
      locale,
      pathname,
      activeSection,
      knowledge,
      messages,
      knownLead: sessionState.lead,
    })

    const extractionPromise = (async () => {
      try {
        return await getDodzieExtraction(
          buildDodzieExtractionMessages({
            locale,
            pathname,
            activeSection,
            knowledge,
            messages,
            knownLead: sessionState.lead,
            currentSummary: sessionState.stableSummary,
          })
        )
      } catch (error) {
        console.error("Chat background extraction failed:", error)
        return null
      }
    })()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY")
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        
        const sendChunk = (data: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"))
        }

        try {
          const response = await callOpenRouterStream(apiKey, replyMessages)
          
          if (!response.ok) {
            const errText = await response.text()
            sendChunk({ type: "error", error: `OpenRouter stream error: ${response.status} ${errText}` })
            controller.close()
            return
          }

          const reader = response.body?.getReader()
          if (!reader) {
            sendChunk({ type: "error", error: "OpenRouter stream body not readable" })
            controller.close()
            return
          }

          const decoder = new TextDecoder()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              const cleanLine = line.trim()
              if (!cleanLine) continue
              if (!cleanLine.startsWith("data: ")) continue

              const dataContent = cleanLine.slice(6).trim()
              if (dataContent === "[DONE]") break

              try {
                const parsed = JSON.parse(dataContent)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  sendChunk({ type: "text", content })
                }
              } catch (e) {
                // Ignore JSON parse errors for non-JSON lines or keep-alives
              }
            }
          }

          const extraction = await extractionPromise

          const deterministicLeadFields: LeadFields = {
            email:
              extractEmailFromText(latestUserMessage) ||
              extractEmailFromText(messages.map((message) => message.content).join("\n")),
            phone:
              extractPhoneFromText(latestUserMessage) ||
              extractPhoneFromText(messages.map((message) => message.content).join("\n")),
          }

          const mergedLead = mergeLeadFields(
            mergeLeadFields(sessionState.lead, extraction?.extracted ?? {}),
            deterministicLeadFields
          )
          const candidateSummary = normalizeLeadText(extraction?.handoffSummary)
          const hasSafeCandidateSummary = isSafeLeadSummary({
            summary: candidateSummary,
            latestUserMessage,
          })
          const stableSummary =
            extraction?.shouldUpdateLead && hasSafeCandidateSummary
              ? candidateSummary
              : sessionState.stableSummary

          let leadSubmitted = false
          let leadPersisted = sessionState.submitted
          let persistedFingerprint = sessionState.persistedFingerprint
          let rowNumber = sessionState.rowNumber

          const shouldPersistLead = Boolean(
            (mergedLead.email && isValidEmail(mergedLead.email)) ||
              (mergedLead.phone && isValidPhone(mergedLead.phone))
          )
          const summaryForWrite =
            stableSummary ||
            (hasSafeCandidateSummary ? candidateSummary : "") ||
            buildFallbackLeadSummary(locale)
          const contactSnapshotChanged =
            normalizeLeadText(sessionState.lead.name, 120) !==
              normalizeLeadText(mergedLead.name, 120) ||
            normalizeLeadText(sessionState.lead.email, 200) !==
              normalizeLeadText(mergedLead.email, 200) ||
            normalizeLeadText(sessionState.lead.phone, 120) !==
              normalizeLeadText(mergedLead.phone, 120)
          const shouldUpdatePersistedLead = Boolean(
            !sessionState.submitted ||
              contactSnapshotChanged ||
              (extraction?.shouldUpdateLead && hasSafeCandidateSummary)
          )
          const nextFingerprint = buildPersistenceFingerprint({
            lead: mergedLead,
            handoffSummary: summaryForWrite,
          })

          if (
            shouldPersistLead &&
            shouldUpdatePersistedLead &&
            nextFingerprint !== sessionState.persistedFingerprint
          ) {
            try {
              const persistedLead = await submitLead({
                source: "chatbot",
                sessionId,
                rowNumber: sessionState.rowNumber,
                name: mergedLead.name,
                email: mergedLead.email,
                phone: mergedLead.phone,
                message: summaryForWrite,
                locale,
                pathname,
                conversationSummary: summaryForWrite,
              })
              leadSubmitted = !sessionState.submitted
              leadPersisted = true
              persistedFingerprint = nextFingerprint
              rowNumber = persistedLead.rowNumber ?? sessionState.rowNumber
            } catch (error) {
              console.error("Chat background lead submission failed:", error)
            }
          }

          sessionLeadStore.set(sessionId, {
            lead: mergedLead,
            stableSummary,
            submitted: leadPersisted,
            rowNumber,
            persistedFingerprint,
            updatedAt: Date.now(),
          })

          sendChunk({
            type: "meta",
            leadSubmitted,
            language: extraction?.language ?? locale,
            knowledgeUsed: knowledge.map((chunk) => chunk.id),
          })

        } catch (err) {
          sendChunk({ type: "error", error: String(err) })
        } finally {
          if (sessionId) {
            activeSessionStore.delete(sessionId)
          }
          controller.close()
        }
      }
    })

    lockedSessionId = null

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Unable to generate a response right now.",
      },
      { status: 500 }
    )
  } finally {
    if (lockedSessionId) {
      activeSessionStore.delete(lockedSessionId)
    }
  }
}
