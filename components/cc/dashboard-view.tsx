'use client'

import { AlertTriangle, ArrowRight, Bot, CheckCircle2, FilePlus2, MapPin, Phone, PhoneCall } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { IssueStore } from '@/hooks/use-issues'
import { EMERGENCY_CONTACTS, ISSUE_CATEGORIES, isUrgent, sortByUrgency, telHref } from '@/lib/cc/data'
import { cn } from '@/lib/utils'
import type { TabId } from './app-shell'
import { CATEGORY_META, CategoryIcon, TimeAgo, UpvoteButton, UrgentBadge } from './issue-meta'

const QUICK_CONTACTS = ['c1', 'c4', 'c2', 'c9']
  .map((id) => EMERGENCY_CONTACTS.find((c) => c.id === id))
  .filter((c) => c !== undefined)

export function DashboardView({
  store,
  onNavigate,
}: {
  store: IssueStore
  onNavigate: (tab: TabId) => void
}) {
  const { issues, toggleStatus, toggleUpvote } = store
  const active = issues.filter((i) => i.status === 'active')
  const resolved = issues.length - active.length
  const urgentCount = active.filter(isUrgent).length
  const resolutionRate = issues.length ? Math.round((resolved / issues.length) * 100) : 0
  const mostUrgent = sortByUrgency(active).slice(0, 5)

  const byCategory = ISSUE_CATEGORIES.map((category) => ({
    category,
    count: active.filter((i) => i.category === category).length,
  })).sort((a, b) => b.count - a.count)
  const maxCount = Math.max(1, ...byCategory.map((c) => c.count))

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="welcome-heading"
        className="relative overflow-hidden rounded-2xl bg-primary px-5 py-6 text-primary-foreground sm:px-8 sm:py-8"
      >
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-2">
            <p className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/75">
              <MapPin className="size-4" aria-hidden="true" />
              Guwahati, Assam · Live status
            </p>
            <h1 id="welcome-heading" className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {urgentCount > 0
                ? `${urgentCount} urgent ${urgentCount === 1 ? 'issue needs' : 'issues need'} attention`
                : 'All clear — no urgent issues right now'}
            </h1>
            <p className="text-sm leading-relaxed text-primary-foreground/80 text-pretty">
              Track waterlogging, medical needs, power, and road problems across the city. Upvote what matters most.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="lg"
              onClick={() => onNavigate('report')}
              className="bg-primary-foreground px-4 text-primary hover:bg-primary-foreground/90"
            >
              <FilePlus2 data-icon="inline-start" />
              Report an issue
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('assistant')}
              className="border-primary-foreground/30 bg-transparent px-4 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary-foreground/30 dark:bg-transparent"
            >
              <Bot data-icon="inline-start" />
              Ask the helper
            </Button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full border-[40px] border-primary-foreground/5"
        />
      </section>

      <section aria-label="Key metrics" aria-live="polite" className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total active issues"
          value={active.length}
          detail={`${urgentCount} marked urgent`}
          icon={AlertTriangle}
          tone="primary"
          onClick={() => onNavigate('report')}
        />
        <MetricCard
          label="Resolved issues"
          value={resolved}
          detail={`${resolutionRate}% resolution rate`}
          icon={CheckCircle2}
          tone="success"
          onClick={() => onNavigate('report')}
        />
        <MetricCard
          label="Emergency contacts"
          value={EMERGENCY_CONTACTS.length}
          detail="Guwahati & Assam helplines"
          icon={PhoneCall}
          tone="warning"
          onClick={() => onNavigate('directory')}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Most urgent right now</CardTitle>
              <CardDescription>Ranked by priority and community upvotes</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('report')}>
              View all
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent>
            {mostUrgent.length === 0 ? (
              <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                No active issues. Great work, Guwahati!
              </p>
            ) : (
              <ul className="flex flex-col divide-y">
                {mostUrgent.map((issue) => (
                  <li key={issue.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <CategoryIcon category={issue.category} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-medium">{issue.title}</p>
                        <UrgentBadge issue={issue} />
                      </div>
                      <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{issue.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">
                          <TimeAgo timestamp={issue.createdAt} />
                        </span>
                      </p>
                    </div>
                    <UpvoteButton issue={issue} onToggle={toggleUpvote} compact />
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => toggleStatus(issue.id)}
                      aria-label={`Mark as resolved: ${issue.title}`}
                      title="Mark as resolved"
                    >
                      <CheckCircle2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active by category</CardTitle>
              <CardDescription>Where help is needed most</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {byCategory.map(({ category, count }) => {
                  const Icon = CATEGORY_META[category].icon
                  return (
                    <li key={category} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                          {category}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick dial</CardTitle>
              <CardDescription>Tap to call instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-2">
                {QUICK_CONTACTS.map((contact) => (
                  <li key={contact.id}>
                    <a
                      href={telHref(contact.number)}
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'h-auto w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left whitespace-normal',
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-mono text-base font-semibold">
                        <Phone className="size-3.5 text-primary" aria-hidden="true" />
                        {contact.number}
                      </span>
                      <span className="line-clamp-1 text-xs font-normal text-muted-foreground">{contact.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const TONES = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string
  value: number
  detail: string
  icon: typeof AlertTriangle
  tone: keyof typeof TONES
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 text-left text-card-foreground shadow-xs transition-all outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn('flex size-9 items-center justify-center rounded-lg', TONES[tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span key={value} className="animate-in fade-in zoom-in-95 text-4xl font-semibold tracking-tight tabular-nums duration-300">
          {value}
        </span>
        <ArrowRight
          className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <span className="text-xs text-muted-foreground">{detail}</span>
    </button>
  )
}
