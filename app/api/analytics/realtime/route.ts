import { NextResponse } from "next/server"
import { google } from "googleapis"
import { JWT } from "google-auth-library"

export async function GET() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID

    if (!propertyId) {
      return NextResponse.json(
        { error: "GA_PROPERTY_ID is not set" },
        { status: 500 }
      )
    }

    const client = new JWT({
      email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
      key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    })

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth: client,
    })

    const response = await analyticsData.properties.runRealtimeReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [{ name: "country" }, { name: "city" }],
        metrics: [{ name: "activeUsers" }],
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Analytics Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}
