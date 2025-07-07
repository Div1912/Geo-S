"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, AlertTriangle, Info, CheckCircle, X, Trash2 } from "lucide-react"

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "critical",
      title: "Critical Lake Expansion",
      message: "AOI-007 lake expanded by 2.3 km² in 15 days",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Processing Complete",
      message: "Sentinel-2 analysis finished for AOI-012",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Report Ready",
      message: "Weekly summary report is available for download",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "AOI Created Successfully",
      message: "New AOI-019 has been added to monitoring",
      timestamp: "1 day ago",
      read: true,
    },
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      case "warning":
        return <Bell className="w-5 h-5 text-yellow-400" />
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Bell className="w-5 h-5 text-slate-400" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Stay updated with real-time alerts and system notifications
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? "bg-slate-700/30 border-slate-600" : "bg-slate-700/50 border-slate-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h4 className={`font-medium ${notification.read ? "text-slate-300" : "text-white"}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <div key={notification.id} className="p-4 rounded-lg border bg-slate-700/50 border-slate-500">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{notification.title}</h4>
                              <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="critical" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {notifications
                    .filter((n) => n.type === "critical")
                    .map((notification) => (
                      <div key={notification.id} className="p-4 rounded-lg border bg-red-500/10 border-red-500/30">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{notification.title}</h4>
                              <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
