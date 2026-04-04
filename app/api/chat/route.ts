import { NextResponse } from "next/server"
import {
  buildDodzieExtractionMessages,
  buildDodzieReplyMessages,
} from "@/lib/chat/prompt"
import {
  DeepSeekFormatError,
  getDodzieExtraction,
  getDodzieReply,
} from "@/lib/chat/deepseek"
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
  return {
    name: incoming.name || previous.name || "",
    email: incoming.email || previous.email || "",
    phone: incoming.phone || previous.phone || "",
    projectNeed: incoming.projectNeed || previous.projectNeed || "",
  }
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

function appendSubmissionNote(reply: string, language: SupportedLanguage) {
  const note =
    language === "ar"
      ? "تم تسجيل التفاصيل. سيقوم الفريق بمراجعتها والرد عليك."
      : "Your details are logged. The team can review them and follow up."

  return reply.includes(note) ? reply : `${reply}\n\n${note}`
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

    const reply = await getDodzieReply(
      buildDodzieReplyMessages({
        locale,
        pathname,
        activeSection,
        knowledge,
        messages,
        knownLead: sessionState.lead,
      })
    )

    let extraction: DodzieExtraction | null = null

    try {
      extraction = await getDodzieExtraction(
        buildDodzieExtractionMessages({
          locale,
          pathname,
          activeSection,
          knowledge,
          messages,
          knownLead: sessionState.lead,
        })
      )
    } catch (error) {
      if (error instanceof DeepSeekFormatError) {
        console.error("Chat extraction format error:", error.details)
      } else {
        console.error("Chat extraction error:", error)
      }
    }

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

    let leadSubmitted = false
    let leadPersisted = sessionState.submitted
    let persistedFingerprint = sessionState.persistedFingerprint
    let rowNumber = sessionState.rowNumber

    const shouldPersistLead = Boolean(
      (mergedLead.email && isValidEmail(mergedLead.email)) ||
        (mergedLead.phone && isValidPhone(mergedLead.phone))
    )
    const nextFingerprint = buildPersistenceFingerprint({
      lead: mergedLead,
      handoffSummary: extraction?.handoffSummary || latestUserMessage,
    })

    if (shouldPersistLead && nextFingerprint !== sessionState.persistedFingerprint) {
      try {
        const persistedLead = await submitLead({
          source: "chatbot",
          sessionId,
          rowNumber: sessionState.rowNumber,
          name: mergedLead.name,
          email: mergedLead.email,
          phone: mergedLead.phone,
          message: mergedLead.projectNeed || latestUserMessage,
          locale,
          pathname,
          conversationSummary: extraction?.handoffSummary || latestUserMessage,
        })
        leadSubmitted = !sessionState.submitted
        leadPersisted = true
        persistedFingerprint = nextFingerprint
        rowNumber = persistedLead.rowNumber ?? sessionState.rowNumber
      } catch (error) {
        console.error("Chat lead submission failed:", error)
      }
    }

    sessionLeadStore.set(sessionId, {
      lead: mergedLead,
      submitted: leadPersisted,
      rowNumber,
      persistedFingerprint,
      updatedAt: Date.now(),
    })

    return NextResponse.json({
      reply: leadSubmitted
        ? appendSubmissionNote(reply, extraction?.language ?? locale)
        : reply,
      language: extraction?.language ?? locale,
      knowledgeUsed: knowledge.map((chunk) => chunk.id),
      leadSubmitted,
    })
  } catch (error) {
    if (error instanceof DeepSeekFormatError) {
      console.error("Chat model format error:", error.details)
      return NextResponse.json(
        {
          error: "Dodzie hit a model formatting issue. Please resend your last message.",
          code: "MODEL_FORMAT_ERROR",
          diagnostics: error.details,
        },
        { status: 502 }
      )
    }

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
