'use client'

import { useSyncExternalStore } from 'react'
import {
  ChevronUp,
  Flame,
  HeartPulse,
  Mountain,
  Siren,
  TrafficCone,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { isUrgent, type Issue, type IssueCategory, type IssuePriority, type IssueStatus } from '@/lib/cc/data'
import { cn } from '@/lib/utils'

export const CATEGORY_META: Record<IssueCategory, { icon: LucideIcon; className: string }> = {
  'Flood/Waterlogging': { icon: Waves, className: 'bg-accent text-accent-foreground' },
  Medical: { icon: HeartPulse, className: 'bg-destructive/10 text-destructive' },
  'Road/Traffic': { icon: TrafficCone, className: 'bg-secondary text-secondary-foreground' },
  Power: { icon: Zap, className: 'bg-warning/15 text-warning' },
  Landslide: { icon: Mountain, className: 'bg-success/10 text-success' },
  Fire: { icon: Flame, className: 'bg-destructive/10 text-destructive' },
}

export function CategoryIcon({ category, className }: { category: IssueCategory; className?: string }) {
  const meta = CATEGORY_META[category]
  const Icon = meta.icon
  return (
    <span
      className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', meta.className, className)}
      aria-hidden="true"
    >
      <Icon className="size-4" />
    </span>
  )
}

export function StatusPill({ status }: { status: IssueStatus }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'active' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success',
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', status === 'active' ? 'animate-pulse bg-primary' : 'bg-success')}
        aria-hidden="true"
      />
      {status === 'active' ? 'Active' : 'Resolved'}
    </span>
  )
}

const PRIORITY_STYLES: Record<IssuePriority, string> = {
  high: 'border-destructive/30 text-destructive',
  medium: 'border-warning/40 text-warning',
  low: 'border-border text-muted-foreground',
}

export function PriorityTag({ priority }: { priority: IssuePriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        PRIORITY_STYLES[priority],
      )}
    >
      {priority} priority
    </span>
  )
}

export function UrgentBadge({ issue }: { issue: Issue }) {
  if (!isUrgent(issue)) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
      <Siren className="size-3" aria-hidden="true" />
      Urgent
    </span>
  )
}

export function UpvoteButton({
  issue,
  onToggle,
  compact = false,
}: {
  issue: Issue
  onToggle: (id: string) => void
  compact?: boolean
}) {
  const disabled = issue.status === 'resolved'
  return (
    <button
      type="button"
      onClick={() => onToggle(issue.id)}
      disabled={disabled}
      aria-pressed={issue.upvotedByMe}
      aria-label={`${issue.upvotedByMe ? 'Remove upvote from' : 'Upvote as urgent:'} ${issue.title}. ${issue.upvotes} upvotes`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg border font-medium tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        compact ? 'h-7 gap-1 px-2 text-xs' : 'h-14 w-12 flex-col gap-0 text-sm',
        issue.upvotedByMe
          ? 'border-primary bg-primary text-primary-foreground'
          : 'bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
      )}
    >
      <ChevronUp className={compact ? 'size-3.5' : 'size-4'} aria-hidden="true" />
      {issue.upvotes}
    </button>
  )
}

function subscribeClock(callback: () => void) {
  const id = window.setInterval(callback, 30_000)
  return () => window.clearInterval(id)
}

function getMinuteBucket() {
  return Math.floor(Date.now() / 30_000)
}

const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' })
const clockFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
})

function formatRelative(timestamp: number) {
  const diffMinutes = Math.round((timestamp - Date.now()) / 60_000)
  if (Math.abs(diffMinutes) < 1) return 'just now'
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, 'minute')
  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour')
  return rtf.format(Math.round(diffHours / 24), 'day')
}

export function TimeAgo({ timestamp, showClock = false }: { timestamp: number; showClock?: boolean }) {
  const bucket = useSyncExternalStore(subscribeClock, getMinuteBucket, () => 0)
  if (bucket === 0) return <span>{'\u2014'}</span>
  const absolute = clockFormat.format(timestamp)
  return (
    <time dateTime={new Date(timestamp).toISOString()} title={`${absolute} IST`}>
      {formatRelative(timestamp)}
      {showClock && <span className="text-muted-foreground/70">{` · ${absolute}`}</span>}
    </time>
  )
}
