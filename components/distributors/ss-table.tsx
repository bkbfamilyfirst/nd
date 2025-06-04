"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Mail, Phone, MapPin, Key, Clock } from "lucide-react"
import type { StateSupervisor } from "./manage-ss-page"

interface SSTableProps {
  data: StateSupervisor[]
  onEdit: (ss: StateSupervisor) => void
  onDelete: (ss: StateSupervisor) => void
  onToggleStatus: (id: string) => void
}

export function SSTable({ data, onEdit, onDelete, onToggleStatus }: SSTableProps) {
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
        {data.map((ss) => (
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
                        .map((n) => n[0])
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
                  <Switch checked={ss.status === "active"} onCheckedChange={() => onToggleStatus(ss.id)} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-electric-blue" />
                  <span className="text-muted-foreground">{ss.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-electric-green" />
                  <span className="text-muted-foreground">{ss.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-electric-orange" />
                  <span className="text-muted-foreground">{ss.region}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-electric-purple" />
                  <span className="text-muted-foreground">
                    {ss.keysUsed.toLocaleString()} / {ss.keysAllocated.toLocaleString()} keys
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-electric-cyan" />
                  <span className="text-muted-foreground">Last active: {ss.lastActive}</span>
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
                  onClick={() => onDelete(ss)}
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
                {data.map((ss) => (
                  <tr key={ss.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${ss.name}`} alt={ss.name} />
                          <AvatarFallback>
                            {ss.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{ss.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Joined {new Date(ss.joinedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-electric-blue" />
                          <span>{ss.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-electric-green" />
                          <span>{ss.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-electric-orange" />
                        <span>{ss.region}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {ss.keysUsed.toLocaleString()} / {ss.keysAllocated.toLocaleString()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-electric-blue to-electric-purple h-2 rounded-full"
                            style={{ width: `${(ss.keysUsed / ss.keysAllocated) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={ss.status === "active"} onCheckedChange={() => onToggleStatus(ss.id)} />
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
                        <span>{ss.lastActive}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(ss)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(ss)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
