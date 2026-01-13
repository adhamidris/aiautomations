import { google } from "googleapis"
import { JWT } from "google-auth-library"

export async function appendLead(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  try {
    const client = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth: client })

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Form!A:D", // Columns: Name, Phone Number, Email, Message
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.name,
            data.phone,
            data.email,
            data.message,
          ],
        ],
      },
    })

    return response.data
  } catch (error) {
    console.error("Google Sheets Error:", error)
    throw new Error("Failed to write to Google Sheets")
  }
}