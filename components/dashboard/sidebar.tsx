"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Plug,
  Bell,
  FileText,
  Settings,
  LogOut,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Team {
  id: string
  name: string
  slug: string
}

interface SidebarProps {
  user: {
    name: string
    email: string
    image: string | null
  }
  team: Team | null
  role: string
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ user, team, role }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[var(--dp-border)] bg-[var(--bg-secondary)] sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--dp-border)]">
        <div className="flex size-7 items-center justify-center rounded-md bg-[var(--green)] text-black">
          <Activity className="size-4" />
        </div>
        <span className="font-bold text-[var(--text-primary)]">DevPulse</span>
      </div>

      {/* Team name */}
      {team && (
        <div className="px-5 py-3 border-b border-[var(--dp-border)]">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Team</p>
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{team.name}</p>
          <p className="text-xs text-[var(--text-muted)] capitalize">{role}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-[var(--green-glow)] text-[var(--green)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-[var(--dp-border)] space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="size-7 rounded-full" />
          ) : (
            <div className="size-7 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-[var(--text-secondary)] hover:text-[var(--red)]"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
