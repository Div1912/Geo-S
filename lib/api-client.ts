class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    // Handle different environments properly
    if (typeof window !== "undefined") {
      // Client-side: use current origin
      this.baseUrl = window.location.origin
    } else {
      // Server-side: use environment variable or default
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token)
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth-token")
      return this.token
    }
    return null
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("user")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`
    const token = this.getToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle different HTTP status codes
      if (response.status === 401) {
        this.clearToken()
        throw new Error("Authentication required")
      }

      if (response.status === 500) {
        console.warn(`Server error for ${endpoint}, falling back to mock data`)
        throw new Error("SERVER_ERROR")
      }

      if (response.status === 404) {
        console.warn(`Endpoint ${endpoint} not found, falling back to mock data`)
        throw new Error("ENDPOINT_NOT_FOUND")
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      // Handle fetch errors (network issues, CORS, etc.)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn("Network error, using mock data")
        throw new Error("NETWORK_ERROR")
      }

      // Re-throw our custom errors
      if (
        error instanceof Error &&
        (error.message === "SERVER_ERROR" ||
          error.message === "ENDPOINT_NOT_FOUND" ||
          error.message === "NETWORK_ERROR" ||
          error.message === "Authentication required")
      ) {
        throw error
      }

      console.error("API request error:", error)
      throw new Error("API_ERROR")
    }
  }

  // Auth methods with better error handling
  async login(email: string, password: string) {
    try {
      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (response?.token) {
        this.setToken(response.token)
      }

      return response
    } catch (error: any) {
      // For demo purposes, allow demo login even if API fails
      if (
        (error.message === "SERVER_ERROR" ||
          error.message === "ENDPOINT_NOT_FOUND" ||
          error.message === "NETWORK_ERROR") &&
        email === "demo@geosentinel.com" &&
        password === "demo123"
      ) {
        const demoResponse = {
          user: {
            id: "demo-user-1",
            name: "Dr. Demo User",
            email: "demo@geosentinel.com",
            organization: "ISRO - Demo",
            role: "Senior Scientist",
            phone: "+91-9876543210",
          },
          token: "demo-token-123",
        }
        this.setToken(demoResponse.token)
        return demoResponse
      }
      throw error
    }
  }

  async register(userData: any) {
    try {
      const response = await this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (response?.token) {
        this.setToken(response.token)
      }

      return response
    } catch (error: any) {
      // For demo purposes, allow registration even if API fails
      if (
        error.message === "SERVER_ERROR" ||
        error.message === "ENDPOINT_NOT_FOUND" ||
        error.message === "NETWORK_ERROR"
      ) {
        const demoResponse = {
          user: {
            id: `demo-user-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            organization: userData.organization,
            role: "User",
            phone: userData.phone,
          },
          token: `demo-token-${Date.now()}`,
        }
        this.setToken(demoResponse.token)
        return demoResponse
      }
      throw error
    }
  }

  async logout() {
    this.clearToken()
  }

  // AOI methods with fallback
  async getAOIs() {
    try {
      return await this.request("/aois")
    } catch (error: any) {
      if (
        error.message === "SERVER_ERROR" ||
        error.message === "ENDPOINT_NOT_FOUND" ||
        error.message === "NETWORK_ERROR"
      ) {
        // Return mock data
        return [
          {
            id: "AOI-001",
            name: "Pangong Tso Region",
            location: "Leh, Ladakh",
            coordinates: "33.7500° N, 78.9000° E",
            area: "156.7 km²",
            status: "Active",
            risk: "Low",
            lastUpdate: "2024-06-15",
            lakeCount: 8,
            totalLakeArea: 12.3,
            growthRate: "+2.1%",
          },
          {
            id: "AOI-007",
            name: "Tso Moriri Basin",
            location: "Leh, Ladakh",
            coordinates: "32.9000° N, 78.3000° E",
            area: "234.5 km²",
            status: "Critical",
            risk: "High",
            lastUpdate: "2024-06-15",
            lakeCount: 12,
            totalLakeArea: 18.7,
            growthRate: "+15.3%",
          },
          {
            id: "AOI-012",
            name: "Gurudongmar Region",
            location: "North Sikkim",
            coordinates: "27.7000° N, 88.5000° E",
            area: "89.2 km²",
            status: "Monitoring",
            risk: "Medium",
            lastUpdate: "2024-06-14",
            lakeCount: 5,
            totalLakeArea: 7.8,
            growthRate: "+8.7%",
          },
        ]
      }
      throw error
    }
  }

  async createAOI(aoiData: any) {
    try {
      return await this.request("/aois", {
        method: "POST",
        body: JSON.stringify(aoiData),
      })
    } catch (error: any) {
      if (error.message === "SERVER_ERROR" || error.message === "ENDPOINT_NOT_FOUND") {
        // Return mock success response
        return {
          id: `AOI-${Date.now()}`,
          ...aoiData,
          status: "active",
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async updateAOI(id: string, aoiData: any) {
    try {
      return await this.request(`/aois/${id}`, {
        method: "PUT",
        body: JSON.stringify(aoiData),
      })
    } catch (error: any) {
      if (error.message === "SERVER_ERROR" || error.message === "ENDPOINT_NOT_FOUND") {
        return { id, ...aoiData, updated_at: new Date().toISOString() }
      }
      throw error
    }
  }

  async deleteAOI(id: string) {
    try {
      return await this.request(`/aois/${id}`, {
        method: "DELETE",
      })
    } catch (error: any) {
      if (error.message === "SERVER_ERROR" || error.message === "ENDPOINT_NOT_FOUND") {
        return { success: true }
      }
      throw error
    }
  }

  // Alert methods with fallback
  async getAlerts(filters?: { status?: string; type?: string }) {
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append("status", filters.status)
      if (filters?.type) params.append("type", filters.type)

      return await this.request(`/alerts?${params.toString()}`)
    } catch (error: any) {
      if (
        error.message === "SERVER_ERROR" ||
        error.message === "ENDPOINT_NOT_FOUND" ||
        error.message === "NETWORK_ERROR"
      ) {
        return [
          {
            id: "ALT-001",
            type: "Critical",
            title: "Rapid Lake Expansion Detected",
            location: "AOI-007, Leh District",
            message: "Glacial lake has expanded by 2.3 km² in 15 days. Immediate assessment required.",
            timestamp: "2024-06-15 14:30:00",
            status: "Active",
            severity: "critical",
          },
          {
            id: "ALT-002",
            type: "High",
            title: "Unusual Growth Pattern",
            location: "AOI-012, Sikkim",
            message: "Lake growth rate 300% above historical average for this season.",
            timestamp: "2024-06-14 09:15:00",
            status: "Acknowledged",
            severity: "high",
          },
        ]
      }
      throw error
    }
  }

  async createAlert(alertData: any) {
    try {
      return await this.request("/alerts", {
        method: "POST",
        body: JSON.stringify(alertData),
      })
    } catch (error: any) {
      if (error.message === "SERVER_ERROR" || error.message === "ENDPOINT_NOT_FOUND") {
        return {
          id: `ALT-${Date.now()}`,
          ...alertData,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  // Report methods with fallback
  async getReports() {
    try {
      return await this.request("/reports")
    } catch (error: any) {
      if (
        error.message === "SERVER_ERROR" ||
        error.message === "ENDPOINT_NOT_FOUND" ||
        error.message === "NETWORK_ERROR"
      ) {
        return [
          {
            id: "RPT-001",
            title: "Monthly Glacial Lake Assessment - June 2024",
            type: "Comprehensive",
            aoi: "AOI-007 (Leh District)",
            generatedDate: "2024-06-15",
            status: "Ready",
            size: "2.4 MB",
            pages: 24,
          },
          {
            id: "RPT-002",
            title: "Risk Assessment Summary - Sikkim Region",
            type: "Risk Analysis",
            aoi: "AOI-012 (Sikkim)",
            generatedDate: "2024-06-14",
            status: "Ready",
            size: "1.8 MB",
            pages: 16,
          },
        ]
      }
      throw error
    }
  }

  async generateReport(reportData: any) {
    try {
      return await this.request("/reports", {
        method: "POST",
        body: JSON.stringify(reportData),
      })
    } catch (error: any) {
      if (error.message === "SERVER_ERROR" || error.message === "ENDPOINT_NOT_FOUND") {
        return {
          id: `RPT-${Date.now()}`,
          ...reportData,
          status: "completed",
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  // Glacial Lake methods with fallback
  async getGlacialLakes(aoiId?: string) {
    try {
      const params = aoiId ? `?aoi_id=${aoiId}` : ""
      return await this.request(`/glacial-lakes${params}`)
    } catch (error: any) {
      if (
        error.message === "SERVER_ERROR" ||
        error.message === "ENDPOINT_NOT_FOUND" ||
        error.message === "NETWORK_ERROR"
      ) {
        return [
          {
            id: "LAKE-001",
            name: "Pangong Lake",
            area_km2: 12.3,
            risk_level: "medium",
            aois: { location: "Leh, Ladakh" },
            last_updated: "2024-06-15",
          },
          {
            id: "LAKE-002",
            name: "Tso Moriri",
            area_km2: 18.7,
            risk_level: "high",
            aois: { location: "Leh, Ladakh" },
            last_updated: "2024-06-15",
          },
          {
            id: "LAKE-003",
            name: "Gurudongmar Lake",
            area_km2: 7.8,
            risk_level: "low",
            aois: { location: "North Sikkim" },
            last_updated: "2024-06-14",
          },
        ]
      }
      throw error
    }
  }

  async createGlacialLake(lakeData: any) {
    try {
      return await this.request("/glacial-lakes", {
        method: "POST",
        body: JSON.stringify(lakeData),
      })
    } catch (error: any) {
      if (error.message === "SERVER_ERROR" || error.message === "ENDPOINT_NOT_FOUND") {
        return {
          id: `LAKE-${Date.now()}`,
          ...lakeData,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }
}

export const apiClient = new ApiClient()
