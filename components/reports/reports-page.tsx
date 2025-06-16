"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileText } from "lucide-react"
import { KeyTransferLogs } from "./key-transfer-logs"
import { MonthlyActivationsSummary } from "./monthly-activations-summary"
import { getNdReportsSummary, NdReportsSummary } from "@/lib/api"

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("transfers")
  const [summary, setSummary] = useState<NdReportsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getNdReportsSummary()
        setSummary(data)
      } catch (err) {
        console.error("Failed to fetch ND reports summary for reports page:", err)
        setError("Failed to load summary data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  return (
    <div className="responsive-container py-4 sm:py-8">
      {/* Header */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-orange via-electric-pink to-electric-purple animate-gradient-shift mb-6">
        <CardContent className="p-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Reports & Analytics</h2>
                <p className="mt-1 text-white/90">Track key transfers and system performance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-3 bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-3 bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-6 text-red-500">
              <p>{error}</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-6 text-red-500">
              <p>{error}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Total Keys Transferred */}
          <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-3 bg-gradient-to-r from-electric-green to-electric-cyan">
                  <span className="text-white font-bold text-lg">🔑</span>
                </div>
                {/* Assuming transferProgress or similar metric for percentage change from API */}
                {summary?.transferRate !== undefined && (
                  <div className="text-xs font-medium bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                    {summary.transferRate > 0 ? `+${summary.transferRate}%` : `${summary.transferRate}%`}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Keys Transferred</h3>
                <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                  {summary?.totalKeysTransferred.toLocaleString() || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Activations */}
          <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-3 bg-gradient-to-r from-electric-orange to-electric-pink">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                {/* Assuming totalActivations has a growth metric, otherwise remove or set to 0% */}
                <div className="text-xs font-medium bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                  +0%
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Activations</h3>
                <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                  {summary?.totalActivations.toLocaleString() || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
          <TabsTrigger value="transfers" className="text-sm sm:text-base">
            <BarChart3 className="h-4 w-4 mr-2" />
            Key Transfer Logs
          </TabsTrigger>
          <TabsTrigger value="activations" className="text-sm sm:text-base">
            <FileText className="h-4 w-4 mr-2" />
            Monthly Activations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="mt-0">
          <KeyTransferLogs />
        </TabsContent>

        <TabsContent value="activations" className="mt-0">
          <MonthlyActivationsSummary />
        </TabsContent>
      </Tabs>
    </div>
  )
}
