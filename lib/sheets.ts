import { google } from "googleapis"
import { JWT } from "google-auth-library"

const SHEET_RANGE = "Form!A:D"

function getSheetsClient() {
  const client = new JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return google.sheets({ version: "v4", auth: client })
}

function buildRow(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  return [
    data.name,
    data.phone,
    data.email,
    data.message,
  ]
}

function parseUpdatedRow(updatedRange?: string | null) {
  const match = updatedRange?.match(/!(?:[A-Z]+)(\d+):/)
  return match ? Number(match[1]) : null
}

export async function appendLead(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  try {
    const sheets = getSheetsClient()

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [buildRow(data)],
      },
    })

    return {
      data: response.data,
      rowNumber: parseUpdatedRow(response.data.updates?.updatedRange),
    }
  } catch (error) {
    console.error("Google Sheets Error:", error)
    throw new Error("Failed to write to Google Sheets")
  }
}

export async function updateLeadRow(
  rowNumber: number,
  data: {
    name: string
    email: string
    phone: string
    message: string
  }
) {
  try {
    const sheets = getSheetsClient()
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Form!A${rowNumber}:D${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [buildRow(data)],
      },
    })

    return { rowNumber }
  } catch (error) {
    console.error("Google Sheets Update Error:", error)
    throw new Error("Failed to update lead in Google Sheets")
  }
}
