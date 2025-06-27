"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/header"
import BottomNav from "@/components/bottom-nav"
import { isAuthenticated } from "@/lib/auth"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const noBottomNavPaths = ["/login", "/forgot-password"]
  const showBottomNav = !noBottomNavPaths.includes(pathname)
  const showHeader = !noBottomNavPaths.includes(pathname)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
      
      if (!authenticated && !noBottomNavPaths.includes(pathname)) {
        router.push("/login")
        return
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {noBottomNavPaths.includes(pathname) ? (
        <>{children}</>
      ) : isAuth ? (
        <div className="flex min-h-screen flex-col">
          {showHeader && <Header />}
          <main className="flex-1 pb-20 sm:pb-24 md:pb-28">{children}</main>
          {showBottomNav && <BottomNav />}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      )}
    </>
  )
} 