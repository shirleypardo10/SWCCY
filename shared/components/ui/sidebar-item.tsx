"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarItemProps {
  href: string
  label: string
  description?: string
  icon: LucideIcon
  isActive: boolean
  onNavigate?: () => void
}

export function SidebarItem({
  href,
  label,
  description,
  icon: Icon,
  isActive,
  onNavigate,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{label}</span>
        {description ? (
          <span
            className={cn(
              "mt-0.5 block truncate text-xs",
              isActive ? "text-primary-foreground/85" : "text-muted-foreground"
            )}
          >
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
