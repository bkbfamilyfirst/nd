"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, BarChart3, LineChart, PieChart, Calendar, TrendingUp, TrendingDown } from "lucide-react"

// Monthly activation data
const monthlyData = {
  "2023": {
    Jan: 450,
    Feb: 520,
    Mar: 610,
    Apr: 580,
    May: 750,
    Jun: 890,
    Jul: 920,
    Aug: 1050,
    Sep: 980,
    Oct: 1120,
    Nov: 1250,
    Dec: 1380,
  },
  "2024": {
    Jan: 1420,
    Feb: 1560,
    Mar: 1680,
    Apr: 1790,
    May: 1950,
    Jun: 2100,
  },
}

// Regional distribution data
const regionalData = [
  { region: "North Region", activations: 2450, percentage: 28 },
  { region: "South Region", activations: 1980, percentage: 22 },
  { region: "East Region", activations: 1650, percentage: 18 },
  { region: "West Region", activations: 1850, percentage: 21 },
  { region: "Central Region", activations: 950, percentage: 11 },
]

// Device type distribution
const deviceData = [
  { type: "Android", activations: 4850, percentage: 55 },
  { type: "iOS", activations: 3250, percentage: 37 },
  { type: "Windows", activations: 580, percentage: 6 },
  { type: "Other", activations: 200, percentage: 2 },
]

export function MonthlyActivationsSummary() {
  const [year, setYear] = useState("2024")
  const [viewType, setViewType] = useState("monthly")

  // Calculate total activations for the selected year
  const yearData = monthlyData[year as keyof typeof monthlyData] || {}
  const totalActivations = Object.values(yearData).reduce((sum, val) => sum + (val as number), 0)

  // Calculate month-over-month growth
  const months = Object.keys(yearData)
  const currentMonth = months[months.length - 1]
  const previousMonth = months[months.length - 2]
  const currentValue = yearData[currentMonth as keyof typeof yearData] as number
  const previousValue = yearData[previousMonth as keyof typeof yearData] as number
  const growthRate = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0
  const isGrowthPositive = growthRate >= 0

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Activations ({year})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              {totalActivations.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {isGrowthPositive ? (
                <TrendingUp className="h-4 w-4 text-electric-green" />
              ) : (
                <TrendingDown className="h-4 w-4 text-electric-orange" />
              )}
              <p className={`text-sm font-medium ${isGrowthPositive ? "text-electric-green" : "text-electric-orange"}`}>
                {growthRate.toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-electric-cyan to-electric-green bg-clip-text text-transparent">
              {regionalData[0].region}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="text-sm">
                <span className="font-medium">{regionalData[0].activations.toLocaleString()}</span> activations (
                {regionalData[0].percentage}%)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Device Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
              {deviceData[0].type}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="text-sm">
                <span className="font-medium">{deviceData[0].activations.toLocaleString()}</span> activations (
                {deviceData[0].percentage}%)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={viewType} onValueChange={setViewType} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Monthly Trend
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-xs sm:text-sm">
            <PieChart className="h-4 w-4 mr-2" />
            Regional Distribution
          </TabsTrigger>
          <TabsTrigger value="device" className="text-xs sm:text-sm">
            <LineChart className="h-4 w-4 mr-2" />
            Device Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-0">
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                Monthly Activations ({year})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px]">
                {/* Chart visualization - using div bars for simplicity */}
                <div className="flex items-end justify-between h-full pt-10 pb-6">
                  {Object.entries(yearData).map(([month, value]) => {
                    const percentage = ((value as number) / Math.max(...(Object.values(yearData) as number[]))) * 100
                    return (
                      <div key={month} className="flex flex-col items-center gap-2 w-full">
                        <div
                          className="w-4/5 sm:w-2/3 bg-gradient-to-t from-electric-purple to-electric-blue rounded-t-md"
                          style={{ height: `${percentage}%` }}
                        ></div>
                        <div className="text-xs sm:text-sm font-medium">{month}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {(value as number).toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="mt-0">
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-electric-cyan to-electric-green bg-clip-text text-transparent">
                Regional Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie chart visualization - using colored blocks for simplicity */}
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-electric-purple to-electric-blue rounded-full"
                      style={{ clipPath: `polygon(50% 50%, 50% 0%, ${50 + regionalData[0].percentage / 2}% 0%)` }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-electric-cyan to-electric-green rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + regionalData[0].percentage / 2}% 0%, 100% 0%, 100% ${
                          regionalData[1].percentage
                        }%)`,
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-electric-green to-electric-cyan rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, 100% ${regionalData[1].percentage}%, 100% 100%, ${
                          100 - regionalData[2].percentage
                        }% 100%)`,
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-electric-orange to-electric-pink rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, ${100 - regionalData[2].percentage}% 100%, 0% 100%, 0% ${
                          100 - regionalData[3].percentage
                        }%)`,
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-electric-pink to-electric-purple rounded-full"
                      style={{
                        clipPath: `polygon(50% 50%, 0% ${100 - regionalData[3].percentage}%, 0% 0%, 50% 0%)`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {regionalData.reduce((sum, r) => sum + r.activations, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend and data */}
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? "bg-gradient-to-r from-electric-purple to-electric-blue"
                              : index === 1
                                ? "bg-gradient-to-r from-electric-cyan to-electric-green"
                                : index === 2
                                  ? "bg-gradient-to-r from-electric-green to-electric-cyan"
                                  : index === 3
                                    ? "bg-gradient-to-r from-electric-orange to-electric-pink"
                                    : "bg-gradient-to-r from-electric-pink to-electric-purple"
                          }`}
                        ></div>
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{region.activations.toLocaleString()}</span>
                        <div className="w-16 text-right">
                          <span className="font-medium">{region.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device" className="mt-0">
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                Device Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deviceData.map((device, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{device.type}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{device.activations.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({device.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          index === 0
                            ? "bg-gradient-to-r from-electric-purple to-electric-blue"
                            : index === 1
                              ? "bg-gradient-to-r from-electric-cyan to-electric-green"
                              : index === 2
                                ? "bg-gradient-to-r from-electric-orange to-electric-pink"
                                : "bg-gradient-to-r from-electric-pink to-electric-purple"
                        }`}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
