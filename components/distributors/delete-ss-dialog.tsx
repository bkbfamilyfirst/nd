"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Trash2 } from "lucide-react"
import type { StateSupervisor } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { deleteNdSs } from "@/lib/api"
import { useState } from "react"

interface DeleteSSDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ss: StateSupervisor
  onDelete: (id: string, success: boolean) => void
}

export function DeleteSSDialog({ open, onOpenChange, ss, onDelete }: DeleteSSDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteNdSs(ss.id)
      onDelete(ss.id, true)
      toast({
        title: "State Supervisor Deleted",
        description: `${ss.name} has been successfully deleted.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete state supervisor:", error)
      onDelete(ss.id, false)
      toast({
        title: "Failed to delete State Supervisor",
        description: `There was an error deleting ${ss.name}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-red-500 to-red-600">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            Delete State Supervisor
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the State Supervisor and remove all associated
            data.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Warning:</strong> You are about to delete <strong>{ss.name}</strong> from {ss.location}.
          </AlertDescription>
        </Alert>

        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <strong>State Supervisor Details:</strong>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <div className="font-medium">{ss.name}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Region:</span>
              <div className="font-medium">{ss.location}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <div className="font-medium">{ss.email}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Keys Allocated:</span>
              <div className="font-medium">{ss.keysAllocated?.toLocaleString() || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : <><Trash2 className="h-4 w-4 mr-2" />Delete Permanently</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
