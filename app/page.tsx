import { WelcomeCard } from "@/components/welcome-card"
import { TotalReceivedKeysCard } from "@/components/dashboard/total-received-keys-card"
import { TransferredBalanceKeysCard } from "@/components/dashboard/transferred-balance-keys-card"
import { ActiveDistributorsCard } from "@/components/dashboard/active-distributors-card"
import { TransferToSSCard } from "@/components/dashboard/transfer-to-ss-card"
import { SSAllocationCard } from "@/components/dashboard/ss-allocation-card"
import { KeyHistoryCard } from "@/components/dashboard/key-history-card"

export default function NationalDistributorDashboard() {
  return (
    <div className="responsive-container py-4 sm:py-8">
      <WelcomeCard />

      {/* First Row - Key Overview */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <TotalReceivedKeysCard />
        <TransferredBalanceKeysCard />
        <TransferToSSCard />
      </div>

      {/* Second Row - Distributor Management */}
      <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <ActiveDistributorsCard />
        <SSAllocationCard />
      </div>

      {/* Third Row - Key History */}
      <div className="mt-4 sm:mt-6">
        <KeyHistoryCard />
      </div>
    </div>
  )
}
