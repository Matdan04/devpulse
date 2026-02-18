"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup } from "@/components/ui/field"
import { UserPlus, Copy, Check, Link2 } from "lucide-react"

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

  function handleOpenChange(value: boolean) {
    if (!value) {
      setEmail("")
      setError(null)
      setInviteUrl(null)
      setCopied(false)
    }
    setOpen(value)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <UserPlus className="size-4" />
        Invite member
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent >
          <DialogHeader >
            <DialogTitle>
              Invite a team member
            </DialogTitle>
            <DialogDescription>
              Add a teammate to your DevPulse workspace.
            </DialogDescription>
          </DialogHeader>

          {!inviteUrl ? (
            <form onSubmit={handleInvite}>
              <FieldGroup>
                <Field>
                  <Label htmlFor="invite-email">
                    Email address{" "}
                    <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@acme.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FieldDescription>
                    Leave blank to generate a shareable link.
                  </FieldDescription>
                  {error && <FieldError>{error}</FieldError>}
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-(--green) text-white hover:opacity-90"
                >
                  {loading ? "Generating…" : email ? "Send invitation" : "Generate link"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="flex flex-col gap-6 min-w-0 overflow-hidden">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {email ? (
                  <>
                    Invitation sent to{" "}
                    <span className="font-medium text-foreground">{email}</span>.{" "}
                    Share the link below as a backup.
                  </>
                ) : (
                  "Share this link with your teammate. It expires in 7 days."
                )}
              </p>

              <div className="flex items-center gap-3 rounded-lg border border-(--dp-border) bg-(--bg-secondary) px-4 py-3 min-w-0 overflow-hidden">
                <Link2 className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs select-all">
                  {inviteUrl}
                </span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="size-3.5 text-(--green)" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full h-10"
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
