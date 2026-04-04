import { submitLead } from "@/lib/leads"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, source, serviceInterest, locale, pathname } = body

    if (!email || (!name && source !== "chatbot") || (!message && source !== "chatbot")) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await submitLead({
      source: source === "chatbot" ? "chatbot" : "contact_form",
      name,
      email,
      phone,
      message,
      serviceInterest,
      locale,
      pathname,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
