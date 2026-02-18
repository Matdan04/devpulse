import { cookies } from "next/headers"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await db.teamMember.findFirst({
    where: { userId: session.user.id },
    include: { team: true },
  })

  // Persist sidebar collapsed/expanded state via cookie
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        user={{
          name: session.user.name ?? "Unknown",
          email: session.user.email ?? "",
          image: session.user.image ?? null,
        }}
        team={membership?.team ?? null}
        role={membership?.role ?? "member"}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
