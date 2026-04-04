import { appendLead, updateLeadRow } from "@/lib/sheets"

export type LeadSource = "contact_form" | "chatbot"

export interface SubmitLeadInput {
  source: LeadSource
  sessionId?: string
  rowNumber?: number | null
  name?: string
  email?: string
  phone?: string
  message?: string
  locale?: string
  pathname?: string
  conversationSummary?: string
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "")
  const digitsOnly = normalized.replace(/\D/g, "")
  return digitsOnly.length >= 7 && digitsOnly.length <= 15
}

function cleanValue(value?: string, maxLength = 500) {
  return value?.trim().replace(/\s+/g, " ").slice(0, maxLength) ?? ""
}

function buildSheetMessage(input: SubmitLeadInput) {
  const baseMessage = cleanValue(input.message, 1200)
  const conversationSummary = cleanValue(input.conversationSummary, 1200)

  if (input.source === "contact_form") {
    return baseMessage
  }

  return conversationSummary || baseMessage || "Chatbot lead without extra notes."
}

export async function submitLead(input: SubmitLeadInput) {
  const email = cleanValue(input.email, 200)
  const name = cleanValue(input.name, 120)
  const phone = cleanValue(input.phone, 120)
  const message = buildSheetMessage(input)

  const hasValidEmail = Boolean(email && isValidEmail(email))
  const hasValidPhone = Boolean(phone && isValidPhone(phone))

  if (!hasValidEmail && !hasValidPhone) {
    throw new Error("A valid email or phone number is required")
  }

  if (input.source === "contact_form" && (!name || !message)) {
    throw new Error("Missing required contact form fields")
  }

  const finalName = name || "Website Chat Lead"

  if (process.env.GOOGLE_SHEET_ID) {
    if (input.source === "chatbot" && input.rowNumber) {
      await updateLeadRow(input.rowNumber, {
        name: finalName,
        email,
        phone,
        message: message || "Chatbot lead without extra notes.",
      })

      return {
        success: true,
        rowNumber: input.rowNumber,
        normalizedLead: {
          name: finalName,
          email: hasValidEmail ? email : "",
          phone: hasValidPhone ? phone : "",
          message,
        },
      }
    }

    const appendResult = await appendLead({
      name: finalName,
      email: hasValidEmail ? email : "",
      phone: hasValidPhone ? phone : "",
      message: message || "Chatbot lead without extra notes.",
    })

    return {
      success: true,
      rowNumber: appendResult.rowNumber,
      normalizedLead: {
        name: finalName,
        email: hasValidEmail ? email : "",
        phone: hasValidPhone ? phone : "",
        message,
      },
    }
  } else {
    console.warn("Skipping Google Sheets write: GOOGLE_SHEET_ID not set.")
  }

  return {
    success: true,
    rowNumber: input.rowNumber ?? null,
    normalizedLead: {
      name: finalName,
      email: hasValidEmail ? email : "",
      phone: hasValidPhone ? phone : "",
      message,
    },
  }
}
