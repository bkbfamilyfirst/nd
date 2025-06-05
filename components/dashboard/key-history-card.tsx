"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { History, ArrowDownUp, ArrowUp, ArrowDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const keyHistory = [
  { date: "2023-06-01", type: "received", quantity: 1500, from: "Admin", to: "National Distributor", balance: 1500 },
  { date: "2023-06-03", type: "sent", quantity: 250, from: "National Distributor", to: "John Smith (SS)", balance: 1250 },
  { date: "2023-06-05", type: "sent", quantity: 300, from: "National Distributor", to: "Lisa Johnson (SS)", balance: 950 },
  { date: "2023-06-10", type: "received", quantity: 800, from: "Admin", to: "National Distributor", balance: 1750 },
  { date: "2023-06-12", type: "sent", quantity: 400, from: "National Distributor", to: "Mark Williams (SS)", balance: 1350 },
  { date: "2023-06-15", type: "sent", quantity: 350, from: "National Distributor", to: "Anna Davis (SS)", balance: 1000 },
  { date: "2023-06-20", type: "received", quantity: 1200, from: "Admin", to: "National Distributor", balance: 2200 },
  { date: "2023-06-22", type: "sent", quantity: 500, from: "National Distributor", to: "Robert Brown (SS)", balance: 1700 },
  // Add more for pagination testing
]

export function KeyHistoryCard() {
  const [period, setPeriod] = useState("all")
  const [tab, setTab] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filteredHistory = keyHistory
    .filter((item) => {
      if (tab === "all") return true
      return item.type === tab
    })
    .filter((item) => {
      if (period === "all") return true
      const itemDate = new Date(item.date)
      const now = new Date()

      if (period === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(now.getDate() - 7)
        return itemDate >= weekAgo
      }

      if (period === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(now.getMonth() - 1)
        return itemDate >= monthAgo
      }

      if (period === "quarter") {
        const quarterAgo = new Date()
        quarterAgo.setMonth(now.getMonth() - 3)
        return itemDate >= quarterAgo
      }

      return true
    })

  const totalPages = Math.ceil(filteredHistory.length / pageSize)
  const paginatedData = filteredHistory.slice((page - 1) * pageSize, page * pageSize)

  const handleTabChange = (val: string) => {
    setTab(val)
    setPage(1)
  }

  const handlePeriodChange = (val: string) => {
    setPeriod(val)
    setPage(1)
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-pink">
            <History className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-purple to-electric-pink bg-clip-text text-transparent text-sm sm:text-base">
            Key History (Sent/Received)
          </span>
        </CardTitle>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" className="text-xs">
              <ArrowDownUp className="h-3 w-3 mr-1" />
              All
            </TabsTrigger>
            <TabsTrigger value="received" className="text-xs">
              <ArrowDown className="h-3 w-3 mr-1" />
              Received
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              Sent
            </TabsTrigger>
          </TabsList>

          {["all", "received", "sent"].map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="mt-0">
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-3">
                {paginatedData.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.type === "received" ? (
                          <>
                            <ArrowDown className="h-4 w-4 text-electric-green" />
                            <span className="text-sm font-medium text-electric-green">Received</span>
                          </>
                        ) : (
                          <>
                            <ArrowUp className="h-4 w-4 text-electric-orange" />
                            <span className="text-sm font-medium text-electric-orange">Sent</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{item.quantity.toLocaleString()}</span>
                      </div>
                      {item.type === "sent" && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">To:</span>
                          <span className="text-sm truncate max-w-[150px]">{item.to}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Quantity</th>
                        {tabKey !== "received" && <th className="px-4 py-3 text-left font-medium">To</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item, index) => (
                        <tr key={index} className="border-t hover:bg-muted/30">
                          <td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {item.type === "received" ? (
                                <>
                                  <ArrowDown className="h-4 w-4 text-electric-green" />
                                  <span className="text-electric-green">Received</span>
                                </>
                              ) : (
                                <>
                                  <ArrowUp className="h-4 w-4 text-electric-orange" />
                                  <span className="text-electric-orange">Sent</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{item.quantity.toLocaleString()}</td>
                          {tabKey !== "received" && <td className="px-4 py-3">{item.to}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <span>Show:</span>
                  <Select value={String(pageSize)} onValueChange={(val) => { setPageSize(Number(val)); setPage(1) }}>
                    <SelectTrigger className="w-[70px] h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
