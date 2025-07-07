import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "GeoSentinel API is working!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  })
}
