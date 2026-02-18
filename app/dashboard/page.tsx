import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { InviteButton } from "@/components/dashboard/invite-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Users, Activity, AlertTriangle, GitBranch } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await db.teamMember.findFirst({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          members: {
            include: { user: true },
            orderBy: { joinedAt: "asc" },
          },
        },
      },
    },
  })

  if (!membership) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-(--text-secondary)">You are not part of any team yet.</p>
      </div>
    )
  }

  const { team } = membership
  const isOwnerOrAdmin = ["owner", "admin"].includes(membership.role)
  const spotsLeft = 10 - team.members.length

  return (
    <>
      {/* Site Header */}
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-(--dp-border) bg-background px-4">
        <SidebarTrigger className="-ml-1 text-(--text-muted) hover:text-foreground hover:bg-white/5" />
        <div className="flex-1" />
        {isOwnerOrAdmin && spotsLeft > 0 && <InviteButton />}
      </header>

      {/* Page Content */}
      <div className="flex flex-col gap-6 p-6">

        {/* Page intro */}
        <div>
          <h1 className="text-xl font-bold text-foreground">{team.name}</h1>
          <p className="text-sm text-(--text-secondary) mt-0.5">
            {team.members.length} of 10 members ·{" "}
            {spotsLeft > 0
              ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`
              : "Team is at capacity"}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Users className="size-4 text-(--dp-accent)" />}
            iconBg="bg-(--accent-glow)"
            label="Team members"
            value={`${team.members.length} / 10`}
          />
          <StatCard
            icon={<GitBranch className="size-4 text-(--green)" />}
            iconBg="bg-(--green-glow)"
            label="Integrations"
            value="0 connected"
          />
          <StatCard
            icon={<AlertTriangle className="size-4 text-(--yellow)" />}
            iconBg="bg-(--yellow-glow)"
            label="Active alerts"
            value="None yet"
          />
        </div>

        {/* Members Table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-(--text-muted) uppercase tracking-wider">
              Team members
            </h2>
            {spotsLeft === 0 && (
              <span className="text-xs text-(--yellow) font-medium">
                At capacity (10/10)
              </span>
            )}
          </div>

          <Card className="border-(--dp-border) bg-(--bg-card) rounded-xl overflow-hidden p-0 gap-0">
            <Table>
              <TableHeader>
                <TableRow className="border-(--dp-border) hover:bg-transparent">
                  <TableHead className="h-10 px-5 bg-(--bg-secondary) text-(--text-muted) font-medium text-xs uppercase tracking-wide">
                    Member
                  </TableHead>
                  <TableHead className="h-10 px-5 bg-(--bg-secondary) text-(--text-muted) font-medium text-xs uppercase tracking-wide">
                    Role
                  </TableHead>
                  <TableHead className="h-10 px-5 bg-(--bg-secondary) text-(--text-muted) font-medium text-xs uppercase tracking-wide">
                    Joined
                  </TableHead>
                  <TableHead className="h-10 px-5 bg-(--bg-secondary) text-(--text-muted) font-medium text-xs uppercase tracking-wide">
                    Risk score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members.map((m) => (
                  <TableRow
                    key={m.id}
                    className="border-(--dp-border) hover:bg-white/2 transition-colors"
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {m.user.image && (
                            <AvatarImage src={m.user.image} alt={m.user.name ?? ""} />
                          )}
                          <AvatarFallback className="bg-(--bg-secondary) text-foreground text-xs font-bold">
                            {(m.user.name ?? "?").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground text-sm leading-tight">
                            {m.user.name ?? "Unnamed"}
                          </p>
                          <p className="text-xs text-(--text-muted) mt-0.5">
                            {m.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <RoleBadge role={m.role} />
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-sm text-(--text-secondary)">
                      {new Date(m.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-xs text-(--text-muted) italic">
                        No data yet
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {spotsLeft > 0 && isOwnerOrAdmin && (
            <p className="text-xs text-(--text-muted)">
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining · invite members to fill them.
            </p>
          )}
        </div>

        {/* Empty state — health data */}
        <Card className="border-dashed border-(--dp-border) bg-transparent rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-14 gap-3 text-center">
            <div className="size-12 rounded-xl bg-(--bg-secondary) border border-(--dp-border) flex items-center justify-center">
              <Activity className="size-5 text-(--text-muted)" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">No health data yet</h3>
              <p className="text-sm text-(--text-secondary) max-w-xs mt-1 mx-auto">
                Connect a GitHub integration to start collecting developer metrics. Health scores
                will appear here after 5–7 days of data.
              </p>
            </div>
            <button className="text-xs font-medium text-(--dp-accent) hover:underline underline-offset-4 mt-1">
              Set up integration →
            </button>
          </CardContent>
        </Card>

      </div>
    </>
  )
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
}) {
  return (
    <Card className="border-(--dp-border) bg-(--bg-card) rounded-xl p-0">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-(--text-muted)">{label}</p>
          <p className="text-base font-semibold text-foreground mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function RoleBadge({ role }: { role: string }) {
  if (role === "owner") {
    return (
      <Badge className="bg-(--accent-glow) text-(--dp-accent) border-transparent hover:bg-(--accent-glow)">
        owner
      </Badge>
    )
  }
  if (role === "admin") {
    return (
      <Badge className="bg-(--green-glow) text-(--green) border-transparent hover:bg-(--green-glow)">
        admin
      </Badge>
    )
  }
  return (
    <Badge className="bg-white/5 text-(--text-secondary) border-transparent hover:bg-white/5">
      member
    </Badge>
  )
}
