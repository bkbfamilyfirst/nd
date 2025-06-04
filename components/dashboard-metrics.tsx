import { Shield, Users, FileText, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  {
    title: "Active National Distributors",
    value: "24",
    change: "+3 this month",
    trend: "up",
    gradient: "from-electric-purple to-electric-blue",
    icon: Users,
  },
  {
    title: "Total Protected Devices",
    value: "15,847",
    change: "+12.3%",
    trend: "up",
    gradient: "from-electric-cyan to-electric-green",
    icon: Shield,
  },
  {
    title: "Monthly Reports Generated",
    value: "1,234",
    change: "+8.7%",
    trend: "up",
    gradient: "from-electric-orange to-electric-pink",
    icon: FileText,
  },
]

export function DashboardMetrics() {
  return (
    <>
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</CardTitle>
            <div className={`rounded-full p-2 bg-gradient-to-r ${metric.gradient}`}>
              <metric.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
              {metric.value}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-electric-green" />
              <p className="text-xs text-electric-green font-medium">{metric.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
