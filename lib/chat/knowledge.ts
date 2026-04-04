import arDictionary from "@/dictionaries/ar.json"
import enDictionary from "@/dictionaries/en.json"
import { getAllPosts } from "@/lib/content"
import type { Locale } from "@/i18n-config"
import type { KnowledgeChunk } from "@/lib/chat/types"

const BUSINESS_CONTEXT = {
  en: {
    assistantTitle: "AI Assistant Systems",
    assistantText:
      "AUTOM8ED builds custom AI assistant systems around real workflows. These can include Codex or codex-cli based setups, MCP-connected tools, injected skills, Telegram bridges, wrapper or helper servers that automate sessions and cron-based helpers, isolated workspaces, and operational control through Telegram. These systems are not limited to one model provider and can often be configured around OpenAI subscriptions or other API-based LLM credentials. Feasibility depends on the client's stack, access level, workflow requirements, and supported integrations, so exact fit is confirmed after reviewing the project.",
    processText:
      "AUTOM8ED should not promise every integration blindly. A strong answer is that many workflows are feasible in principle, but the exact implementation is checked after understanding the client's tools, requirements, and constraints.",
    leadText:
      "When a visitor shows clear buying intent, Dodzie should collect a lead conversationally. Preferred fields are name, email, and a short project brief. If the visitor is reluctant, email only is acceptable.",
  },
  ar: {
    assistantTitle: "أنظمة المساعدات الذكية",
    assistantText:
      "تبني AUTOM8ED أنظمة مساعدات ذكاء اصطناعي مخصصة حول سير العمل الحقيقي. قد يشمل ذلك إعدادات مبنية على Codex أو codex-cli، وأدوات متصلة عبر MCP، ومهارات مخصصة، وجسور تيليجرام، وخوادم مساعدة لإدارة الجلسات والمهام المجدولة، ومساحات عمل معزولة، وتحكم تشغيلي عبر تيليجرام. هذه الأنظمة ليست مرتبطة بمزوّد واحد فقط، ويمكن غالباً تهيئتها للعمل مع اشتراكات OpenAI أو أي مزود LLM قائم على API بحسب متطلبات المشروع. أما الملاءمة النهائية فتعتمد على بيئة العميل والصلاحيات وسير العمل والتكاملات المدعومة، لذلك يتم تأكيدها بعد مراجعة المتطلبات.",
    processText:
      "يجب عدم الوعد بأي تكامل بشكل مطلق. الصياغة الصحيحة هي أن كثيراً من السيناريوهات ممكنة من حيث المبدأ، لكن التنفيذ الدقيق يتحدد بعد فهم الأدوات والمتطلبات والقيود.",
    leadText:
      "عندما يظهر الزائر اهتماماً جدياً، يجمع دودزي بيانات التواصل بشكل طبيعي داخل المحادثة. الأفضل هو الاسم والبريد وملخص سريع للمشروع، لكن البريد وحده يكفي إذا كان الزائر متحفظاً.",
  },
} as const

function getDictionary(locale: Locale) {
  return locale === "ar" ? arDictionary : enDictionary
}

function tokenize(value: string) {
  return (value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (token) => token.length > 1
  )
}

function scoreChunk(
  chunk: KnowledgeChunk,
  queryTokens: string[],
  activeSection?: string,
  pathname?: string
) {
  const haystack = `${chunk.title} ${chunk.text} ${chunk.tags.join(" ")}`.toLowerCase()
  let score = 0

  for (const token of queryTokens) {
    if (chunk.tags.some((tag) => tag.toLowerCase() === token)) {
      score += 6
      continue
    }

    if (chunk.title.toLowerCase().includes(token)) {
      score += 4
    }

    if (haystack.includes(token)) {
      score += 2
    }
  }

  if (activeSection && chunk.tags.includes(activeSection)) {
    score += 8
  }

  if (pathname?.includes("/blog/") && chunk.tags.includes("blog")) {
    score += 4
  }

  if (chunk.id === "assistant-systems") {
    score += 1
  }

  return score
}

function buildKnowledgeChunks(locale: Locale) {
  const dict = getDictionary(locale)
  const posts = getAllPosts(locale)
  const business = BUSINESS_CONTEXT[locale]

  const serviceLines = dict.services.items
    .map((item) => `${item.title}: ${item.description}`)
    .join("\n")

  const portfolioLines = Object.entries(dict.portfolio.projects)
    .map(([slug, description]) => `${slug}: ${description}`)
    .join("\n")

  const blogLines = posts
    .slice(0, 4)
    .map(
      (post) =>
        `${post.title} (${post.category}, ${post.publishedAt}): ${post.excerpt}`
    )
    .join("\n")

  const chunks: KnowledgeChunk[] = [
    {
      id: "assistant-systems",
      title: business.assistantTitle,
      text: business.assistantText,
      tags: ["assistant", "ai", "codex", "telegram", "mcp", "dodzie"],
    },
    {
      id: "services",
      title: dict.services.subtitle,
      text: serviceLines,
      tags: ["services", "service", "websites", "saas", "rag", "hosting"],
    },
    {
      id: "dodzie",
      title: dict.dodzie.title,
      text: `${dict.dodzie.summary}\n${dict.dodzie.points.join("\n")}`,
      tags: ["assistant", "dodzie", "telegram", "automation", "services"],
    },
    {
      id: "portfolio",
      title: dict.portfolio.title,
      text: portfolioLines,
      tags: ["portfolio", "projects", "websites", "saas", "design"],
    },
    {
      id: "blogs",
      title: dict.blogs.title,
      text: blogLines,
      tags: ["blog", "insights", "articles", "content"],
    },
    {
      id: "lead-policy",
      title: locale === "ar" ? "سياسة التأهيل" : "Lead qualification policy",
      text: `${business.processText}\n${business.leadText}`,
      tags: ["lead", "contact", "qualification", "sales"],
    },
  ]

  return chunks
}

export function retrieveKnowledge(params: {
  locale: Locale
  query: string
  pathname?: string
  activeSection?: string
  limit?: number
}) {
  const { locale, query, pathname, activeSection, limit = 4 } = params
  const queryTokens = tokenize(query)
  const chunks = buildKnowledgeChunks(locale)

  return chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, queryTokens, activeSection, pathname),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk)
}
