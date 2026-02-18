import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { InviteButton } from "@/components/dashboard/invite-button"
import { Users, Activity, AlertTriangle } from "lucide-react"

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
          },
        },
      },
    },
  })

  if (!membership) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[var(--text-secondary)]">You are not part of any team yet.</p>
      </div>
    )
  }

  const { team } = membership
  const isOwnerOrAdmin = ["owner", "admin"].includes(membership.role)
  const spotsLeft = 10 - team.members.length

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{team.name}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Team overview · {team.members.length}/10 members
          </p>
        </div>
        {isOwnerOrAdmin && spotsLeft > 0 && <InviteButton />}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Users className="size-5 text-[var(--dp-accent)]" />}
          label="Total members"
          value={`${team.members.length} / 10`}
        />
        <StatCard
          icon={<Activity className="size-5 text-[var(--green)]" />}
          label="Integrations"
          value="0 connected"
        />
        <StatCard
          icon={<AlertTriangle className="size-5 text-[var(--yellow)]" />}
          label="Active alerts"
          value="None yet"
        />
      </div>

      {/* Members table */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Team members
        </h2>
        <div className="rounded-lg border border-[var(--dp-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">Member</th>
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">Role</th>
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-[var(--text-muted)] font-medium">
                  Risk score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dp-border)]">
              {team.members.map((m) => (
                <tr key={m.id} className="bg-[var(--bg-card)] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.user.image}
                          alt={m.user.name ?? ""}
                          className="size-7 rounded-full"
                        />
                      ) : (
                        <div className="size-7 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                          {(m.user.name ?? "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {m.user.name ?? "Unnamed"}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{m.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.role === "owner"
                          ? "bg-[var(--accent-glow)] text-[var(--dp-accent)]"
                          : m.role === "admin"
                            ? "bg-[var(--green-glow)] text-[var(--green)]"
                            : "bg-white/5 text-[var(--text-secondary)]"
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {new Date(m.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] text-xs italic">
                    No data yet
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {spotsLeft > 0 && isOwnerOrAdmin && (
          <p className="text-xs text-[var(--text-muted)] mt-3">
            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining · invite members to fill them.
          </p>
        )}
        {spotsLeft === 0 && (
          <p className="text-xs text-[var(--yellow)] mt-3">
            Your team is at the 10-member limit.
          </p>
        )}
      </section>

      {/* Empty state hint */}
      <section className="mt-10 rounded-lg border border-dashed border-[var(--dp-border)] p-8 text-center">
        <Activity className="size-8 text-[var(--text-muted)] mx-auto mb-3" />
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">No health data yet</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
          Connect a GitHub integration to start collecting developer metrics. Health scores will
          appear here after 5–7 days of data.
        </p>
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--dp-border)] rounded-lg p-4 flex items-center gap-4">
      <div className="p-2 rounded-md bg-[var(--bg-secondary)]">{icon}</div>
      <div>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className="font-semibold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  )
}
