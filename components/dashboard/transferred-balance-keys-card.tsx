"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeftRight, Wallet, ArrowUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getNdReportsSummary, NdReportsSummary } from "@/lib/api"

export function TransferredBalanceKeysCard() {
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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-cyan/10 to-electric-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Transferred / Balance Keys
          </CardTitle>
          <div className="rounded-full p-3 bg-gradient-to-r from-electric-cyan to-electric-green shadow-lg">
            <ArrowLeftRight className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-electric-cyan to-electric-green bg-clip-text text-transparent">
            Loading...
          </div>
          <p className="text-sm text-muted-foreground mt-2">Fetching data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-cyan/10 to-electric-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Transferred / Balance Keys
          </CardTitle>
          <div className="rounded-full p-3 bg-gradient-to-r from-electric-cyan to-electric-green shadow-lg">
            <ArrowLeftRight className="h-5 w-5 text-white" />
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

  const transferRate = summary?.transferRate || 0;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-cyan/10 to-electric-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-electric-cyan/30 to-electric-green/30 rounded-full -translate-y-12 translate-x-12"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Transferred Keys
        </CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-cyan to-electric-green shadow-lg">
          <ArrowLeftRight className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-electric-cyan to-electric-green bg-clip-text text-transparent">
          {summary?.totalTransferredKeys.toLocaleString() || "N/A"}
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-electric-blue" />
              <span>Transfer Rate</span>
            </div>
            <span className="font-medium text-electric-cyan">{transferRate}%</span>
          </div>
          <Progress value={transferRate} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3 text-electric-cyan" />
              <span>Transferred: {summary?.totalTransferredKeys.toLocaleString() || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wallet className="h-3 w-3 text-electric-green" />
              <span>Balance: {summary?.balanceKeys.toLocaleString() || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
