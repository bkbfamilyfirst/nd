"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, LayoutDashboard, Network, Settings, User } from "lucide-react"

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    shortName: "Home",
    color: "from-electric-purple to-electric-blue",
  },
  {
    name: "Manage SS",
    icon: Network,
    href: "/manage-ss",
    shortName: "ND",
    color: "from-electric-cyan to-electric-purple",
  },
  // {
  //   name: "Reports",
  //   icon: BarChart3,
  //   href: "/reports",
  //   shortName: "Reports",
  //   color: "from-electric-orange to-electric-pink",
  // },
  {
    name: "Profile",
    icon: User,
    href: "/profile",
    shortName: "Profile",
    color: "from-electric-green to-electric-blue",
  },
  // {
  //   name: "Settings",
  //   icon: Settings,
  //   href: "/settings",
  //   shortName: "Settings",
  //   color: "from-electric-pink to-electric-purple",
  // },
]

export default function BottomNav() {
  const [activeItem, setActiveItem] = useState("Dashboard")

  return (
    <div className="bottom-nav-responsive safe-area-bottom">
      <motion.div
        className="flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl px-1 py-2 sm:px-3 sm:py-2.5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {navItems.map((item) => {
          const isActive = activeItem === item.name
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`relative flex flex-1 flex-col items-center justify-center rounded-xl p-2 touch-target smooth-transition sm:flex-initial sm:px-3 sm:py-2 ${isActive
                  ? "text-white scale-105 sm:scale-110"
                  : "text-gray-600 hover:text-electric-purple dark:text-gray-300 hover:scale-105"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} z-0 shadow-lg`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 mb-1">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </span>
              <span
                className={`relative z-10 text-[9px] sm:text-[10px] md:text-xs font-medium leading-tight ${isActive ? "opacity-100" : "opacity-80"
                  }`}
              >
                <span className="block sm:hidden">{item.shortName}</span>
                <span className="hidden sm:block">{item.name}</span>
              </span>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
