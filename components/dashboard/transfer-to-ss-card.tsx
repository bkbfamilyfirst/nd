"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { getNdSsList, transferKeysToSs, StateSupervisor, KeyTransferLog, getNdKeyTransferLogs } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function TransferToSSCard() {
  const [ssId, setSsId] = useState("")
  const [keyCount, setKeyCount] = useState<number | string>("")
  const [ssList, setSsList] = useState<StateSupervisor[]>([])
  const [loadingSs, setLoadingSs] = useState(true)
  const [loadingTransfer, setLoadingTransfer] = useState(false)
  const [errorSs, setErrorSs] = useState<string | null>(null)
  const [lastTransfer, setLastTransfer] = useState<KeyTransferLog | null>(null)
  const { toast } = useToast()

  const fetchSsList = async () => {
    setLoadingSs(true)
    setErrorSs(null)
    try {
      const data = await getNdSsList()
      setSsList(Array.isArray(data) ? data : [])
      if (Array.isArray(data) && data.length > 0) {
        setSsId(data[0].id) // Select the first SS by default
      }
    } catch (err) {
      console.error("Failed to fetch SS list:", err)
      setErrorSs("Failed to load State Supervisors.")
    } finally {
      setLoadingSs(false)
    }
  }

  const fetchLastTransfer = async () => {
    try {
      const response = await getNdKeyTransferLogs(1, 1, undefined, undefined, "completed", "sent")
      if (response.logs.length > 0) {
        setLastTransfer(response.logs[0])
      }
    } catch (err) {
      console.error("Failed to fetch last transfer log:", err)
    }
  }

  useEffect(() => {
    fetchSsList()
    fetchLastTransfer()
  }, [])

  const handleTransferKeys = async () => {
    if (!ssId || !keyCount || Number(keyCount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a State Supervisor and enter a valid number of keys.",
        variant: "destructive",
      })
      return
    }

    setLoadingTransfer(true)
    try {
      await transferKeysToSs({
        ssId: ssId,
        keysToTransfer: Number(keyCount),
      })
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${keyCount} keys to the selected State Supervisor.`, 
      })
      setKeyCount("") // Clear input after successful transfer
      fetchSsList() // Refresh SS list to update available keys
      fetchLastTransfer() // Update last transfer log
    } catch (err: any) {
      console.error("Failed to transfer keys:", err)
      const errorMessage = err.response?.data?.message || "Failed to transfer keys. Please try again."
      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingTransfer(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-orange/10 to-electric-pink/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-electric-orange/20 to-electric-pink/20 rounded-full -translate-y-14 translate-x-14"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Transfer to SS</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-orange to-electric-pink shadow-lg">
          <ArrowRightLeft className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ssId" className="text-sm font-medium">
            State Supervisor
          </Label>
          {loadingSs ? (
            <p className="text-sm text-muted-foreground">Loading State Supervisors...</p>
          ) : errorSs ? (
            <p className="text-sm text-red-500">{errorSs}</p>
          ) : ssList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No State Supervisors available to transfer keys.</p>
          ) : (
            <Select value={ssId} onValueChange={setSsId} disabled={loadingTransfer}>
            <SelectTrigger
              id="ssId"
              className="border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20"
            >
              <SelectValue placeholder="Select SS" />
            </SelectTrigger>
            <SelectContent>
                {ssList.map((ss) => (
                  <SelectItem key={ss.id} value={ss.id}>
                    {ss.name} - {ss.location} ({ss.assignedKeys - ss.usedKeys} available)
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="keyCount" className="text-sm font-medium">
            Number of Keys
          </Label>
          <Input
            id="keyCount"
            type="number"
            value={keyCount}
            onChange={(e) => setKeyCount(e.target.value)}
            className="border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20"
            placeholder="Enter quantity"
            min="1"
            disabled={loadingTransfer || ssList.length === 0}
          />
        </div>
        <Button
          size="sm"
          onClick={handleTransferKeys}
          disabled={loadingTransfer || !ssId || Number(keyCount) <= 0}
          className="w-full bg-gradient-to-r from-electric-orange to-electric-pink hover:from-electric-orange/80 hover:to-electric-pink/80 text-white"
        >
          {loadingTransfer ? "Transferring..." : (
            <>
          <Send className="h-4 w-4 mr-1" />
          Transfer Keys
            </>
          )}
        </Button>
        <div className="text-xs text-muted-foreground">
          {lastTransfer ? (
            `Last transfer: ${lastTransfer.count} keys to ${lastTransfer.to?.name || 'N/A'} (${new Date(lastTransfer.timestamp).toLocaleDateString()})`
          ) : (
            "No recent transfers."
          )}
        </div>
      </CardContent>
    </Card>
  )
}
