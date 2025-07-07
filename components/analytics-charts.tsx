"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, AlertTriangle, Activity } from "lucide-react"

export function AnalyticsCharts() {
  const monthlyData = [
    { month: "Jan", area: 42.1, growth: 2.3 },
    { month: "Feb", area: 43.2, growth: 2.6 },
    { month: "Mar", area: 44.8, growth: 3.7 },
    { month: "Apr", area: 46.2, growth: 3.1 },
    { month: "May", area: 48.5, growth: 5.0 },
    { month: "Jun", area: 51.2, growth: 5.6 },
  ]

  const riskDistribution = [
    { level: "Low", count: 8, color: "bg-green-500" },
    { level: "Medium", count: 6, color: "bg-yellow-500" },
    { level: "High", count: 3, color: "bg-red-500" },
    { level: "Critical", count: 1, color: "bg-purple-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">+21.7%</div>
            <p className="text-xs text-slate-400">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Monthly Change</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">3.6 km²</div>
            <p className="text-xs text-slate-400">Per month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Prediction Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">94.2%</div>
            <p className="text-xs text-slate-400">AI model performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="trends">Growth Trends</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Lake Area Growth Over Time</CardTitle>
                <CardDescription className="text-slate-400">
                  Monthly progression of total glacial lake area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex flex-col items-center space-y-2">
                      <div
                        className="w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t"
                        style={{ height: `${(data.area / 60) * 200}px` }}
                      ></div>
                      <span className="text-xs text-slate-400">{data.month}</span>
                      <span className="text-xs text-white font-medium">{data.area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Growth Rate Analysis</CardTitle>
                <CardDescription className="text-slate-400">Monthly growth percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex flex-col items-center space-y-2">
                      <div
                        className="w-8 bg-gradient-to-t from-green-600 to-yellow-400 rounded-t"
                        style={{ height: `${(data.growth / 6) * 200}px` }}
                      ></div>
                      <span className="text-xs text-slate-400">{data.month}</span>
                      <span className="text-xs text-white font-medium">{data.growth}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Level Distribution</CardTitle>
                <CardDescription className="text-slate-400">Current risk assessment across all AOIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskDistribution.map((risk) => (
                    <div key={risk.level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${risk.color}`}></div>
                        <span className="text-slate-300">{risk.level} Risk</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{risk.count}</span>
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${risk.color}`}
                            style={{ width: `${(risk.count / 18) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">High-Risk Locations</CardTitle>
                <CardDescription className="text-slate-400">Areas requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "AOI-007", location: "Leh, Ladakh", risk: "Critical", change: "+2.3 km²" },
                    { id: "AOI-012", location: "Sikkim", risk: "High", change: "+1.8 km²" },
                    { id: "AOI-003", location: "Uttarakhand", risk: "High", change: "+1.5 km²" },
                  ].map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{location.id}</p>
                        <p className="text-sm text-slate-400">{location.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={location.risk === "Critical" ? "destructive" : "secondary"} className="mb-1">
                          {location.risk}
                        </Badge>
                        <p className="text-sm text-slate-300">{location.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">LSTM Forecasting Model</CardTitle>
              <CardDescription className="text-slate-400">
                Predicted glacial lake growth for next 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-white font-medium">Forecast Chart</p>
                  <p className="text-sm text-slate-400">LSTM model predictions</p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Generate Forecast
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Multi-Temporal Comparison</CardTitle>
              <CardDescription className="text-slate-400">Before and after analysis of selected AOIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">May 2024</p>
                  <div className="h-32 bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500">Before Image</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">June 2024</p>
                  <div className="h-32 bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500">After Image</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Detected 15.7% increase in lake area over 30-day period
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
