'use client'

import { useRef, useState } from 'react'
import { Check, Clock, Copy, MapPin, Phone, Search } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CONTACT_CATEGORIES, EMERGENCY_CONTACTS, telHref, type ContactCategory } from '@/lib/cc/data'
import { cn } from '@/lib/utils'

const CATEGORY_STYLES: Record<ContactCategory, string> = {
  Emergency: 'bg-destructive/10 text-destructive',
  Medical: 'bg-primary/10 text-primary',
  Disaster: 'bg-accent text-accent-foreground',
  Utilities: 'bg-warning/15 text-warning',
  Support: 'bg-secondary text-secondary-foreground',
}

export function DirectoryView() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ContactCategory | 'All'>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const q = query.trim().toLowerCase()
  const visible = EMERGENCY_CONTACTS.filter((c) => category === 'All' || c.category === category).filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q) ||
      c.number.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '\u0000') ||
      c.category.toLowerCase().includes(q),
  )

  async function copy(id: string, number: string) {
    try {
      await navigator.clipboard.writeText(number)
    } catch {
      return
    }
    setCopiedId(id)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopiedId(null), 1800)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Emergency directory</h1>
        <p className="text-sm text-muted-foreground">
          Essential Guwahati & Assam helplines, hospitals, and disaster resources. Tap to call or copy a number.
        </p>
      </div>

      <div
        role="note"
        className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
      >
        <Phone className="size-5 shrink-0 text-destructive" aria-hidden="true" />
        <p className="min-w-48 flex-1 text-pretty">
          <span className="font-semibold">Life-threatening emergency?</span>{' '}
          <span className="text-muted-foreground">Call 112 for police, fire, or ambulance. 108 for a free ambulance.</span>
        </p>
        <div className="flex gap-2">
          <a href="tel:112" className={cn(buttonVariants({ size: 'lg' }), 'bg-destructive px-4 text-white hover:bg-destructive/90')}>
            Call 112
          </a>
          <a href="tel:108" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'px-4')}>
            Call 108
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-sm sm:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, service, or number"
            aria-label="Search directory"
            className="h-9 pl-8"
          />
        </div>
        <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-0">
          {(['All', ...CONTACT_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                category === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'resource' : 'resources'} found
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No resources found</p>
          <p className="text-sm text-muted-foreground">Try another search term or category.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((contact) => (
            <li key={contact.id} className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold text-pretty">{contact.name}</h2>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                    CATEGORY_STYLES[contact.category],
                  )}
                >
                  {contact.category}
                </span>
              </div>
              <p className="font-mono text-2xl font-semibold tracking-tight">{contact.number}</p>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{contact.description}</p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {contact.area}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {contact.hours}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={telHref(contact.number)}
                  className={buttonVariants({ size: 'lg' })}
                  aria-label={`Call ${contact.name} at ${contact.number}`}
                >
                  <Phone data-icon="inline-start" />
                  Call
                </a>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => copy(contact.id, contact.number)}
                  aria-label={`Copy number for ${contact.name}`}
                >
                  {copiedId === contact.id ? (
                    <>
                      <Check data-icon="inline-start" className="text-success" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy data-icon="inline-start" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
