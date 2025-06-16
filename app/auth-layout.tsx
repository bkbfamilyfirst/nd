"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/header"
import BottomNav from "@/components/bottom-nav"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const noBottomNavPaths = ["/login", "/forgot-password"]
  const showBottomNav = !noBottomNavPaths.includes(pathname)
  const showHeader = !noBottomNavPaths.includes(pathname)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      if (!noBottomNavPaths.includes(pathname)) {
        router.push("/login")
      }
    }
  }, [pathname, router])

  return (
    <>
      {noBottomNavPaths.includes(pathname) ? (
        <>{children}</>
      ) : isAuthenticated ? (
        <div className="flex min-h-screen flex-col">
          {showHeader && <Header />}
          <main className="flex-1 pb-20 sm:pb-24 md:pb-28">{children}</main>
          {showBottomNav && <BottomNav />}
        </div>
      ) : null}
    </>
  )
} 