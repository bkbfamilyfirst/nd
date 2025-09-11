"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import type { StateSupervisor } from "@/lib/api"
import { CardContent, Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface AddSSSuccessDialogProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  ss: StateSupervisor
  defaultPassword: string
}

export function AddSSSuccessDialog({ open, onOpenChangeAction, ss, defaultPassword }: AddSSSuccessDialogProps) {
  const handleCopyCredentials = () => {
    const credentials = `Name: ${ss.name}\nUsername: ${ss.username}\nEmail: ${ss.email}\nPhone: ${ss.phone}\nPassword: ${defaultPassword}`;
    navigator.clipboard.writeText(credentials);
    toast.success("Credentials copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
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

                <div className="font-medium text-muted-foreground">Username:</div>
                <div className="font-semibold">{ss.username}</div>

                <div className="font-medium text-muted-foreground">Email:</div>
                <div className="font-semibold">{ss.email}</div>

                <div className="font-medium text-muted-foreground">Phone:</div>
                <div className="font-semibold">{ss.phone}</div>

                <div className="font-medium text-muted-foreground">Password:</div>
                <div className="font-bold text-electric-purple break-all">{defaultPassword}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleCopyCredentials} className="flex-1">
            Copy Credentials
          </Button>
          <Button onClick={() => onOpenChangeAction(false)} className="flex-1 bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-purple/80 hover:to-electric-blue/80">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 