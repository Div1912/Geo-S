"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  organization: string
  role: string
  phone?: string
  location?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Initialize authentication state
  useEffect(() => {
    if (hasInitialized) return

    const initAuth = () => {
      try {
        if (typeof window === "undefined") {
          setIsLoading(false)
          setHasInitialized(true)
          return
        }

        const token = localStorage.getItem("auth-token")
        const savedUser = localStorage.getItem("user")

        if (token && savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            apiClient.setToken(token)
            setUser(userData)
          } catch (error) {
            console.error("Error parsing saved user:", error)
            localStorage.removeItem("auth-token")
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
        setHasInitialized(true)
      }
    }

    // Small delay to prevent hydration issues
    const timer = setTimeout(initAuth, 100)
    return () => clearTimeout(timer)
  }, [hasInitialized])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
    } catch (error: any) {
      // If API is unavailable and it's demo credentials, allow demo login
      if (
        (error.message === "SERVER_ERROR" ||
          error.message === "ENDPOINT_NOT_FOUND" ||
          error.message === "NETWORK_ERROR") &&
        email === "demo@geosentinel.com"
      ) {
        const demoUser = {
          id: "demo-user-1",
          name: "Dr. Demo User",
          email: "demo@geosentinel.com",
          organization: "ISRO - Demo",
          role: "Senior Scientist",
          phone: "+91-9876543210",
        }
        setUser(demoUser)
        localStorage.setItem("user", JSON.stringify(demoUser))
        localStorage.setItem("auth-token", "demo-token-123")
        apiClient.setToken("demo-token-123")
        return
      }
      throw error
    }
  }, [])

  const register = useCallback(async (userData: any) => {
    try {
      const response = await apiClient.register(userData)
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
    } catch (error: any) {
      // If API is unavailable, still allow registration for demo purposes
      if (
        error.message === "SERVER_ERROR" ||
        error.message === "ENDPOINT_NOT_FOUND" ||
        error.message === "NETWORK_ERROR"
      ) {
        const demoUser = {
          id: `demo-user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          organization: userData.organization,
          role: "User",
          phone: userData.phone,
        }
        setUser(demoUser)
        localStorage.setItem("user", JSON.stringify(demoUser))
        localStorage.setItem("auth-token", `demo-token-${Date.now()}`)
        apiClient.setToken(`demo-token-${Date.now()}`)
        return
      }
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    apiClient.logout()
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("auth-token")
  }, [])

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
