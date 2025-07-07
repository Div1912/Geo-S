import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyToken } from "@/lib/auth"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let query = supabase
      .from("alerts")
      .select(`
        *,
        aois (
          name,
          location
        ),
        glacial_lakes (
          name,
          area_km2
        )
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (type && type !== "all") {
      query = query.eq("alert_type", type)
    }

    const { data: alerts, error } = await query

    if (error) {
      console.error("Alerts fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
    }

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Alerts API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { alert_type, title, message, aoi_id, lake_id, severity } = await request.json()

    const { data: alert, error } = await supabase
      .from("alerts")
      .insert({
        alert_type,
        title,
        message,
        aoi_id,
        lake_id,
        severity: severity || "medium",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Alert creation error:", error)
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error("Alert creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
