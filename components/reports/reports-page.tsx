"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileText, Download } from "lucide-react"
import { KeyTransferLogs } from "./key-transfer-logs"
import { MonthlyActivationsSummary } from "./monthly-activations-summary"


export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("transfers")

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

      {/* <Card>
        <CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                <div className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                  12,845
                </div>
                <div className="text-sm text-muted-foreground">Total Keys Transferred</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                <div className="text-2xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                  8,976
                </div>
                <div className="text-sm text-muted-foreground">Total Activations</div>
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Card> */}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Keys Transferred */}
        <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:scale-30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-xl p-3 bg-gradient-to-r from-electric-green to-electric-cyan">
                {/* You can replace this with an icon */}
                <span className="text-white font-bold text-lg">🔑</span>
              </div>
              <div className="text-xs font-medium bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                +2.3%
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Keys Transferred</h3>
              <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                12,845
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Activations */}
        <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:scale-30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-xl p-3 bg-gradient-to-r from-electric-orange to-electric-pink">
                {/* Replace with appropriate icon */}
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div className="text-xs font-medium bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                +1.8%
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Activations</h3>
              <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                8,976
              </p>
            </div>
          </CardContent>
        </Card>
      </div>


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
