"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart } from "lucide-react"
import { useEffect, useState } from "react"
import { getNdSsList, getNdSsStats, StateSupervisor, SsStats } from "@/lib/api"

export function SSAllocationCard() {
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
        console.error("Failed to fetch SS allocation data:", err)
        setError("Failed to load SS allocation data. Please try again.")
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
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
              SS Allocation & Usage
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                <span className="text-xs font-medium">Total SS</span>
                <span className="text-lg font-bold text-electric-purple">Loading...</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                <span className="text-xs font-medium">Allocated</span>
                <span className="text-lg font-bold text-electric-green">Loading...</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                <span className="text-xs font-medium">Used</span>
                <span className="text-lg font-bold text-electric-orange">Loading...</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm animate-pulse">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
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
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
              SS Allocation & Usage
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 font-medium">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const totalAllocated = ssList.reduce((sum, ss) => sum + ss.assignedKeys, 0);
  const totalUsed = ssList.reduce((sum, ss) => sum + ss.usedKeys, 0);

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
            SS Allocation & Usage
          </span>
        </CardTitle>

      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
              <span className="text-xs font-medium">Total SS</span>
              <span className="text-lg font-bold text-electric-purple">{ssStats?.total || 0}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <span className="text-xs font-medium">Allocated</span>
              <span className="text-lg font-bold text-electric-green">
                {totalAllocated.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
              <span className="text-xs font-medium">Used</span>
              <span className="text-lg font-bold text-electric-orange">
                {totalUsed.toLocaleString()}
              </span>
            </div>
          </div>

          {/* SS List with Usage */}
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {ssList.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No state supervisors found.</p>
            ) : (
              ssList.map((ss) => {
                const usagePercentage = ss.assignedKeys > 0 ? Math.round((ss.usedKeys / ss.assignedKeys) * 100) : 0
              let progressColor = "bg-electric-green"

              if (usagePercentage >= 80) {
                progressColor = "bg-electric-pink"
              } else if (usagePercentage >= 50) {
                progressColor = "bg-electric-orange"
              }

              return (
                <div
                    key={ss.id}
                  className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{ss.name}</div>
                        <div className="text-xs text-muted-foreground">{ss.location}</div>
                      </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Used: {ss.usedKeys.toLocaleString()}</span>
                        <span>Allocated: {ss.assignedKeys.toLocaleString()}</span>
                    </div>
                    <Progress value={usagePercentage} className={`h-2 ${progressColor}`} />
                  </div>
                </div>
              )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
