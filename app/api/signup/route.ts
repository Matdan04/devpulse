import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  teamName: z.string().min(2).max(50).optional(),
  inviteToken: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { name, email, password, teamName, inviteToken } = parsed.data

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    if (inviteToken) {
      // ── Joining via invite ─────────────────────────────────────────────────
      const invitation = await db.invitation.findUnique({
        where: { token: inviteToken },
        include: {
          team: { include: { members: true } },
        },
      })

      if (!invitation) {
        return NextResponse.json({ error: "Invalid invitation link" }, { status: 400 })
      }
      if (invitation.usedAt) {
        return NextResponse.json({ error: "This invitation has already been used" }, { status: 400 })
      }
      if (new Date() > invitation.expiresAt) {
        return NextResponse.json({ error: "This invitation link has expired" }, { status: 400 })
      }
      if (invitation.team.members.length >= 10) {
        return NextResponse.json(
          { error: "This team has reached the maximum of 10 members" },
          { status: 400 }
        )
      }

      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          memberships: {
            create: {
              teamId: invitation.teamId,
              role: invitation.role,
            },
          },
        },
      })

      // Mark invitation as used
      await db.invitation.update({
        where: { token: inviteToken },
        data: { usedAt: new Date() },
      })

      return NextResponse.json({ success: true, userId: user.id })
    } else {
      // ── Signing up as team lead ────────────────────────────────────────────
      if (!teamName) {
        return NextResponse.json(
          { error: "Team name is required when creating a new team" },
          { status: 400 }
        )
      }

      const slug = teamName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      // Ensure slug uniqueness
      const existingTeam = await db.team.findUnique({ where: { slug } })
      const finalSlug = existingTeam ? `${slug}-${Date.now()}` : slug

      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          memberships: {
            create: {
              role: "owner",
              team: {
                create: {
                  name: teamName,
                  slug: finalSlug,
                },
              },
            },
          },
        },
      })

      return NextResponse.json({ success: true, userId: user.id })
    }
  } catch (err) {
    console.error("[SIGNUP]", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
