"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, Filter, Search, ArrowUp, ArrowDown, Wallet } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface TransferLog {
  id: string
  date: string
  type: "sent" | "received"
  quantity: number
  from: string
  to: string
  balance: number
  status: "completed" | "pending" | "failed"
}

const transferLogs: TransferLog[] = [
  {
    id: "TL001",
    date: "2023-06-01",
    type: "received",
    quantity: 1500,
    from: "Admin",
    to: "National Distributor",
    balance: 1500,
    status: "completed",
  },
  {
    id: "TL002",
    date: "2023-06-03",
    type: "sent",
    quantity: 250,
    from: "National Distributor",
    to: "John Smith (SS)",
    balance: 1250,
    status: "completed",
  },
  {
    id: "TL003",
    date: "2023-06-05",
    type: "sent",
    quantity: 300,
    from: "National Distributor",
    to: "Lisa Johnson (SS)",
    balance: 950,
    status: "completed",
  },
  {
    id: "TL004",
    date: "2023-06-10",
    type: "received",
    quantity: 800,
    from: "Admin",
    to: "National Distributor",
    balance: 1750,
    status: "completed",
  },
  {
    id: "TL005",
    date: "2023-06-12",
    type: "sent",
    quantity: 400,
    from: "National Distributor",
    to: "Mark Williams (SS)",
    balance: 1350,
    status: "completed",
  },
  {
    id: "TL006",
    date: "2023-06-15",
    type: "sent",
    quantity: 350,
    from: "National Distributor",
    to: "Anna Davis (SS)",
    balance: 1000,
    status: "pending",
  },
  {
    id: "TL007",
    date: "2023-06-20",
    type: "received",
    quantity: 1200,
    from: "Admin",
    to: "National Distributor",
    balance: 2200,
    status: "completed",
  },
  {
    id: "TL008",
    date: "2023-06-22",
    type: "sent",
    quantity: 500,
    from: "National Distributor",
    to: "Robert Brown (SS)",
    balance: 1700,
    status: "failed",
  },
  {
    id: "TL009",
    date: "2023-06-25",
    type: "sent",
    quantity: 300,
    from: "National Distributor",
    to: "Emily White (SS)",
    balance: 1400,
    status: "completed",
  },
  {
    id: "TL010",
    date: "2023-06-28",
    type: "received",
    quantity: 500,
    from: "Admin",
    to: "National Distributor",
    balance: 1900,
    status: "completed",
  },
]

export function KeyTransferLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "sent" | "received">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "failed">("all")
  const [date, setDate] = useState<Date | undefined>(undefined)

  const filteredLogs = transferLogs.filter((log) => {
    const matchesSearch =
      log.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesDate = !date || log.date === format(date, "yyyy-MM-dd")

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

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
                <Select value={typeFilter} onValueChange={(value: "all" | "sent" | "received") => setTypeFilter(value)}>
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
                  onValueChange={(value: "all" | "completed" | "pending" | "failed") => setStatusFilter(value)}
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
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4">
        {filteredLogs.length === 0 ? (
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <div className="text-lg font-medium mb-2">No Transfer Logs Found</div>
                <div className="text-sm">Try adjusting your search or filter criteria</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card
              key={log.id}
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
                    <span className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline" className={getStatusBadgeClass(log.status)}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ID:</span>
                    <span className="font-medium">{log.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{log.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">From:</span>
                    <span className="text-sm truncate max-w-[150px]">{log.from}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">To:</span>
                    <span className="text-sm truncate max-w-[150px]">{log.to}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <div className="flex items-center gap-1">
                      <Wallet className="h-4 w-4 text-electric-blue" />
                      <span className="font-medium">{log.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden lg:block border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <div className="text-lg font-medium mb-2">No Transfer Logs Found</div>
                <div className="text-sm">Try adjusting your search or filter criteria</div>
              </div>
            </div>
          ) : (
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
                    <th className="px-4 py-3 text-left font-medium">Balance</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{log.id}</td>
                      <td className="px-4 py-3">{new Date(log.date).toLocaleDateString()}</td>
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
                      <td className="px-4 py-3 font-medium">{log.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">{log.from}</td>
                      <td className="px-4 py-3">{log.to}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Wallet className="h-4 w-4 text-electric-blue" />
                          <span className="font-medium">{log.balance.toLocaleString()}</span>
                        </div>
                      </td>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
