import { appendLead } from "@/lib/sheets"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Connect to Google Sheets
    // Note: This will fail if env vars are not set, but we catch the error.
    if (process.env.GOOGLE_SHEET_ID) {
        await appendLead({ name, email, phone, message })
    } else {
        console.warn("Skipping Google Sheets write: GOOGLE_SHEET_ID not set.")
    }

    // In a real scenario, you might also trigger a webhook here:
    // await fetch(process.env.N8N_WEBHOOK_URL, { ... })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
