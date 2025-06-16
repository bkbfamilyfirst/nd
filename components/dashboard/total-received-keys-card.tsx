"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getNdReportsSummary, NdReportsSummary } from "@/lib/api"

export function TotalReceivedKeysCard() {
  const [summary, setSummary] = useState<NdReportsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getNdReportsSummary()
        setSummary(data)
      } catch (err) {
        console.error("Failed to fetch ND reports summary:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Received Keys</CardTitle>
          <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
            <Key className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
            Loading...
          </div>
          <p className="text-sm text-muted-foreground mt-2">Fetching data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Received Keys</CardTitle>
          <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
            <Key className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">
            Error
          </div>
          <p className="text-sm text-red-400 mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-purple/20 to-electric-blue/20 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Received Keys</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
          <Key className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
          {summary?.totalReceivedKeys.toLocaleString() || "N/A"}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="h-4 w-4 text-electric-green" />
          <p className="text-sm text-electric-green font-medium">{summary?.transferRate}% from total assigned</p>
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Assigned: {summary?.assignedKeys.toLocaleString() || "N/A"}</span>
          <span>Used: {summary?.usedKeys.toLocaleString() || "N/A"}</span>
        </div>
      </CardContent>
    </Card>
  )
}
