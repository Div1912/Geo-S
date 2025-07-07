import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthUser {
  userId: string
  email: string
}

export async function verifyToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = request.cookies.get("auth-token")?.value

    if (!token) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    return {
      userId: decoded.userId,
      email: decoded.email,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "24h" })
}
