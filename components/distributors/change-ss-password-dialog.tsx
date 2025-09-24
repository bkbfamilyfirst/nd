"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Copy } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { changeSsPassword } from "@/lib/api"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ssId: string | null
}

export function ChangeSSPasswordDialog({ open, onOpenChange, ssId }: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ status: 'idle' | 'success' | 'error'; message?: string }>({ status: 'idle' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!ssId) return
    if (!newPassword || newPassword.length < 6) {
      toast.error("Enter a valid password (min 6 chars)")
      return
    }
    setIsLoading(true)
    try {
      await changeSsPassword(ssId, newPassword)
      toast.success("Password changed successfully")
      setResult({ status: 'success', message: 'The password has been updated successfully.' })
    } catch (err) {
      console.error(err)
      const friendly = (err as any)?.response?.data?.message || (err as Error)?.message || 'Unable to update password. Please try again.'
      toast.error(friendly)
      setResult({ status: 'error', message: friendly })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Change SS Password</DialogTitle>
          <DialogDescription>Provide a new password for the State Supervisor.</DialogDescription>
        </DialogHeader>
        {result.status === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10 mt-2"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-electric-purple to-electric-blue" disabled={isLoading}>{isLoading ? 'Saving...' : 'Change Password'}</Button>
            </div>
          </form>
        )}

        {result.status === 'success' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{result.message}</div>
            <div className="p-3 rounded-md bg-muted/50 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">New Password</div>
                <div className="font-semibold break-all">{newPassword}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (!newPassword) return
                    navigator.clipboard.writeText(newPassword).then(() => {
                      toast.success('Password copied to clipboard')
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button onClick={() => { setResult({ status: 'idle' }); setNewPassword(''); onOpenChange(false); }} className="bg-gradient-to-r from-electric-purple to-electric-blue">Close</Button>
              </div>
            </div>
          </div>
        )}

        {result.status === 'error' && (
          <div className="space-y-4">
            <div className="text-sm text-destructive">{result.message}</div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => { setResult({ status: 'idle' }); }} >Retry</Button>
              <Button onClick={() => { setResult({ status: 'idle' }); setNewPassword(''); onOpenChange(false); }} className="bg-gradient-to-r from-electric-purple to-electric-blue">Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
