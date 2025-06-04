"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <Button variant="ghost" size="sm" disabled className="w-9 h-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "w-9 h-9",
                  currentPage === page
                    ? "bg-gradient-to-r from-electric-purple to-electric-blue text-white"
                    : "text-electric-purple hover:bg-electric-purple/10",
                )}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10 disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
