"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Map,
  Layers,
  Square,
  Circle,
  OctagonIcon as Polygon,
  Satellite,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Download,
} from "lucide-react"

export function MapInterface() {
  const [selectedTool, setSelectedTool] = useState<string>("pan")
  const [activeLayer, setActiveLayer] = useState<string>("satellite")
  const [showOverlay, setShowOverlay] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(12)
  const [coordinates, setCoordinates] = useState({ lat: 34.1526, lon: 77.5771 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [showAOIDialog, setShowAOIDialog] = useState(false)
  const [newAOI, setNewAOI] = useState({
    name: "",
    description: "",
    priority: "medium",
  })

  const [layers, setLayers] = useState([
    { id: "satellite", label: "Satellite", active: true },
    { id: "ndwi", label: "NDWI", active: false },
    { id: "change", label: "Change Detection", active: true },
    { id: "risk", label: "Risk Overlay", active: true },
  ])

  const tools = [
    { id: "pan", icon: Map, label: "Pan" },
    { id: "rectangle", icon: Square, label: "Rectangle AOI" },
    { id: "circle", icon: Circle, label: "Circle AOI" },
    { id: "polygon", icon: Polygon, label: "Polygon AOI" },
  ]

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    if (toolId !== "pan") {
      setIsDrawing(true)
    }
  }

  const handleLayerToggle = (layerId: string) => {
    setLayers(layers.map((layer) => (layer.id === layerId ? { ...layer, active: !layer.active } : layer)))
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 1))
  }

  const handleResetView = () => {
    setZoomLevel(12)
    setCoordinates({ lat: 34.1526, lon: 77.5771 })
    setSelectedTool("pan")
    setIsDrawing(false)
  }

  const handleMapClick = useCallback(
    (event: React.MouseEvent) => {
      if (selectedTool !== "pan" && isDrawing) {
        // Simulate AOI creation
        setShowAOIDialog(true)
        setIsDrawing(false)
      }
    },
    [selectedTool, isDrawing],
  )

  const handleSaveAOI = () => {
    console.log("Saving AOI:", newAOI)
    setShowAOIDialog(false)
    setNewAOI({ name: "", description: "", priority: "medium" })
    setSelectedTool("pan")
  }

  const handleExportMap = () => {
    console.log("Exporting map view...")
    // Simulate export functionality
  }

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700 h-[600px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Satellite className="w-5 h-5 mr-2 text-blue-400" />
                Interactive Map
              </CardTitle>
              <CardDescription className="text-slate-400">Draw AOIs and visualize glacial lake changes</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                Live Data
              </Badge>
              <Button variant="outline" size="sm" onClick={handleResetView}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportMap}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          {/* Map Container */}
          <div
            className="relative h-[500px] bg-gradient-to-br from-blue-900 to-slate-800 rounded-lg overflow-hidden cursor-crosshair"
            onClick={handleMapClick}
          >
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center"></div>
            </div>

            {/* Map Overlays */}
            <div className="absolute inset-0">
              {/* Simulated Glacial Lakes */}
              {layers.find((l) => l.id === "satellite")?.active && (
                <>
                  <div className="absolute top-20 left-32 w-16 h-12 bg-cyan-400/60 rounded-full animate-pulse"></div>
                  <div className="absolute top-40 left-48 w-20 h-16 bg-cyan-400/60 rounded-full animate-pulse"></div>
                  <div className="absolute top-60 right-40 w-12 h-10 bg-red-400/60 rounded-full animate-pulse"></div>
                </>
              )}

              {/* AOI Boundaries */}
              {layers.find((l) => l.id === "change")?.active && (
                <>
                  <div className="absolute top-16 left-28 w-24 h-20 border-2 border-yellow-400 border-dashed rounded"></div>
                  <div className="absolute top-56 right-36 w-20 h-16 border-2 border-red-400 border-dashed rounded"></div>
                </>
              )}

              {/* Drawing indicator */}
              {isDrawing && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Click to draw {selectedTool} AOI
                </div>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2">
                <div className="grid grid-cols-2 gap-1">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleToolSelect(tool.id)}
                      className="w-10 h-10 p-0"
                      title={tool.label}
                    >
                      <tool.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 space-y-1">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="absolute top-4 right-4">
              <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-600 w-48">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    Layers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{layer.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => handleLayerToggle(layer.id)}
                      >
                        {layer.active ? (
                          <Eye className="w-4 h-4 text-blue-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Coordinates Display */}
            <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded px-3 py-1">
              <span className="text-xs text-slate-300">
                Lat: {coordinates.lat.toFixed(4)}° N, Lon: {coordinates.lon.toFixed(4)}° E | Zoom: {zoomLevel}
              </span>
            </div>

            {/* Scale */}
            <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded px-3 py-1">
              <span className="text-xs text-slate-300">Scale: 1:{(50000 / zoomLevel) * 4}</span>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-16 right-4">
            <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-600 w-40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-white">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-xs text-slate-300">Glacial Lakes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-slate-300">High Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-2 border border-yellow-400 border-dashed"></div>
                  <span className="text-xs text-slate-300">AOI Boundary</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* AOI Creation Dialog */}
      <Dialog open={showAOIDialog} onOpenChange={setShowAOIDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New AOI</DialogTitle>
            <DialogDescription className="text-slate-400">
              Define the properties for your new Area of Interest
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aoi-name" className="text-slate-300">
                AOI Name
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
              <Label htmlFor="aoi-description" className="text-slate-300">
                Description
              </Label>
              <Textarea
                id="aoi-description"
                placeholder="Describe the monitoring objectives..."
                value={newAOI.description}
                onChange={(e) => setNewAOI({ ...newAOI, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAOIDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAOI}>
                <Save className="w-4 h-4 mr-2" />
                Create AOI
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
