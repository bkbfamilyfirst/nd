import { AdminProfileHeader } from "@/components/profile/admin-profile-header"
import { PersonalInformation } from "@/components/profile/personal-information"
import { AdminCard } from "@/components/profile/admin-card"
import { BasicSettings } from "@/components/profile/basic-settings"

export default function AdminProfilePage() {
    return (
        <div className="responsive-container py-4 sm:py-8">
            <AdminProfileHeader />

            {/* Profile Content */}
            <div className="mt-6 sm:mt-8 grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Left Column - Personal Info & Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <PersonalInformation />
                    <BasicSettings />
                </div>

                {/* Right Column - Admin Card */}
                <div className="lg:col-span-1">
                    <AdminCard />
                </div>
            </div>
        </div>
    )
}
