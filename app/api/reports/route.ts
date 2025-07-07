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

    const { data: reports, error } = await supabase
      .from("reports")
      .select(`
        *,
        aois (
          name,
          location
        )
      `)
      .eq("created_by", user.userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Reports fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
    }

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, report_type, aoi_id, time_period, parameters } = await request.json()

    // Generate report content (this would typically involve complex data processing)
    const reportContent = await generateReportContent(aoi_id, time_period, parameters)

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        title,
        report_type,
        aoi_id,
        time_period,
        parameters,
        content: reportContent,
        status: "completed",
        file_size: Math.floor(Math.random() * 5000000) + 1000000, // Simulate file size
        created_by: user.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Report creation error:", error)
      return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Report creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateReportContent(aoiId: string, timePeriod: string, parameters: any) {
  // This would typically involve:
  // 1. Fetching satellite imagery data
  // 2. Running AI analysis
  // 3. Generating charts and visualizations
  // 4. Compiling into PDF format

  return {
    summary: "Comprehensive analysis of glacial lake changes",
    keyFindings: [
      "Lake area increased by 15.3% over the monitoring period",
      "3 new lakes detected in the region",
      "Risk level elevated to HIGH for 2 existing lakes",
    ],
    recommendations: [
      "Increase monitoring frequency for high-risk lakes",
      "Deploy ground sensors for real-time monitoring",
      "Coordinate with local authorities for emergency preparedness",
    ],
    dataPoints: Math.floor(Math.random() * 10000) + 5000,
    analysisDate: new Date().toISOString(),
  }
}
