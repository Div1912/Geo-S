"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Eye,
  Share,
  Mail,
  Clock,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export function ReportsPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")
  const [reportType, setReportType] = useState("comprehensive")

  const reports = [
    {
      id: "RPT-001",
      title: "Monthly Glacial Lake Assessment - June 2024",
      type: "Comprehensive",
      aoi: "AOI-007 (Leh District)",
      generatedDate: "2024-06-15",
      status: "Ready",
      size: "2.4 MB",
      pages: 24,
      keyFindings: "Critical expansion detected - 2.3 km² growth",
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
      keyFindings: "Medium risk - seasonal growth within parameters",
    },
    {
      id: "RPT-003",
      title: "Multi-Temporal Analysis - Uttarakhand",
      type: "Trend Analysis",
      aoi: "AOI-003 (Uttarakhand)",
      generatedDate: "2024-06-13",
      status: "Processing",
      size: "Pending",
      pages: "Est. 20",
      keyFindings: "Analysis in progress...",
    },
    {
      id: "RPT-004",
      title: "Quarterly Summary Report - Q2 2024",
      type: "Summary",
      aoi: "All Active AOIs",
      generatedDate: "2024-06-12",
      status: "Ready",
      size: "5.2 MB",
      pages: 45,
      keyFindings: "Overall 12.3% increase across monitored regions",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "outline"
      case "Processing":
        return "secondary"
      case "Failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Generate New Report
          </CardTitle>
          <CardDescription className="text-slate-400">
            Create comprehensive PDF reports with AI analysis and visualizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  <SelectItem value="risk">Risk Assessment</SelectItem>
                  <SelectItem value="trend">Trend Analysis</SelectItem>
                  <SelectItem value="summary">Executive Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">AOI Selection</label>
              <Select>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select AOI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All AOIs</SelectItem>
                  <SelectItem value="aoi-007">AOI-007 (Leh)</SelectItem>
                  <SelectItem value="aoi-012">AOI-012 (Sikkim)</SelectItem>
                  <SelectItem value="aoi-003">AOI-003 (Uttarakhand)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search reports..." className="pl-10 bg-slate-800 border-slate-600 text-white w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="recent" className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                      <Badge variant="outline">{report.type}</Badge>
                      <span className="text-xs text-slate-400">#{report.id}</span>
                    </div>
                    <CardTitle className="text-white text-lg">{report.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {report.aoi} • Generated on {report.generatedDate}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{report.size}</p>
                    <p className="text-xs text-slate-400">{report.pages} pages</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-slate-300">
                    <strong>Key Findings:</strong> {report.keyFindings}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {report.status === "Ready" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                      </>
                    )}
                    {report.status === "Processing" && (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-blue-400">Processing...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{report.generatedDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Scheduled Reports</CardTitle>
              <CardDescription className="text-slate-400">Automated report generation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Weekly Risk Summary", frequency: "Every Monday", nextRun: "2024-06-17", aoi: "All AOIs" },
                  {
                    name: "Monthly Comprehensive Report",
                    frequency: "First of each month",
                    nextRun: "2024-07-01",
                    aoi: "High-risk AOIs",
                  },
                  { name: "Quarterly Analysis", frequency: "Every 3 months", nextRun: "2024-09-01", aoi: "All AOIs" },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{schedule.name}</p>
                      <p className="text-sm text-slate-400">
                        {schedule.frequency} • {schedule.aoi}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">Next: {schedule.nextRun}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Disable
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Add Scheduled Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "ISRO Standard Report",
                description: "Official format for ISRO submissions",
                sections: ["Executive Summary", "Methodology", "Findings", "Recommendations"],
                icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
              },
              {
                name: "Emergency Response Brief",
                description: "Quick assessment for emergency situations",
                sections: ["Critical Alerts", "Immediate Actions", "Risk Assessment"],
                icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
              },
              {
                name: "Trend Analysis Report",
                description: "Long-term trend analysis and forecasting",
                sections: ["Historical Data", "Trend Analysis", "Predictions", "Confidence Intervals"],
                icon: <TrendingUp className="w-8 h-8 text-green-400" />,
              },
            ].map((template, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {template.icon}
                    <div>
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-slate-400">{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-300 font-medium">Includes:</p>
                    <ul className="text-sm text-slate-400 space-y-1">
                      {template.sections.map((section, idx) => (
                        <li key={idx}>• {section}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
