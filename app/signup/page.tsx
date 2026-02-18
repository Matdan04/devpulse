import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SignupForm } from "@/components/signup-form"

interface SignupPageProps {
  searchParams: Promise<{ invite?: string }>
}

async function getInviteInfo(token: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/invitations?token=${token}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.valid ? data : null
  } catch {
    return null
  }
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { invite } = await searchParams
  const inviteInfo = invite ? await getInviteInfo(invite) : null

  return (
    <div className="grid min-h-svh h-svh lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            DevPulse
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            {invite && !inviteInfo ? (
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold text-destructive">Invalid invitation</h1>
                <p className="text-muted-foreground text-sm">
                  This invitation link is invalid, expired, or has already been used.
                </p>
                <Link href="/login" className="underline underline-offset-4 text-sm">
                  Go to login
                </Link>
              </div>
            ) : (
              <SignupForm
                inviteToken={invite}
                inviteTeamName={inviteInfo?.teamName}
                inviteEmail={inviteInfo?.email}
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden">
        <Image
          src="/Devpulse.png"
          alt="Signup Background"
          fill
          className="object-cover object-bottom dark:brightness-[0.9] dark:grayscale"
        />
      </div>
    </div>
  )
}
