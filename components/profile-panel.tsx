'use client'

import { Button } from '@/components/ui/button'

interface ProfilePanelProps {
  name?: string | null
  email?: string | null
  onSignOut: () => Promise<void>
}

export function ProfilePanel({ name, email, onSignOut }: ProfilePanelProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Profile</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
          {(name || email || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{name || 'Expense tracker user'}</p>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <Button variant="outline" className="mt-5 w-full" onClick={onSignOut}>
        Sign Out
      </Button>
    </section>
  )
}
