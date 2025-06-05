"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, UserCheck, UserX, KeyRound } from "lucide-react"
import { useState } from "react"
import { SSTable } from "./ss-table"
import { AddSSDialog } from "./add-ss-dialog"
import { EditSSDialog } from "./edit-ss-dialog"
import { DeleteSSDialog } from "./delete-ss-dialog"


export interface StateSupervisor {
  id: string
  name: string
  email: string
  phone: string
  region: string
  status: "active" | "blocked"
  keysAllocated: number
  keysUsed: number
  lastActive: string
  joinedDate: string
}

const initialSSData: StateSupervisor[] = [
  {
    id: "ss1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    region: "North Region",
    status: "active",
    keysAllocated: 1200,
    keysUsed: 876,
    lastActive: "2 hours ago",
    joinedDate: "2023-01-15",
  },
  {
    id: "ss2",
    name: "Lisa Johnson",
    email: "lisa.johnson@example.com",
    phone: "+1 (555) 234-5678",
    region: "South Region",
    status: "active",
    keysAllocated: 950,
    keysUsed: 782,
    lastActive: "5 mins ago",
    joinedDate: "2023-02-20",
  },
  {
    id: "ss3",
    name: "Mark Williams",
    email: "mark.williams@example.com",
    phone: "+1 (555) 345-6789",
    region: "East Region",
    status: "blocked",
    keysAllocated: 800,
    keysUsed: 523,
    lastActive: "3 days ago",
    joinedDate: "2023-03-10",
  },
  {
    id: "ss4",
    name: "Anna Davis",
    email: "anna.davis@example.com",
    phone: "+1 (555) 456-7890",
    region: "West Region",
    status: "active",
    keysAllocated: 1050,
    keysUsed: 912,
    lastActive: "1 hour ago",
    joinedDate: "2023-01-25",
  },
  {
    id: "ss5",
    name: "Robert Brown",
    email: "robert.brown@example.com",
    phone: "+1 (555) 567-8901",
    region: "Central Region",
    status: "active",
    keysAllocated: 750,
    keysUsed: 487,
    lastActive: "Just now",
    joinedDate: "2023-04-05",
  },
]

export function ManageSSPage() {
  const [ssData, setSSData] = useState<StateSupervisor[]>(initialSSData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSS, setEditingSS] = useState<StateSupervisor | null>(null)
  const [deletingSS, setDeletingSS] = useState<StateSupervisor | null>(null)

  const filteredSSData = ssData.filter((ss) => {
    const matchesSearch =
      ss.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ss.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ss.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ss.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddSS = (newSS: Omit<StateSupervisor, "id">) => {
    const id = `ss${Date.now()}`
    setSSData([...ssData, { ...newSS, id }])
    setIsAddDialogOpen(false)
  }

  const handleEditSS = (updatedSS: StateSupervisor) => {
    setSSData(ssData.map((ss) => (ss.id === updatedSS.id ? updatedSS : ss)))
    setEditingSS(null)
  }

  const handleDeleteSS = (id: string) => {
    setSSData(ssData.filter((ss) => ss.id !== id))
    setDeletingSS(null)
  }

  const handleToggleStatus = (id: string) => {
    setSSData(
      ssData.map((ss) => (ss.id === id ? { ...ss, status: ss.status === "active" ? "blocked" : "active" } : ss)),
    )
  }

  const activeCount = ssData.filter((ss) => ss.status === "active").length
  const blockedCount = ssData.filter((ss) => ss.status === "blocked").length

  return (
    <div className="responsive-container py-4 sm:py-8">
      {/* Header */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-blue via-electric-purple to-electric-pink animate-gradient-shift mb-6">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-white/20 backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Manage State Supervisors</h2>
                <p className="text-white/90 text-sm">Overview of your SS network</p>
              </div>
            </div>
            {/* Add any optional buttons here if needed */}
          </div>

          {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {ssData.length}
              </div>
              <div className="text-sm text-white/80">Total SS</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {activeCount}
              </div>
              <div className="text-sm text-white/80">Active</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {blockedCount}
              </div>
              <div className="text-sm text-white/80">Blocked</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {ssData.reduce((sum, ss) => sum + ss.keysAllocated, 0).toLocaleString()}
              </div>
              <div className="text-sm text-white/80">Total Keys</div>
            </div>
          </div> */}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-background/30 to-background/10 backdrop-blur-lg">
        <CardContent>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* Total SS */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-purple/20 to-electric-blue/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-electric-purple" />
                <span className="text-sm font-extrabold text-electric-purple">Total SS</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-purple">
                {ssData.length}
              </span>
            </div>

            {/* Active */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-green/20 to-electric-cyan/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="h-5 w-5 text-electric-green" />
                <span className="text-sm font-extrabold text-electric-green">Active</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-green">
                {activeCount}
              </span>
            </div>

            {/* Blocked */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-orange/20 to-electric-pink/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <UserX className="h-5 w-5 text-electric-orange" />
                <span className="text-sm font-extrabold text-electric-orange">Inactive</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-orange">
                {blockedCount}
              </span>
            </div>

            {/* Total Keys */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-yellow/20 to-electric-indigo/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="h-5 w-5 text-electric-yellow" />
                <span className="text-sm font-extrabold text-electric-yellow">Total Keys</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-yellow">
                {ssData.reduce((sum, ss) => sum + ss.keysAllocated, 0).toLocaleString()}
              </span>
            </div>

          </div>
        </CardContent>
      </Card>


      {/* Controls */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left section: Search + Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-1 w-full">
              {/* Search input */}
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "bg-gradient-to-r from-electric-purple to-electric-blue" : ""}
                >
                  All ({ssData.length})
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                  className={statusFilter === "active" ? "bg-gradient-to-r from-electric-green to-electric-cyan" : ""}
                >
                  Active ({activeCount})
                </Button>
                <Button
                  variant={statusFilter === "blocked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("blocked")}
                  className={statusFilter === "blocked" ? "bg-gradient-to-r from-electric-orange to-electric-pink" : ""}
                >
                  Inactive ({blockedCount})
                </Button>
              </div>
            </div>

            {/* Add New SS Button */}
            <div className="w-full sm:w-auto">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-purple/80 hover:to-electric-blue/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New SS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* SS Table */}
      <SSTable
        data={filteredSSData}
        onEdit={setEditingSS}
        onDelete={setDeletingSS}
        onToggleStatus={handleToggleStatus}
      />

      {/* Dialogs */}
      <AddSSDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddSS} />

      {editingSS && (
        <EditSSDialog
          open={!!editingSS}
          onOpenChange={(open) => !open && setEditingSS(null)}
          ss={editingSS}
          onEdit={handleEditSS}
        />
      )}

      {deletingSS && (
        <DeleteSSDialog
          open={!!deletingSS}
          onOpenChange={(open) => !open && setDeletingSS(null)}
          ss={deletingSS}
          onDelete={handleDeleteSS}
        />
      )}
    </div>
  )
}
