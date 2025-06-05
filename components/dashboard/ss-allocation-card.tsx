"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart } from "lucide-react"


const ssData = [
  { name: "John Smith", region: "North Region", allocated: 1200, used: 876, active: 45 },
  { name: "Lisa Johnson", region: "South Region", allocated: 950, used: 782, active: 38 },
  { name: "Mark Williams", region: "East Region", allocated: 800, used: 523, active: 29 },
  { name: "Anna Davis", region: "West Region", allocated: 1050, used: 912, active: 42 },
  { name: "Robert Brown", region: "Central Region", allocated: 750, used: 487, active: 25 },
]

export function SSAllocationCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
            SS Allocation & Usage
          </span>
        </CardTitle>

      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
              <span className="text-xs font-medium">Total SS</span>
              <span className="text-lg font-bold text-electric-purple">{ssData.length}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <span className="text-xs font-medium">Allocated</span>
              <span className="text-lg font-bold text-electric-green">
                {ssData.reduce((sum, ss) => sum + ss.allocated, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
              <span className="text-xs font-medium">Used</span>
              <span className="text-lg font-bold text-electric-orange">
                {ssData.reduce((sum, ss) => sum + ss.used, 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* SS List with Usage */}
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {ssData.map((ss, index) => {
              const usagePercentage = Math.round((ss.used / ss.allocated) * 100)
              let progressColor = "bg-electric-green"

              if (usagePercentage >= 80) {
                progressColor = "bg-electric-pink"
              } else if (usagePercentage >= 50) {
                progressColor = "bg-electric-orange"
              }

              return (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{ss.name}</div>
                      <div className="text-xs text-muted-foreground">{ss.region}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Used: {ss.used.toLocaleString()}</span>
                      <span>Allocated: {ss.allocated.toLocaleString()}</span>
                    </div>
                    <Progress value={usagePercentage} className={`h-2 ${progressColor}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
