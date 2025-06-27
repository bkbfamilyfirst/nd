"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import type { StateSupervisor } from "@/lib/api"
import { CardContent, Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface AddSSSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ss: StateSupervisor
  defaultPassword: string
}

export function AddSSSuccessDialog({ open, onOpenChange, ss, defaultPassword }: AddSSSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-electric-green">
            <CheckCircle className="h-6 w-6" />
            State Supervisor Added Successfully!
          </DialogTitle>
          <DialogDescription>
            The new State Supervisor has been created. Please provide the following details to the new SS.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-electric-blue/5 to-electric-purple/5 border-electric-blue/20">
            <CardContent className="p-4">
              <h3 className="text-md font-semibold mb-2 text-electric-blue">Account Details:</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="font-medium text-muted-foreground">Name:</div>
                <div className="font-semibold">{ss.name}</div>

                <div className="font-medium text-muted-foreground">Email:</div>
                <div className="font-semibold">{ss.email}</div>
                
                <div className="font-medium text-muted-foreground">Phone:</div>
                <div className="font-semibold">{ss.phone}</div>

                <div className="font-medium text-muted-foreground">Address:</div>
                <div className="font-semibold">{ss.address}</div>

                <div className="font-medium text-muted-foreground">Initial Keys:</div>
                <div className="font-semibold">{ss.assignedKeys.toLocaleString()}</div>
              </div>
              <Separator className="my-4 bg-electric-purple/20" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="font-medium text-muted-foreground">Default Password:</div>
                <div className="font-bold text-electric-purple break-all">{defaultPassword}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button onClick={() => onOpenChange(false)} className="w-full bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-purple/80 hover:to-electric-blue/80">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
} 