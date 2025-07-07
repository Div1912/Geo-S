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

    const { data: aois, error } = await supabase
      .from("aois")
      .select(`
        *,
        glacial_lakes (
          id,
          area_km2,
          risk_level,
          last_updated
        )
      `)
      .eq("created_by", user.userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("AOI fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch AOIs" }, { status: 500 })
    }

    // Calculate statistics for each AOI
    const aoisWithStats = aois.map((aoi) => ({
      ...aoi,
      lakeCount: aoi.glacial_lakes?.length || 0,
      totalLakeArea: aoi.glacial_lakes?.reduce((sum: number, lake: any) => sum + (lake.area_km2 || 0), 0) || 0,
      highRiskLakes: aoi.glacial_lakes?.filter((lake: any) => lake.risk_level === "high").length || 0,
    }))

    return NextResponse.json(aoisWithStats)
  } catch (error) {
    console.error("AOI API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, coordinates, description, priority } = await request.json()

    const { data: aoi, error } = await supabase
      .from("aois")
      .insert({
        name,
        location,
        coordinates,
        description,
        priority: priority || "medium",
        status: "active",
        created_by: user.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("AOI creation error:", error)
      return NextResponse.json({ error: "Failed to create AOI" }, { status: 500 })
    }

    return NextResponse.json(aoi)
  } catch (error) {
    console.error("AOI creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
