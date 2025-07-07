"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertTriangle,
  Bell,
  MessageSquare,
  Mail,
  Phone,
  Settings,
  Filter,
  Search,
  Clock,
  MapPin,
  Volume2,
} from "lucide-react"

export function AlertsPanel() {
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [voiceAlerts, setVoiceAlerts] = useState(false)

  const alerts = [
    {
      id: "ALT-001",
      type: "Critical",
      title: "Rapid Lake Expansion Detected",
      location: "AOI-007, Leh District",
      message: "Glacial lake has expanded by 2.3 km² in 15 days. Immediate assessment required.",
      timestamp: "2024-06-15 14:30:00",
      status: "Active",
      actions: ["View AOI", "Generate Report", "Notify Authorities"],
    },
    {
      id: "ALT-002",
      type: "High",
      title: "Unusual Growth Pattern",
      location: "AOI-012, Sikkim",
      message: "Lake growth rate 300% above historical average for this season.",
      timestamp: "2024-06-14 09:15:00",
      status: "Acknowledged",
      actions: ["View Details", "Schedule Inspection"],
    },
    {
      id: "ALT-003",
      type: "Medium",
      title: "Seasonal Growth Threshold Exceeded",
      location: "AOI-003, Uttarakhand",
      message: "Lake area exceeded seasonal growth threshold by 0.8 km².",
      timestamp: "2024-06-13 16:45:00",
      status: "Resolved",
      actions: ["View Report"],
    },
    {
      id: "ALT-004",
      type: "Low",
      title: "Routine Monitoring Alert",
      location: "AOI-018, Himachal Pradesh",
      message: "Scheduled monitoring detected minor changes within normal parameters.",
      timestamp: "2024-06-12 11:20:00",
      status: "Closed",
      actions: ["Archive"],
    },
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "bg-red-500/10 border-red-500 text-red-400"
      case "High":
        return "bg-orange-500/10 border-orange-500 text-orange-400"
      case "Medium":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-400"
      case "Low":
        return "bg-blue-500/10 border-blue-500 text-blue-400"
      default:
        return "bg-slate-500/10 border-slate-500 text-slate-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "destructive"
      case "Acknowledged":
        return "secondary"
      case "Resolved":
        return "outline"
      case "Closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Alert Configuration
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure notification preferences and alert thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Push Notifications</span>
                  </div>
                  <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Email Alerts</span>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300">WhatsApp/Telegram</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-slate-300">Voice Alerts</span>
                  </div>
                  <Switch checked={voiceAlerts} onCheckedChange={setVoiceAlerts} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Alert Thresholds</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400">Critical (km²)</label>
                  <Input defaultValue="2.0" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">High (km²)</label>
                  <Input defaultValue="1.5" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Medium (km²)</label>
                  <Input defaultValue="1.0" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Contact List</h4>
              <div className="space-y-2">
                <div className="text-xs text-slate-400">District Collector, Leh</div>
                <div className="text-xs text-slate-400">NDMA Emergency Response</div>
                <div className="text-xs text-slate-400">Local Meteorological Dept</div>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Manage Contacts
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="active">Active Alerts (3)</TabsTrigger>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search alerts..." className="pl-10 bg-slate-800 border-slate-600 text-white w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          {alerts
            .filter((alert) => alert.status === "Active" || alert.status === "Acknowledged")
            .map((alert) => (
              <Card key={alert.id} className={`border ${getAlertColor(alert.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={alert.type === "Critical" ? "destructive" : "secondary"}>{alert.type}</Badge>
                        <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                        <span className="text-xs text-slate-400">#{alert.id}</span>
                      </div>
                      <CardTitle className="text-white text-lg">{alert.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{alert.message}</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.actions.map((action, index) => (
                      <Button key={index} variant="outline" size="sm">
                        {action}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border ${getAlertColor(alert.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.type === "Critical" ? "destructive" : "secondary"}>{alert.type}</Badge>
                      <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                      <span className="text-xs text-slate-400">#{alert.id}</span>
                    </div>
                    <CardTitle className="text-white text-lg">{alert.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">{alert.message}</p>
                <div className="flex flex-wrap gap-2">
                  {alert.actions.map((action, index) => (
                    <Button key={index} variant="outline" size="sm">
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">24</div>
                  <div className="text-sm text-slate-400">Critical Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">67</div>
                  <div className="text-sm text-slate-400">High Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">142</div>
                  <div className="text-sm text-slate-400">Medium Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">298</div>
                  <div className="text-sm text-slate-400">Total Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
