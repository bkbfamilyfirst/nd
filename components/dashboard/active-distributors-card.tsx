"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserCheck, UserX } from "lucide-react"
import { useEffect, useState } from "react"
import { getNdSsList, getNdSsStats, StateSupervisor, SsStats } from "@/lib/api"

export function ActiveDistributorsCard() {
  const [ssList, setSsList] = useState<StateSupervisor[]>([])
  const [ssStats, setSsStats] = useState<SsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [list, stats] = await Promise.all([
          getNdSsList(),
          getNdSsStats(),
        ])
        setSsList(Array.isArray(list) ? list : [])
        setSsStats(stats)
      } catch (err) {
        console.error("Failed to fetch SS data:", err)
        setError("Failed to load state supervisors. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Active Distributors
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                <div className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4 text-electric-green" />
                  <span className="text-xs font-medium">Active</span>
                </div>
                <span className="text-lg font-bold text-electric-green">Loading...</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                <div className="flex items-center gap-1">
                  <UserX className="h-4 w-4 text-electric-orange" />
                  <span className="text-xs font-medium">Inactive</span>
                </div>
                <span className="text-lg font-bold text-electric-orange">Loading...</span>
              </div>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Active Distributors
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 font-medium">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
            <Users className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
            Active Distributors
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <div className="flex items-center gap-1">
                <UserCheck className="h-4 w-4 text-electric-green" />
                <span className="text-xs font-medium">Active</span>
              </div>
              <span className="text-lg font-bold text-electric-green">{ssStats?.active || 0}</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
              <div className="flex items-center gap-1">
                <UserX className="h-4 w-4 text-electric-orange" />
                <span className="text-xs font-medium">Inactive</span>
              </div>
              <span className="text-lg font-bold text-electric-orange">{ssStats?.blocked || 0}</span>
            </div>
          </div>

          {/* Distributor List */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {ssList.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No state supervisors found.</p>
            ) : (
              ssList.map((ss) => (
              <div
                  key={ss.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                        src={`/placeholder.svg?height=36&width=36&query=${ss.name}`}
                        alt={ss.name}
                    />
                    <AvatarFallback>
                        {ss.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                      <div className="font-medium text-sm">{ss.name}</div>
                      <div className="text-xs text-muted-foreground">{ss.address}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                      variant={ss.status === "active" ? "default" : "destructive"}
                    className={
                        ss.status === "active"
                        ? "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
                        : "bg-gradient-to-r from-electric-orange to-electric-pink border-0"
                    }
                  >
                      {ss.status.charAt(0).toUpperCase() + ss.status.slice(1)}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                      {ss.usedKeys}/{ss.assignedKeys} keys
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
