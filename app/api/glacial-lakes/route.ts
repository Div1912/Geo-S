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
    const aoiId = searchParams.get("aoi_id")

    let query = supabase
      .from("glacial_lakes")
      .select(`
        *,
        aois (
          name,
          location
        )
      `)
      .order("last_updated", { ascending: false })

    if (aoiId) {
      query = query.eq("aoi_id", aoiId)
    }

    const { data: lakes, error } = await query

    if (error) {
      console.error("Lakes fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch glacial lakes" }, { status: 500 })
    }

    return NextResponse.json(lakes)
  } catch (error) {
    console.error("Lakes API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, aoi_id, coordinates, area_km2, elevation_m, risk_level } = await request.json()

    const { data: lake, error } = await supabase
      .from("glacial_lakes")
      .insert({
        name,
        aoi_id,
        coordinates,
        area_km2,
        elevation_m,
        risk_level: risk_level || "low",
        status: "active",
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Lake creation error:", error)
      return NextResponse.json({ error: "Failed to create glacial lake" }, { status: 500 })
    }

    return NextResponse.json(lake)
  } catch (error) {
    console.error("Lake creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
