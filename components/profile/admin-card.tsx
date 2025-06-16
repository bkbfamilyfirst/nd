"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Calendar, Clock, Users, Key } from "lucide-react"
import { useEffect, useState } from "react"
import { getNdProfile, NdProfile, getNdSsStats, SsStats, getNdReportsSummary, NdReportsSummary } from "@/lib/api"

export function AdminCard() {
    const [profile, setProfile] = useState<NdProfile | null>(null)
    const [ssStats, setSsStats] = useState<SsStats | null>(null)
    const [reportsSummary, setReportsSummary] = useState<NdReportsSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, ssStatsData, reportsSummaryData] = await Promise.all([
                    getNdProfile(),
                    getNdSsStats(),
                    getNdReportsSummary(),
                ])
                setProfile(profileData)
                setSsStats(ssStatsData)
                setReportsSummary(reportsSummaryData)
            } catch (err) {
                console.error("Failed to fetch admin card data:", err)
                setError("Failed to load dashboard summary. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
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
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3 animate-pulse"></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-red-500">Error</CardTitle>
                    <p className="text-sm text-red-400">{error}</p>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">Please try again later.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-electric-purple/30">
                            <AvatarImage src="/placeholder-user.jpg" alt={profile?.name || "ND User"} />
                            <AvatarFallback className="bg-gradient-to-r from-electric-purple to-electric-blue text-white text-2xl">
                                {profile?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("}")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-electric-green to-electric-cyan rounded-full p-2">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
                <CardTitle className="text-xl font-bold">{profile?.name || "National Distributor"}</CardTitle>
                <Badge className="bg-gradient-to-r from-electric-purple to-electric-blue text-white mx-auto">
                    {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Role"}
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
                        <span className="text-sm font-bold text-electric-purple">
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-electric-green" />
                            <span className="text-sm font-medium">Last Login</span>
                        </div>
                        <span className="text-sm font-bold text-electric-green">
                            {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "N/A"}
                        </span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                            <Users className="h-5 w-5 text-electric-blue mx-auto mb-1" />
                            <div className="text-lg font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
                                {ssStats?.total || 0}
                            </div>
                            <div className="text-xs text-gray-500">Distributors</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                            <Key className="h-5 w-5 text-electric-green mx-auto mb-1" />
                            <div className="text-lg font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                                {reportsSummary?.totalReceivedKeys.toLocaleString() || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">Keys Managed</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
