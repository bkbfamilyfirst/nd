import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Edit, Shield } from "lucide-react"

export function NationalDistributorProfile() {
    return (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-purple via-electric-blue to-electric-cyan animate-gradient-shift">
            <CardContent className="p-6 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">National Distributor Profile</h2>
                                <Shield className="h-5 w-5 text-electric-yellow" />
                            </div>
                            <p className="mt-1 text-white/90">Manage your ND account and settings</p>
                        </div>
                    </div>
                    {/* <Button className="w-full bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 md:w-auto">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button> */}
                </div>
            </CardContent>
        </Card>
    )
}
