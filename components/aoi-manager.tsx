"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Map,
  Satellite,
  AlertTriangle,
  Save,
  FileUp,
} from "lucide-react"

export function AOIManager() {
  const [selectedAOI, setSelectedAOI] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [aoiToDelete, setAoiToDelete] = useState<string | null>(null)
  const [editingAOI, setEditingAOI] = useState<any>(null)

  const [newAOI, setNewAOI] = useState({
    name: "",
    location: "",
    coordinates: "",
    description: "",
    priority: "medium",
  })

  const [aois, setAois] = useState([
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
      totalLakeArea: "12.3 km²",
      growthRate: "+2.1%",
      description: "High-altitude glacial lake monitoring in Pangong Tso region",
      priority: "high",
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
      totalLakeArea: "18.7 km²",
      growthRate: "+15.3%",
      description: "Critical monitoring zone with rapid lake expansion",
      priority: "critical",
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
      totalLakeArea: "7.8 km²",
      growthRate: "+8.7%",
      description: "Seasonal monitoring of Gurudongmar lake system",
      priority: "medium",
    },
    {
      id: "AOI-003",
      name: "Kedarnath Valley",
      location: "Uttarakhand",
      coordinates: "30.7346° N, 79.0669° E",
      area: "67.8 km²",
      status: "Active",
      risk: "Medium",
      lastUpdate: "2024-06-13",
      lakeCount: 3,
      totalLakeArea: "4.2 km²",
      growthRate: "+5.4%",
      description: "Post-disaster monitoring of Kedarnath region",
      priority: "high",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "destructive"
      case "Monitoring":
        return "secondary"
      case "Active":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-400"
      case "Medium":
        return "text-yellow-400"
      case "Low":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  const handleCreateAOI = () => {
    const aoiId = `AOI-${String(aois.length + 1).padStart(3, "0")}`
    const newAOIData = {
      ...newAOI,
      id: aoiId,
      area: "0 km²", // Will be calculated from coordinates
      status: "Active",
      risk: "Low",
      lastUpdate: new Date().toISOString().split("T")[0],
      lakeCount: 0,
      totalLakeArea: "0 km²",
      growthRate: "0%",
    }

    setAois([...aois, newAOIData])
    setNewAOI({
      name: "",
      location: "",
      coordinates: "",
      description: "",
      priority: "medium",
    })
    setShowCreateDialog(false)
  }

  const handleEditAOI = (aoi: any) => {
    setEditingAOI(aoi)
    setShowEditDialog(true)
  }

  const handleUpdateAOI = () => {
    setAois(aois.map((aoi) => (aoi.id === editingAOI.id ? editingAOI : aoi)))
    setShowEditDialog(false)
    setEditingAOI(null)
  }

  const handleDeleteAOI = (aoiId: string) => {
    setAoiToDelete(aoiId)
    setShowDeleteDialog(true)
  }

  const confirmDeleteAOI = () => {
    if (aoiToDelete) {
      setAois(aois.filter((aoi) => aoi.id !== aoiToDelete))
      setAoiToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  const handleViewAOI = (aoiId: string) => {
    console.log("Viewing AOI:", aoiId)
    // This would typically navigate to a detailed view
  }

  const handleExportAOI = (aoiId: string) => {
    const aoi = aois.find((a) => a.id === aoiId)
    if (aoi) {
      const dataStr = JSON.stringify(aoi, null, 2)
      const dataBlob = new Blob([dataStr], {
        type: "application/json",
      })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${aoi.id}_${aoi.name.replace(/\s+/g, "_")}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleImportAOI = () => {
    setShowImportDialog(true)
  }

  const filteredAOIs = aois.filter((aoi) => {
    const matchesSearch =
      aoi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aoi.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aoi.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || aoi.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* AOI Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Area of Interest Manager</h2>
          <p className="text-slate-400">Define and manage monitoring regions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleImportAOI}>
            <Upload className="w-4 h-4 mr-2" />
            Import AOI
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New AOI
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="list">AOI List</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search AOIs..."
                  className="pl-10 bg-slate-800 border-slate-600 text-white w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-slate-400">
              {filteredAOIs.length} AOIs • {filteredAOIs.filter((aoi) => aoi.status === "Active").length} Active
            </div>
          </div>

          {/* AOI Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAOIs.map((aoi) => (
              <Card
                key={aoi.id}
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-800/70 ${
                  selectedAOI === aoi.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedAOI(aoi.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(aoi.status)}>{aoi.status}</Badge>
                        <span className={`text-sm font-medium ${getRiskColor(aoi.risk)}`}>{aoi.risk} Risk</span>
                      </div>
                      <CardTitle className="text-white">{aoi.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {aoi.id} • {aoi.location}
                      </CardDescription>
                    </div>
                    {aoi.status === "Critical" && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Total Area</p>
                      <p className="text-sm font-medium text-white">{aoi.area}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Lake Count</p>
                      <p className="text-sm font-medium text-white">{aoi.lakeCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Lake Area</p>
                      <p className="text-sm font-medium text-white">{aoi.totalLakeArea}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Growth Rate</p>
                      <p
                        className={`text-sm font-medium ${
                          Number.parseFloat(aoi.growthRate) > 10
                            ? "text-red-400"
                            : Number.parseFloat(aoi.growthRate) > 5
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {aoi.growthRate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>Coordinates: {aoi.coordinates}</span>
                    <span>Updated: {aoi.lastUpdate}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewAOI(aoi.id)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditAOI(aoi)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportAOI(aoi.id)
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAOI(aoi.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Map className="w-5 h-5 mr-2" />
                AOI Map View
              </CardTitle>
              <CardDescription className="text-slate-400">
                Interactive map showing all defined Areas of Interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Satellite className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">Interactive AOI Map</p>
                  <p className="text-sm text-slate-500">All AOIs displayed with real-time status</p>
                  <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Draw New AOI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Himalayan Glacial Lakes",
                description: "Standard template for high-altitude glacial monitoring",
                regions: "Ladakh, Sikkim, Uttarakhand",
                coordinates: "32.0-35.0° N, 77.0-89.0° E",
              },
              {
                name: "Monsoon Risk Areas",
                description: "Enhanced monitoring during monsoon season",
                regions: "Northeast India",
                coordinates: "24.0-29.0° N, 88.0-97.0° E",
              },
              {
                name: "Critical Infrastructure",
                description: "Areas near dams, settlements, and infrastructure",
                regions: "All regions",
                coordinates: "Variable",
              },
            ].map((template, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-slate-400">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-300">Suitable for: {template.regions}</p>
                    <p className="text-xs text-slate-400">Coordinates: {template.coordinates}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setNewAOI({
                        ...newAOI,
                        name: template.name,
                        description: template.description,
                      })
                      setShowCreateDialog(true)
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create AOI Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create New AOI</DialogTitle>
            <DialogDescription className="text-slate-400">
              Define a new Area of Interest for glacial lake monitoring
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aoi-name" className="text-slate-300">
                AOI Name *
              </Label>
              <Input
                id="aoi-name"
                placeholder="e.g., Pangong Tso Region"
                value={newAOI.name}
                onChange={(e) => setNewAOI({ ...newAOI, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aoi-location" className="text-slate-300">
                Location *
              </Label>
              <Input
                id="aoi-location"
                placeholder="e.g., Leh, Ladakh"
                value={newAOI.location}
                onChange={(e) => setNewAOI({ ...newAOI, location: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aoi-coordinates" className="text-slate-300">
                Coordinates *
              </Label>
              <Input
                id="aoi-coordinates"
                placeholder="e.g., 33.7500° N, 78.9000° E"
                value={newAOI.coordinates}
                onChange={(e) => setNewAOI({ ...newAOI, coordinates: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aoi-priority" className="text-slate-300">
                Priority
              </Label>
              <Select value={newAOI.priority} onValueChange={(value) => setNewAOI({ ...newAOI, priority: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="aoi-description" className="text-slate-300">
                Description
              </Label>
              <Textarea
                id="aoi-description"
                placeholder="Describe the monitoring objectives and key features..."
                value={newAOI.description}
                onChange={(e) => setNewAOI({ ...newAOI, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAOI} disabled={!newAOI.name || !newAOI.location || !newAOI.coordinates}>
              <Save className="w-4 h-4 mr-2" />
              Create AOI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit AOI Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit AOI</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update the properties of {editingAOI?.name}
            </DialogDescription>
          </DialogHeader>
          {editingAOI && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-aoi-name" className="text-slate-300">
                  AOI Name *
                </Label>
                <Input
                  id="edit-aoi-name"
                  value={editingAOI.name}
                  onChange={(e) => setEditingAOI({ ...editingAOI, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-aoi-location" className="text-slate-300">
                  Location *
                </Label>
                <Input
                  id="edit-aoi-location"
                  value={editingAOI.location}
                  onChange={(e) => setEditingAOI({ ...editingAOI, location: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-aoi-coordinates" className="text-slate-300">
                  Coordinates *
                </Label>
                <Input
                  id="edit-aoi-coordinates"
                  value={editingAOI.coordinates}
                  onChange={(e) => setEditingAOI({ ...editingAOI, coordinates: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-aoi-priority" className="text-slate-300">
                  Priority
                </Label>
                <Select
                  value={editingAOI.priority}
                  onValueChange={(value) => setEditingAOI({ ...editingAOI, priority: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-aoi-description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="edit-aoi-description"
                  value={editingAOI.description}
                  onChange={(e) => setEditingAOI({ ...editingAOI, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAOI}>
              <Save className="w-4 h-4 mr-2" />
              Update AOI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete AOI</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this AOI? This action cannot be undone and will remove all associated
              monitoring data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAOI} className="bg-red-600 hover:bg-red-700">
              Delete AOI
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import AOI Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Import AOI</DialogTitle>
            <DialogDescription className="text-slate-400">
              Import AOI data from JSON file or coordinates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">Drop your JSON file here or click to browse</p>
              <p className="text-sm text-slate-400">Supports .json, .geojson, .kml files</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button>Import AOI</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
