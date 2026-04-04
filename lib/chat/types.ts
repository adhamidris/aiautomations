export type ChatRole = "user" | "assistant"

export type SupportedLanguage = "en" | "ar"

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface LeadFields {
  name?: string
  email?: string
  phone?: string
  projectNeed?: string
}

export interface DodzieExtraction {
  language: SupportedLanguage
  handoffSummary: string
  extracted: LeadFields
}

export interface KnowledgeChunk {
  id: string
  title: string
  text: string
  tags: string[]
}
