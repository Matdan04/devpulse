"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { UserPlus, Copy, Check, X } from "lucide-react"

export function InviteButton() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || undefined }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? "Failed to create invitation")
      return
    }

    setInviteUrl(data.url)
  }

  async function copyLink() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setOpen(false)
    setEmail("")
    setError(null)
    setInviteUrl(null)
    setCopied(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <UserPlus className="size-4" />
        Invite member
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--dp-border)] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Invite a team member</h2>
              <button
                onClick={reset}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {!inviteUrl ? (
              <form onSubmit={handleInvite} className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="invite-email">Email address (optional)</FieldLabel>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@acme.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FieldDescription>
                    Leave blank to generate a shareable link without pre-filling an email.
                  </FieldDescription>
                </Field>

                {error && <FieldError>{error}</FieldError>}

                <div className="flex gap-3 mt-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Generating…" : email ? "Send invitation" : "Generate link"}
                  </Button>
                  <Button type="button" variant="outline" onClick={reset}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  {email
                    ? `An invitation email has been sent to ${email}. Share the link below as a backup.`
                    : "Share this link with your teammate. It expires in 7 days."}
                </p>

                <div className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--dp-border)]">
                  <p className="flex-1 text-xs text-[var(--text-secondary)] truncate font-mono">
                    {inviteUrl}
                  </p>
                  <Button size="icon-sm" variant="ghost" onClick={copyLink}>
                    {copied ? (
                      <Check className="size-3.5 text-[var(--green)]" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>

                <Button variant="outline" onClick={reset}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
