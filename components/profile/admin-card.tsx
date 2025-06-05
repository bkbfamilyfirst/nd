import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Calendar, Clock, Award, Users, Key } from "lucide-react"

export function AdminCard() {
    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-electric-purple/30">
                            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                            <AvatarFallback className="bg-gradient-to-r from-electric-purple to-electric-blue text-white text-2xl">
                                JD
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-electric-green to-electric-cyan rounded-full p-2">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
                <CardTitle className="text-xl font-bold">John Doe</CardTitle>
                <Badge className="bg-gradient-to-r from-electric-purple to-electric-blue text-white mx-auto">
                    Super Administrator
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Admin Details */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-electric-purple" />
                            <span className="text-sm font-medium">Joined</span>
                        </div>
                        <span className="text-sm font-bold text-electric-purple">Jan 2020</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-electric-green" />
                            <span className="text-sm font-medium">Last Login</span>
                        </div>
                        <span className="text-sm font-bold text-electric-green">2 hours ago</span>
                    </div>

                    {/* <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-electric-orange" />
                            <span className="text-sm font-medium">Experience</span>
                        </div>
                        <span className="text-sm font-bold text-electric-orange">5+ Years</span>
                    </div> */}
                </div>

                {/* Quick Stats */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                            <Users className="h-5 w-5 text-electric-blue mx-auto mb-1" />
                            <div className="text-lg font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
                                24
                            </div>
                            <div className="text-xs text-gray-500">Distributors</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                            <Key className="h-5 w-5 text-electric-green mx-auto mb-1" />
                            <div className="text-lg font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                                12.8K
                            </div>
                            <div className="text-xs text-gray-500">Keys Managed</div>
                        </div>
                    </div>
                </div>

                {/* Admin Permissions */}
                {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Permissions</h4>
                    <div className="space-y-2">
                        <Badge className="bg-gradient-to-r from-electric-green to-electric-cyan text-white text-xs">
                            Full System Access
                        </Badge>
                        <Badge className="bg-gradient-to-r from-electric-blue to-electric-purple text-white text-xs">
                            User Management
                        </Badge>
                        <Badge className="bg-gradient-to-r from-electric-orange to-electric-pink text-white text-xs">
                            Reports & Analytics
                        </Badge>
                    </div>
                </div> */}
            </CardContent>
        </Card>
    )
}
