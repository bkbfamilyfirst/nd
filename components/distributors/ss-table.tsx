"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Key,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChangeSSPasswordDialog } from "./change-ss-password-dialog"
import type { StateSupervisor } from "@/lib/api"

interface SSTableProps {
  data: StateSupervisor[]
  onEdit: (ss: StateSupervisor) => void
  onDelete: (ss: StateSupervisor) => void
  onToggleStatus: (id: string, status: "active" | "inactive" | "blocked") => void
  perPage?: number
}

export function SSTable({ data, onEdit, onDelete, onToggleStatus, perPage = 5 }: SSTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [selectedSsId, setSelectedSsId] = useState<string | null>(null)

  const totalPages = Math.ceil(data.length / perPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage
    return data.slice(start, start + perPage)
  }, [data, currentPage, perPage])

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  if (data.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <div className="text-lg font-medium mb-2">No State Supervisors Found</div>
            <div className="text-sm">Try adjusting your search or filter criteria</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4">
        {paginatedData.map((ss) => (
          <Card
            key={ss.id}
            className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48&query=${ss.name}`} alt={ss.name} />
                    <AvatarFallback>
                      {ss.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">{ss.name}</div>
                    <Badge
                      variant={ss.status === "active" ? "default" : "destructive"}
                      className={
                        ss.status === "active"
                          ? "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
                          : "bg-gradient-to-r from-electric-orange to-electric-pink border-0"
                      }
                    >
                      {ss.status.charAt(0).toUpperCase() + ss.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={ss.status === "active"} onCheckedChange={() => onToggleStatus(ss.id, ss.status)} />
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-electric-blue" />
                  <span>{ss.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-electric-green" />
                  <span>{ss.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-electric-orange" />
                  <span>{ss.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-electric-purple" />
                  <span>
                    {ss.transferredKeys?.toLocaleString() || "N/A"} / {ss.receivedKeys?.toLocaleString() || "N/A"} keys
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-electric-cyan" />
                  <span>Last active: {ss.updatedAt ? new Date(ss.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => onEdit(ss)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("SS object before onDelete:", ss);
                    onDelete(ss);
                  }}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
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
                  <th className="px-6 py-4 text-left font-medium">State Supervisor</th>
                  <th className="px-6 py-4 text-left font-medium">Contact</th>
                  <th className="px-6 py-4 text-left font-medium">Region</th>
                  <th className="px-6 py-4 text-left font-medium">Keys Usage</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Last Active</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((ss) => (
                  <tr key={ss.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${ss.name}`} alt={ss.name} />
                          <AvatarFallback>
                            {ss.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{ss.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Joined {ss.createdAt ? new Date(ss.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-electric-blue" />
                          <span>{ss.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-electric-green" />
                          <span>{ss.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-electric-orange" />
                        <span>{ss.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {ss.transferredKeys?.toLocaleString() || "N/A"} / {ss.receivedKeys?.toLocaleString() || "N/A"}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-electric-blue to-electric-purple h-2 rounded-full"
                            style={{ width: `${((ss.transferredKeys || 0) / (ss.receivedKeys || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={ss.status === "active"} onCheckedChange={() => onToggleStatus(ss.id, ss.status)} />
                        <Badge
                          variant={ss.status === "active" ? "default" : "destructive"}
                          className={
                            ss.status === "active"
                              ? "bg-gradient-to-r from-electric-green to-electric-cyan border-0"
                              : "bg-gradient-to-r from-electric-orange to-electric-pink border-0"
                          }
                        >
                          {ss.status.charAt(0).toUpperCase() + ss.status.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-electric-cyan" />
                        <span>{ss.updatedAt ? new Date(ss.updatedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => onEdit(ss)}>
                                      <Edit className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        console.log("SS object before onDelete (Desktop):", ss);
                                        onDelete(ss);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedSsId(ss.id)
                                        setIsChangePasswordOpen(true)
                                      }}
                                    >
                                      <Key className="h-4 w-4 mr-2" /> Change Password
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4 pr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <ChangeSSPasswordDialog open={isChangePasswordOpen} onOpenChange={(open) => { setIsChangePasswordOpen(open); if (!open) setSelectedSsId(null); }} ssId={selectedSsId} />
    </div>
  )
}
