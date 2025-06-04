"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Send } from "lucide-react"
import { useState } from "react"

export function TransferToSSCard() {
  const [ssId, setSsId] = useState("")
  const [keyCount, setKeyCount] = useState("100")

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
          <Select value={ssId} onValueChange={setSsId}>
            <SelectTrigger
              id="ssId"
              className="border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20"
            >
              <SelectValue placeholder="Select SS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ss1">John Smith - North Region</SelectItem>
              <SelectItem value="ss2">Lisa Johnson - South Region</SelectItem>
              <SelectItem value="ss3">Mark Williams - East Region</SelectItem>
              <SelectItem value="ss4">Anna Davis - West Region</SelectItem>
              <SelectItem value="ss5">Robert Brown - Central Region</SelectItem>
            </SelectContent>
          </Select>
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
          />
        </div>
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-electric-orange to-electric-pink hover:from-electric-orange/80 hover:to-electric-pink/80 text-white"
        >
          <Send className="h-4 w-4 mr-1" />
          Transfer Keys
        </Button>
        <div className="text-xs text-muted-foreground">Last transfer: 250 keys to Lisa Johnson (1 day ago)</div>
      </CardContent>
    </Card>
  )
}
