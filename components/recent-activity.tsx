import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    user: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "/placeholder-user.jpg",
      initials: "SJ",
    },
    action: "activated new distributor",
    target: "TechGuard Solutions",
    time: "2 hours ago",
    type: "success",
  },
  {
    user: {
      name: "Michael Chen",
      email: "m.chen@example.com",
      avatar: "/placeholder-user.jpg",
      initials: "MC",
    },
    action: "generated monthly report",
    target: "Q4 Analytics",
    time: "5 hours ago",
    type: "info",
  },
  {
    user: {
      name: "Alex Rodriguez",
      email: "alex.r@example.com",
      avatar: "/placeholder-user.jpg",
      initials: "AR",
    },
    action: "updated security settings",
    target: "System Configuration",
    time: "1 day ago",
    type: "warning",
  },
]

const getBadgeColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-electric-green text-white"
    case "info":
      return "bg-electric-blue text-white"
    case "warning":
      return "bg-electric-orange text-white"
    default:
      return "bg-electric-purple text-white"
  }
}

export function RecentActivity() {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <Avatar className="ring-2 ring-electric-purple/30">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-electric-blue text-white">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold text-electric-purple">{activity.user.name}</span> {activity.action}{" "}
                  <span className="font-semibold text-electric-blue">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Badge className={getBadgeColor(activity.type)}>{activity.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
