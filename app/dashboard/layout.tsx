import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Load team membership for sidebar
  const membership = await db.teamMember.findFirst({
    where: { userId: session.user.id },
    include: { team: true },
  })

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <DashboardSidebar
        user={{
          name: session.user.name ?? "Unknown",
          email: session.user.email ?? "",
          image: session.user.image ?? null,
        }}
        team={membership?.team ?? null}
        role={membership?.role ?? "member"}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
