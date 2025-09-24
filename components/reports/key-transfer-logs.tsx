"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, Filter, Search, ArrowUp, ArrowDown, Wallet, ChevronLeft, ChevronRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { getNdKeyTransferLogs, exportNdKeyTransferLogs, KeyTransferLog, KeyTransferLogsResponse } from "@/lib/api"
import { toast } from "sonner"

export function KeyTransferLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "sent" | "received">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "failed">("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [logsResponse, setLogsResponse] = useState<KeyTransferLogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchLogs = async (currentPage: number, currentType: "all" | "sent" | "received", currentStatus: "all" | "completed" | "pending" | "failed", currentDate: Date | undefined, currentSearchTerm: string) => {
    setLoading(true)
    setError(null)
    try {
      let startDate: string | undefined = undefined;
      let endDate: string | undefined = undefined;

      if (currentDate) {
        startDate = format(currentDate, 'yyyy-MM-dd');
        endDate = format(currentDate, 'yyyy-MM-dd');
      }

      const type = currentType === 'all' ? undefined : currentType;
      const status = currentStatus === 'all' ? undefined : currentStatus;

      const data = await getNdKeyTransferLogs(
        currentPage,
        pageSize,
        startDate,
        endDate,
        status,
        type,
        currentSearchTerm
      )
      setLogsResponse(data)
    } catch (err) {
      console.error("Error fetching key transfer logs:", err)
      setError("Failed to load key transfer logs. Please try again.")
      toast.error("Failed to load key transfer logs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchLogs(page, typeFilter, statusFilter, date, searchTerm);
    }, 500); // Debounce search for 500ms

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [page, typeFilter, statusFilter, date, searchTerm, pageSize]);

  const handleExport = async () => {
    try {
      let startDate: string | undefined = undefined;
      let endDate: string | undefined = undefined;

      if (date) {
        startDate = format(date, 'yyyy-MM-dd');
        endDate = format(date, 'yyyy-MM-dd');
      }

      const type = typeFilter === 'all' ? undefined : typeFilter;
      const status = statusFilter === 'all' ? undefined : statusFilter;

      await exportNdKeyTransferLogs({
        startDate,
        endDate,
        status,
        type,
        search: searchTerm,
      })
      toast.success("Your key transfer logs export has started. It will download automatically.")
    } catch (err: any) {
      console.error("Failed to export key transfer logs:", err)
      toast.error(err.response?.data?.message || "Failed to export logs. Please try again.")
    }
  }

  const totalPages = logsResponse ? Math.ceil(logsResponse.total / pageSize) : 1;
  const paginatedData = logsResponse ? logsResponse.logs : [];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
      case "pending":
        return "bg-gradient-to-r from-electric-blue to-electric-purple border-0"
      case "failed":
        return "bg-gradient-to-r from-electric-orange to-electric-pink border-0"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, sender, or receiver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Select value={typeFilter} onValueChange={(value: "all" | "sent" | "received") => { setTypeFilter(value); setPage(1); }}>
                  <SelectTrigger className="w-[110px]">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(value: "all" | "completed" | "pending" | "failed") => { setStatusFilter(value); setPage(1); }}
                >
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(selectedDate) => { setDate(selectedDate); setPage(1); }} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading key transfer logs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : paginatedData.length === 0 ? (
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <div className="text-lg font-medium mb-2">No Transfer Logs Found</div>
                <div className="text-sm">Try adjusting your search or filter criteria</div>
              </div>
            </CardContent>
          </Card>
        ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="block lg:hidden space-y-4">
            {paginatedData.map((log) => (
            <Card
                key={log.transferId}
              className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={log.type === "received" ? "default" : "outline"}
                      className={
                        log.type === "received"
                          ? "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
                          : "border-electric-orange text-electric-orange"
                      }
                    >
                      {log.type === "received" ? (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      )}
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                    </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline" className={getStatusBadgeClass(log.status)}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="font-medium">{log.transferId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{log.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">From:</span>
                      <span className="text-sm truncate max-w-[150px]">{log.from?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">To:</span>
                      <span className="text-sm truncate max-w-[150px]">{log.to?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Notes:</span>
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-electric-blue">{log.notes || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden lg:block border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Quantity</th>
                    <th className="px-4 py-3 text-left font-medium">From</th>
                    <th className="px-4 py-3 text-left font-medium">To</th>
                      <th className="px-4 py-3 text-left font-medium">Notes</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                    {paginatedData.map((log) => (
                      <tr key={log.transferId} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{log.transferId}</td>
                        <td className="px-4 py-3">{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={log.type === "received" ? "default" : "outline"}
                          className={
                            log.type === "received"
                              ? "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
                              : "border-electric-orange text-electric-orange"
                          }
                        >
                          {log.type === "received" ? (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          )}
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </Badge>
                      </td>
                        <td className="px-4 py-3 font-medium">{log.count.toLocaleString()}</td>
                        <td className="px-4 py-3">{log.from?.name || "N/A"}</td>
                        <td className="px-4 py-3">{log.to?.name || "N/A"}</td>
                        <td className="px-4 py-3">{log.notes || "N/A"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={getStatusBadgeClass(log.status)}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
