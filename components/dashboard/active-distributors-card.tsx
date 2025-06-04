"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserCheck, UserX, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const distributors = [
  {
    name: "Alex Johnson",
    region: "North Zone",
    status: "active",
    lastActive: "2 hours ago",
    keysAllocated: 450,
    keysUsed: 387,
  },
  {
    name: "Sarah Williams",
    region: "South Zone",
    status: "active",
    lastActive: "5 mins ago",
    keysAllocated: 320,
    keysUsed: 298,
  },
  {
    name: "Michael Brown",
    region: "East Zone",
    status: "inactive",
    lastActive: "3 days ago",
    keysAllocated: 280,
    keysUsed: 124,
  },
  {
    name: "Emily Davis",
    region: "West Zone",
    status: "active",
    lastActive: "1 hour ago",
    keysAllocated: 390,
    keysUsed: 356,
  },
  {
    name: "Robert Wilson",
    region: "Central Zone",
    status: "pending",
    lastActive: "Just now",
    keysAllocated: 200,
    keysUsed: 0,
  },
]

export function ActiveDistributorsCard() {
  const [filter, setFilter] = useState("all")

  const filteredDistributors = filter === "all" ? distributors : distributors.filter((d) => d.status === filter)

  const activeCount = distributors.filter((d) => d.status === "active").length
  const inactiveCount = distributors.filter((d) => d.status === "inactive").length
  const pendingCount = distributors.filter((d) => d.status === "pending").length

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
            <Users className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
            Active Distributors
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <div className="flex items-center gap-1">
                <UserCheck className="h-4 w-4 text-electric-green" />
                <span className="text-xs font-medium">Active</span>
              </div>
              <span className="text-lg font-bold text-electric-green">{activeCount}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
              <div className="flex items-center gap-1">
                <UserX className="h-4 w-4 text-electric-orange" />
                <span className="text-xs font-medium">Inactive</span>
              </div>
              <span className="text-lg font-bold text-electric-orange">{inactiveCount}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-electric-purple" />
                <span className="text-xs font-medium">Pending</span>
              </div>
              <span className="text-lg font-bold text-electric-purple">{pendingCount}</span>
            </div>
          </div>

          {/* Distributor List */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {filteredDistributors.map((distributor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`/placeholder.svg?height=36&width=36&query=${distributor.name}`}
                      alt={distributor.name}
                    />
                    <AvatarFallback>
                      {distributor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{distributor.name}</div>
                    <div className="text-xs text-muted-foreground">{distributor.region}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      distributor.status === "active"
                        ? "default"
                        : distributor.status === "inactive"
                          ? "destructive"
                          : "outline"
                    }
                    className={
                      distributor.status === "active"
                        ? "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
                        : distributor.status === "inactive"
                          ? "bg-gradient-to-r from-electric-orange to-electric-pink border-0"
                          : ""
                    }
                  >
                    {distributor.status.charAt(0).toUpperCase() + distributor.status.slice(1)}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {distributor.keysUsed}/{distributor.keysAllocated} keys
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
