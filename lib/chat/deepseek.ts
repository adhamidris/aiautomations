import type { DodzieExtraction } from "@/lib/chat/types"

export class DeepSeekFormatError extends Error {
  details: Record<string, unknown>

  constructor(message: string, details: Record<string, unknown>) {
    super(message)
    this.name = "DeepSeekFormatError"
    this.details = details
  }
}

type DeepSeekMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

function tryParseJson<T>(content: string) {
  const trimmed = content.trim()

  if (!trimmed) {
    return null
  }

  const candidates = [
    trimmed,
    trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, ""),
  ]

  const firstBrace = trimmed.indexOf("{")
  const lastBrace = trimmed.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1))
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T
    } catch {
      continue
    }
  }

  return null
}

async function callDeepSeek(
  apiKey: string,
  messages: DeepSeekMessage[],
  options?: {
    responseFormat?: "json_object"
    maxTokens?: number
    temperature?: number
  }
) {
  return fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      temperature: options?.temperature ?? 0.35,
      max_tokens: options?.maxTokens ?? Number(process.env.DEEPSEEK_MAX_TOKENS || 500),
      ...(options?.responseFormat
        ? { response_format: { type: options.responseFormat } }
        : {}),
      messages,
    }),
  })
}

export async function callDeepSeekStream(
  apiKey: string,
  messages: DeepSeekMessage[],
  options?: {
    maxTokens?: number
    temperature?: number
  }
) {
  return fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      temperature: options?.temperature ?? 0.45,
      max_tokens: options?.maxTokens ?? Number(process.env.DEEPSEEK_REPLY_MAX_TOKENS || 180),
      stream: true,
      messages,
    }),
  })
}

async function readCompletionPayload(
  response: Response,
  diagnosticsLabel: string
) {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepSeek request failed: ${response.status} ${errorText}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      finish_reason?: string | null
      message?: { content?: string }
    }>
    usage?: Record<string, unknown>
    model?: string
    system_fingerprint?: string
  }

  const firstChoice = payload.choices?.[0]
  const content = firstChoice?.message?.content ?? ""
  const trimmedContent = content.trim()
  const diagnostics = {
    label: diagnosticsLabel,
    model: payload.model ?? process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
    finishReason: firstChoice?.finish_reason ?? null,
    contentLength: content.length,
    trimmedLength: trimmedContent.length,
    usage: payload.usage ?? null,
    systemFingerprint: payload.system_fingerprint ?? null,
  }

  if (!payload.choices?.length) {
    throw new DeepSeekFormatError("DeepSeek response did not include choices", diagnostics)
  }

  return {
    content,
    trimmedContent,
    diagnostics,
  }
}

function normalizeExtraction(payload: Partial<DodzieExtraction>): DodzieExtraction {
  const shouldUpdateLead =
    typeof payload.shouldUpdateLead === "boolean"
      ? payload.shouldUpdateLead
      : String(payload.shouldUpdateLead).toLowerCase() === "true"

  return {
    language: payload.language === "ar" ? "ar" : "en",
    handoffSummary: payload.handoffSummary?.trim() || "",
    shouldUpdateLead,
    extracted: {
      name: payload.extracted?.name?.trim() || "",
      email: payload.extracted?.email?.trim() || "",
      phone: payload.extracted?.phone?.trim() || "",
      projectNeed: payload.extracted?.projectNeed?.trim() || "",
    },
  }
}

export async function getDodzieReply(messages: DeepSeekMessage[]) {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY")
  }

  const response = await callDeepSeek(apiKey, messages, {
    maxTokens: Number(process.env.DEEPSEEK_REPLY_MAX_TOKENS || 180),
    temperature: 0.45,
  })

  const { content, trimmedContent, diagnostics } = await readCompletionPayload(
    response,
    "reply"
  )

  if (!trimmedContent) {
    throw new DeepSeekFormatError("DeepSeek returned empty reply content", diagnostics)
  }

  return content.trim()
}

export async function getDodzieExtraction(messages: DeepSeekMessage[]) {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY")
  }

  const response = await callDeepSeek(apiKey, messages, {
    responseFormat: "json_object",
    maxTokens: Number(process.env.DEEPSEEK_EXTRACTION_MAX_TOKENS || 350),
    temperature: 0.1,
  })

  const { content, trimmedContent, diagnostics } = await readCompletionPayload(
    response,
    "extraction"
  )

  if (!trimmedContent) {
    throw new DeepSeekFormatError("DeepSeek returned empty extraction content", diagnostics)
  }

  const parsed = tryParseJson<Partial<DodzieExtraction>>(content)

  if (!parsed) {
    throw new DeepSeekFormatError("DeepSeek returned non-parseable extraction JSON", {
      ...diagnostics,
      preview: trimmedContent.slice(0, 280),
    })
  }

  return normalizeExtraction(parsed)
}
