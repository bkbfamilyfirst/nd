"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Save, Edit } from "lucide-react"
import { getNdProfile, updateNdProfile, NdProfile } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Partial<NdProfile>>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getNdProfile()
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email,
                    phone: data.phone,
                    address: data.address || "",
                    bio: data.bio || "",
                })
            } catch (err) {
                console.error("Failed to fetch ND profile:", err)
                setError("Failed to load profile data. Please try again.")
                toast({
                    title: "Error",
                    description: "Failed to load profile data. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [toast])

    const handleInputChange = (field: keyof Partial<NdProfile>, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            await updateNdProfile(formData)
        setIsEditing(false)
            toast({
                title: "Success",
                description: "Profile updated successfully!",
            })
        } catch (err: any) {
            console.error("Failed to update ND profile:", err)
            setError(err.response?.data?.message || "Failed to save profile. Please try again.")
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to save profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                            Personal Information
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error && !loading) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                            Personal Information
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                        Personal Information
                    </span>
                </CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10"
                    disabled={saving}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            value={formData.firstName || ""}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            disabled={!isEditing || saving}
                            className="border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            value={formData.lastName || ""}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            disabled={!isEditing || saving}
                            className="border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-electric-blue" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={true} // Email is typically not editable
                            className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-electric-green" />
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={!isEditing || saving}
                            className="border-electric-green/30 focus:border-electric-green focus:ring-electric-green/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-electric-orange" />
                            Address
                        </Label>
                        <Input
                            id="address"
                            value={formData.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing || saving}
                            className="border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium">
                            Bio
                        </Label>
                        <Textarea
                            id="bio"
                            value={formData.bio || ""}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            disabled={!isEditing || saving}
                            rows={3}
                            className="border-electric-pink/30 focus:border-electric-pink focus:ring-electric-pink/20 resize-none"
                        />
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-electric-purple to-electric-blue hover:opacity-90 text-white"
                        >
                            {saving ? "Saving..." : (
                                <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
