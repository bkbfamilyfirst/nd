"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, UserCheck, UserX, KeyRound } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { SSTable } from "./ss-table"
import { AddSSDialog } from "./add-ss-dialog"
import { EditSSDialog } from "./edit-ss-dialog"
import { DeleteSSDialog } from "./delete-ss-dialog"
import { getNdSsList, getNdSsStats, addNdSs, updateNdSs, deleteNdSs, StateSupervisor as ApiStateSupervisor, SsStats } from "@/lib/api"
import { toast } from "sonner"
import { AddSSSuccessDialog } from "./add-ss-success-dialog"

export function ManageSSPage() {
  const [ssData, setSsData] = useState<ApiStateSupervisor[]>([])
  const [ssStats, setSsStats] = useState<SsStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "blocked">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSS, setEditingSS] = useState<ApiStateSupervisor | null>(null)
  const [deletingSS, setDeletingSS] = useState<ApiStateSupervisor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newlyAddedSS, setNewlyAddedSS] = useState<{ ss: ApiStateSupervisor; defaultPassword: string } | null>(null)
  

  const fetchSsData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [list, stats] = await Promise.all([
        getNdSsList(),
        getNdSsStats(),
      ])
      setSsData(Array.isArray(list) ? list : [])
      setSsStats(stats)
    } catch (err: any) {
      console.error("Failed to fetch SS data:", err)
      setError(err.response?.data?.message || "Failed to load State Supervisors.")
      toast.error(err.response?.data?.message || "Failed to load State Supervisors.")
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSsData()
  }, [fetchSsData])

  const filteredSSData = ssData.filter((ss) => {
    const matchesSearch =
      ss.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ss.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ss.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || (ss.status ?? '').toLowerCase().trim() === statusFilter || (statusFilter === "inactive" && (ss.status ?? '').toLowerCase().trim() === "inactive")

    console.log(`SS: ${ss.name}, Status: ${ss.status}, Filter: ${statusFilter}, Matches: ${matchesStatus}`)

    return matchesSearch && matchesStatus
  })

  console.log("SS Data:", ssData)
  console.log("Status Filter:", statusFilter)
  console.log("Filtered SS Data:", filteredSSData)

  const handleAddSS = async (newSS: { name: string; email: string; phone: string; address: string; status?: string; assignedKeys?: number; }) => {
    try {
      const response = await addNdSs({
        ...newSS,
        username: "",
        password: ""
      })
      toast.success(`State Supervisor ${response.ss.name} added successfully. Default password: ${response.ss.password}`)
      setNewlyAddedSS({ ss: response.ss, defaultPassword: response.ss.password })
      fetchSsData()
      setIsAddDialogOpen(false)
    } catch (err: any) {
      console.error("Error adding SS:", err)
      toast.error(err.response?.data?.message || "Failed to add State Supervisor.")
    }
  }

  const handleEditSS = async (updatedSS: ApiStateSupervisor) => {
    try {
      await updateNdSs(updatedSS.id, {
        name: updatedSS.name,
        email: updatedSS.email,
        phone: updatedSS.phone,
        address: updatedSS.address,
        status: updatedSS.status,
      })
      toast.success(`State Supervisor ${updatedSS.name} updated successfully.`)
      fetchSsData()
    setEditingSS(null)
    } catch (err: any) {
      console.error("Error updating SS:", err)
      toast.error(err.response?.data?.message || "Failed to update State Supervisor.")
    }
  }

  const handleDeleteSS = async (id: string) => {
    try {
      await deleteNdSs(id)
      toast.success("State Supervisor deleted successfully.")
      fetchSsData()
    setDeletingSS(null)
    } catch (err: any) {
      console.error("Error deleting SS:", err)
      toast.error(err.response?.data?.message || "Failed to delete State Supervisor.")
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "active" | "inactive" | "blocked") => {
    const newStatus = currentStatus === "active" ? "blocked" : "active"
    try {
      await updateNdSs(id, { status: newStatus })
      toast.success(`State Supervisor status updated to ${newStatus}.`)
      fetchSsData()
    } catch (err: any) {
      console.error("Error toggling SS status:", err)
      toast.error(err.response?.data?.message || "Failed to update status.")
    }
  }

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
                <p className="mt-1 text-white/90 text-1xl">Overview of your SS network</p>
              </div>
            </div>
          </div>
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
                {loading ? "..." : ssStats?.total || 0}
              </span>
            </div>

            {/* Active */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-green/20 to-electric-cyan/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="h-5 w-5 text-electric-green" />
                <span className="text-sm font-extrabold text-electric-green">Active</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-green">
                {loading ? "..." : ssStats?.active || 0}
              </span>
            </div>

            {/* Blocked */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-orange/20 to-electric-pink/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <UserX className="h-5 w-5 text-electric-orange" />
                <span className="text-sm font-extrabold text-electric-orange">Inactive</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-orange">
                {loading ? "..." : ssStats?.blocked || 0}
              </span>
            </div>

            {/* Total Keys */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-electric-yellow/20 to-electric-indigo/20 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="h-5 w-5 text-electric-yellow" />
                <span className="text-sm font-extrabold text-electric-yellow">Total Keys</span>
              </div>
              <span className="text-2xl font-extrabold text-electric-yellow">
                {loading ? "..." : ssStats?.totalKeys?.toLocaleString() || 0}
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
                  placeholder="Search by name, email, or location..."
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
                  disabled={loading}
                >
                  All ({loading ? "..." : ssStats?.total || 0})
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                  className={statusFilter === "active" ? "bg-gradient-to-r from-electric-green to-electric-cyan" : ""}
                >
                  Active ({ssStats?.active || 0})
                </Button>
                <Button
                  variant={statusFilter === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("inactive")}
                  className={statusFilter === "inactive" ? "bg-gradient-to-r from-electric-orange to-electric-pink" : ""}
                >
                  Inactive ({ssStats?.inactive || 0})
                </Button>
                <Button
                  variant={statusFilter === "blocked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("blocked")}
                  className={statusFilter === "blocked" ? "bg-gradient-to-r from-red-500 to-red-700" : ""}
                >
                  Blocked ({ssStats?.blocked || 0})
                </Button>
              </div>
            </div>

            {/* Add New SS Button */}
            <div className="w-full sm:w-auto">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-purple/80 hover:to-electric-blue/80"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New SS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SS Table */}
      {loading ? (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <div className="text-lg font-medium mb-2">Loading State Supervisors...</div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-center">
              <div className="text-lg font-medium mb-2">Error Loading Data</div>
              <div className="text-sm">{error}</div>
            </div>
          </CardContent>
        </Card>
      ) : (
      <SSTable
        data={filteredSSData}
        onEdit={setEditingSS}
        onDelete={setDeletingSS}
        onToggleStatus={handleToggleStatus}
      />
      )}

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

      {newlyAddedSS && (
        <AddSSSuccessDialog
          open={!!newlyAddedSS}
          onOpenChangeAction={() => setNewlyAddedSS(null)}
          ss={newlyAddedSS.ss}
          defaultPassword={newlyAddedSS.defaultPassword}
        />
      )}
    </div>
  )
}
