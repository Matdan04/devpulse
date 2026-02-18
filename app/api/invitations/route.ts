import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  email: z.string().email().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }

  // Verify the user is an owner/admin of their team
  const membership = await db.teamMember.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ["owner", "admin"] },
    },
    include: {
      team: {
        include: { members: true },
      },
    },
  })

  if (!membership) {
    return NextResponse.json(
      { error: "Only team owners and admins can send invitations" },
      { status: 403 }
    )
  }

  if (membership.team.members.length >= 10) {
    return NextResponse.json(
      { error: "Your team has reached the maximum of 10 members" },
      { status: 400 }
    )
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7-day expiry

  const invitation = await db.invitation.create({
    data: {
      teamId: membership.teamId,
      email: parsed.data.email,
      invitedById: session.user.id,
      expiresAt,
    },
    include: { team: true },
  })

  const inviteUrl = `${process.env.NEXTAUTH_URL}/signup?invite=${invitation.token}`

  // Send email if an address was provided
  if (parsed.data.email) {
    try {
      await resend.emails.send({
        from: "DevPulse <noreply@devpulse.app>",
        to: parsed.data.email,
        subject: `You're invited to join ${invitation.team.name} on DevPulse`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #22c55e;">You've been invited to DevPulse</h2>
            <p>
              <strong>${session.user.name ?? "Your team lead"}</strong> has invited you to join
              <strong>${invitation.team.name}</strong> on DevPulse — the developer health &amp; burnout radar.
            </p>
            <p>This invitation expires in 7 days.</p>
            <a
              href="${inviteUrl}"
              style="
                display: inline-block;
                background: #22c55e;
                color: #000;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin: 16px 0;
              "
            >
              Accept Invitation
            </a>
            <p style="color: #64748b; font-size: 13px;">
              Or copy this link: ${inviteUrl}
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error("[INVITATION_EMAIL]", emailErr)
      // Don't fail the request — return the link even if email fails
    }
  }

  return NextResponse.json({
    token: invitation.token,
    url: inviteUrl,
    expiresAt: invitation.expiresAt,
  })
}

// GET /api/invitations?token=xxx — validate a token before showing signup form
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 })
  }

  const invitation = await db.invitation.findUnique({
    where: { token },
    include: { team: true },
  })

  if (!invitation) {
    return NextResponse.json({ valid: false, error: "Invalid invitation link" })
  }
  if (invitation.usedAt) {
    return NextResponse.json({ valid: false, error: "This invitation has already been used" })
  }
  if (new Date() > invitation.expiresAt) {
    return NextResponse.json({ valid: false, error: "This invitation has expired" })
  }

  return NextResponse.json({
    valid: true,
    teamName: invitation.team.name,
    email: invitation.email,
  })
}
