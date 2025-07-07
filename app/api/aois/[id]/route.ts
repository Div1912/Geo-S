import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyToken } from "@/lib/auth"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, coordinates, description, priority, status } = await request.json()

    const { data: aoi, error } = await supabase
      .from("aois")
      .update({
        name,
        location,
        coordinates,
        description,
        priority,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("created_by", user.userId)
      .select()
      .single()

    if (error) {
      console.error("AOI update error:", error)
      return NextResponse.json({ error: "Failed to update AOI" }, { status: 500 })
    }

    return NextResponse.json(aoi)
  } catch (error) {
    console.error("AOI update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("aois").delete().eq("id", params.id).eq("created_by", user.userId)

    if (error) {
      console.error("AOI deletion error:", error)
      return NextResponse.json({ error: "Failed to delete AOI" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("AOI deletion API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
