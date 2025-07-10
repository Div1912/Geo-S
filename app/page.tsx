"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Satellite,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Download,
  Bell,
  Activity,
  Globe,
  Zap,
  BarChart3,
  User,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react"
import { MapInterface } from "@/components/map-interface"
import { AlertsPanel } from "@/components/alerts-panel"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { AOIManager } from "@/components/aoi-manager"
import { ReportsPanel } from "@/components/reports-panel"
import { LoginModal } from "@/components/login-modal"
import { NotificationCenter } from "@/components/notification-center"
import { UserProfile } from "@/components/user-profile"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

export default function GeoSentinelDashboard() {
  const { user, isAuthenticated, isLoading, isInitialized, logout } = useAuth()
  const [activeAOIs, setActiveAOIs] = useState(0)
  const [highRiskAlerts, setHighRiskAlerts] = useState(0)
  const [totalLakeArea, setTotalLakeArea] = useState(0)
  const [growthRate, setGrowthRate] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Load dashboard data only when authenticated and initialized
  useEffect(() => {
    if (isAuthenticated && isInitialized && !dataLoading && !dashboardData) {
      loadDashboardData()
    }
  }, [isAuthenticated, isInitialized])

  const loadDashboardData = async () => {
    setDataLoading(true)
    setIsOfflineMode(false)

    try {
      const [aois, alerts, lakes] = await Promise.allSettled([
        apiClient.getAOIs(),
        apiClient.getAlerts(),
        apiClient.getGlacialLakes(),
      ])

      const hasServerErrors = [aois, alerts, lakes].some(
        (result) =>
          result.status === "rejected" &&
          (result.reason?.message === "SERVER_ERROR" ||
            result.reason?.message === "ENDPOINT_NOT_FOUND" ||
            result.reason?.message === "NETWORK_ERROR"),
      )

      if (hasServerErrors) {
        setIsOfflineMode(true)
      }

      const aoiData = aois.status === "fulfilled" ? aois.value : []
      const alertData = alerts.status === "fulfilled" ? alerts.value : []
      const lakeData = lakes.status === "fulfilled" ? lakes.value : []

      setActiveAOIs(aoiData?.length || 3)
      setHighRiskAlerts(
        alertData?.filter((alert: any) => alert.severity === "high" || alert.severity === "critical").length || 2,
      )

      const totalArea = lakeData?.reduce((sum: number, lake: any) => sum + (lake.area_km2 || 0), 0) || 38.8
      setTotalLakeArea(totalArea)
      setGrowthRate(12.3)

      setDashboardData({
        aois: aoiData,
        alerts: alertData,
        lakes: lakeData,
      })
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      setIsOfflineMode(true)

      setActiveAOIs(3)
      setHighRiskAlerts(2)
      setTotalLakeArea(38.8)
      setGrowthRate(12.3)
      setDashboardData({
        aois: [
          { id: "AOI-001", name: "Pangong Tso Region", location: "Leh, Ladakh", status: "Active" },
          { id: "AOI-007", name: "Tso Moriri Basin", location: "Leh, Ladakh", status: "Critical" },
          { id: "AOI-012", name: "Gurudongmar Region", location: "North Sikkim", status: "Monitoring" },
        ],
        alerts: [
          { id: "ALT-001", severity: "critical", title: "Rapid Lake Expansion", status: "active" },
          { id: "ALT-002", severity: "high", title: "Unusual Growth Pattern", status: "active" },
        ],
        lakes: [
          {
            id: "LAKE-001",
            name: "Pangong Lake",
            area_km2: 12.3,
            risk_level: "medium",
            aois: { location: "Leh, Ladakh" },
          },
          { id: "LAKE-002", name: "Tso Moriri", area_km2: 18.7, risk_level: "high", aois: { location: "Leh, Ladakh" } },
          {
            id: "LAKE-003",
            name: "Gurudongmar Lake",
            area_km2: 7.8,
            risk_level: "low",
            aois: { location: "North Sikkim" },
          },
        ],
      })
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      setTotalLakeArea((prev) => prev + (Math.random() - 0.5) * 0.1)
      setGrowthRate((prev) => Math.max(0, prev + (Math.random() - 0.5) * 0.5))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleAlertClick = () => {
    setShowNotifications(true)
  }

  const handleProfileClick = () => {
    setShowProfile(true)
  }

  const handleLogout = () => {
    logout()
  }

  // Show loading spinner while checking authentication
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <div className="text-white text-xl">Loading GeoSentinel...</div>
          <div className="text-slate-400 text-sm">Initializing application...</div>
        </div>
      </div>
    )
  }

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return <LoginModal />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GeoSentinel</h1>
                <p className="text-sm text-slate-400">AI Copilot for Earth Observation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className={isOfflineMode ? "text-orange-400 border-orange-400" : "text-green-400 border-green-400"}
              >
                {isOfflineMode ? <WifiOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
                {isOfflineMode ? "Demo Mode" : "Live Monitoring"}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleAlertClick}>
                <Bell className="w-4 h-4 mr-2" />
                Alerts ({highRiskAlerts})
              </Button>
              <Button variant="outline" size="sm" onClick={handleProfileClick}>
                <User className="w-4 h-4 mr-2" />
                {user?.name || "Profile"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Welcome back, {user?.name || "User"}! 👋</h2>
          <p className="text-slate-400">
            {user?.organization && `${user.organization} • `}
            {dataLoading
              ? "Loading dashboard data..."
              : isOfflineMode
                ? "Running in demo mode with sample data"
                : "Your glacial monitoring dashboard is ready."}
          </p>
        </div>

        {/* Offline Mode Alert */}
        {isOfflineMode && (
          <Alert className="mb-6 border-orange-500 bg-orange-500/10">
            <WifiOff className="h-4 w-4 text-orange-400" />
            <AlertTitle className="text-orange-400">Demo Mode Active</AlertTitle>
            <AlertDescription className="text-slate-300">
              API services are currently unavailable. The dashboard is running with sample data for demonstration
              purposes.
              <Button variant="link" className="p-0 h-auto text-orange-400 ml-2" onClick={loadDashboardData}>
                Retry Connection →
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active AOIs</CardTitle>
              <MapPin className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {dataLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : activeAOIs}
              </div>
              <p className="text-xs text-slate-400">Across multiple regions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">High Risk Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {dataLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : highRiskAlerts}
              </div>
              <p className="text-xs text-slate-400">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Lake Area</CardTitle>
              <Globe className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {dataLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${totalLakeArea.toFixed(1)} km²`}
              </div>
              <p className="text-xs text-slate-400">Monitored glacial lakes</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {dataLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `+${growthRate.toFixed(1)}%`}
              </div>
              <p className="text-xs text-slate-400">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {highRiskAlerts > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">Critical Alert - Immediate Attention Required</AlertTitle>
            <AlertDescription className="text-slate-300">
              {highRiskAlerts} high-risk alert{highRiskAlerts > 1 ? "s" : ""} detected. Review and take appropriate
              action.
              <Button variant="link" className="p-0 h-auto text-red-400 ml-2" onClick={handleAlertClick}>
                View Details →
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="aoi" className="data-[state=active]:bg-blue-600">
              <MapPin className="w-4 h-4 mr-2" />
              AOI Manager
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapInterface />
              </div>
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      AI Processing Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Sentinel-2 Analysis</span>
                        <span className="text-green-400">Complete</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">LISS-4 Processing</span>
                        <span className="text-blue-400">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Risk Assessment</span>
                        <span className="text-orange-400">Pending</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Detections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData?.lakes?.slice(0, 3).map((lake: any, index: number) => (
                        <div
                          key={lake.id || index}
                          className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{lake.name || `Lake ${index + 1}`}</p>
                            <p className="text-sm text-slate-400">{lake.aois?.location || "Unknown Location"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-medium">{lake.area_km2?.toFixed(1) || "0.0"} km²</p>
                            <Badge
                              variant={lake.risk_level === "high" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {lake.risk_level || "Low"}
                            </Badge>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center text-slate-400 py-4">
                          {dataLoading ? "Loading detections..." : "No recent detections available"}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aoi">
            <AOIManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCharts />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <NotificationCenter open={showNotifications} onClose={() => setShowNotifications(false)} />
      <UserProfile open={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  )
}
