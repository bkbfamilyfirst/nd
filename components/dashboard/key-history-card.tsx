"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { History, ArrowDownUp, ArrowUp, ArrowDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { getNdKeyTransferLogs, KeyTransferLog, KeyTransferLogsResponse } from "@/lib/api"
import { format } from 'date-fns';
import { Input } from "@/components/ui/input"

export function KeyHistoryCard() {
  const [period, setPeriod] = useState<string>("all")
  const [tab, setTab] = useState<"all" | "received" | "sent">("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [logsResponse, setLogsResponse] = useState<KeyTransferLogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLogs = async (currentPage: number, currentTab: "all" | "received" | "sent", currentPeriod: string, currentSearchTerm: string) => {
    setLoading(true)
    setError(null)
    try {
      let startDate: string | undefined = undefined;
      let endDate: string | undefined = undefined;

      const now = new Date();

      if (currentPeriod === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        startDate = format(weekAgo, 'yyyy-MM-dd');
      } else if (currentPeriod === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        startDate = format(monthAgo, 'yyyy-MM-dd');
      } else if (currentPeriod === "quarter") {
        const quarterAgo = new Date();
        quarterAgo.setMonth(now.getMonth() - 3);
        startDate = format(quarterAgo, 'yyyy-MM-dd');
      }
      endDate = format(now, 'yyyy-MM-dd');

      const type = currentTab === 'all' ? undefined : currentTab;

      const data = await getNdKeyTransferLogs(
        currentPage,
        pageSize,
        startDate,
        endDate,
        undefined, // status filter not directly in this card, can be added if needed
        type,
        currentSearchTerm
      )
      setLogsResponse(data)
    } catch (err) {
      console.error("Error fetching key transfer logs:", err)
      setError("Failed to load key history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchLogs(page, tab, period, searchTerm);
    }, 500); // Debounce search for 500ms

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [page, tab, period, searchTerm, pageSize]);

  const handleTabChange = (val: "all" | "received" | "sent") => {
    setTab(val)
    setPage(1)
  }

  const handlePeriodChange = (val: string) => {
    setPeriod(val)
    setPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const totalPages = logsResponse ? Math.ceil(logsResponse.total / pageSize) : 1
  const paginatedData = logsResponse ? logsResponse.logs : []

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
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[180px] h-8 text-xs"
          />
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

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading key history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No key history found for the selected filters.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-3">
                {paginatedData.map((item) => (
                  <div key={item.transferId} className="p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
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
                      <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{item.count.toLocaleString()}</span>
                      </div>
                      {item.type === "sent" && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">To:</span>
                          <span className="text-sm truncate max-w-[150px]">{item.to?.name || "N/A"}</span>
                        </div>
                      )}
                      {item.type === "received" && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">From:</span>
                          <span className="text-sm truncate max-w-[150px]">{item.from?.name || "N/A"}</span>
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
                        <th className="px-4 py-3 text-left font-medium">From</th>
                        <th className="px-4 py-3 text-left font-medium">To</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr key={item.transferId} className="border-t hover:bg-muted/30">
                          <td className="px-4 py-3">{new Date(item.timestamp).toLocaleDateString()}</td>
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
                          <td className="px-4 py-3 font-medium">{item.count.toLocaleString()}</td>
                          <td className="px-4 py-3">{item.from?.name || "N/A"}</td>
                          <td className="px-4 py-3">{item.to?.name || "N/A"}</td>
                          <td className="px-4 py-3">{item.status}</td>
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
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
