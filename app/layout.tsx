import type React from "react"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthLayout from "./auth-layout"

// Import auth debug utilities in development
if (process.env.NODE_ENV === 'development') {
  import("@/lib/auth-debug");
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Family First National Distributor Panel",
  description: "Manage your State Supervisors and key distributions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthLayout>{children}</AuthLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
