'use client'

import { useState, type FormEvent } from 'react'
import { ArrowDownWideNarrow, CheckCircle2, Clock, MapPin, RotateCcw, Search, Send, Trash2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { IssueStore, NewIssue } from '@/hooks/use-issues'
import { ISSUE_CATEGORIES, sortByUrgency, type IssueCategory, type IssuePriority } from '@/lib/cc/data'
import { cn } from '@/lib/utils'
import { CATEGORY_META, CategoryIcon, PriorityTag, StatusPill, TimeAgo, UpvoteButton, UrgentBadge } from './issue-meta'

const PRIORITIES: IssuePriority[] = ['low', 'medium', 'high']
type StatusFilter = 'all' | 'active' | 'resolved'
type SortMode = 'urgent' | 'newest'

const LOCATION_SUGGESTIONS = [
  'Jalukbari',
  'Gauhati University Campus',
  'Maligaon',
  'Panbazar',
  'Dispur',
  'GS Road, Ganeshguri',
  'GMCH, Bhangagarh',
  'Nemcare Hospital, Bhangagarh',
  'Anil Nagar',
  'Zoo Road',
  'Beltola',
  'Chandmari',
  'Six Mile',
  'Paltan Bazaar',
  'Noonmati',
  'Khanapara',
]

export function ReportView({ store }: { store: IssueStore }) {
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Report an issue</h1>
        <p className="text-sm text-muted-foreground">
          Let neighbours and responders across Guwahati know about a local problem. Reports appear instantly in the
          live feed.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <IssueForm
          onSubmit={(input) => {
            const issue = store.addIssue(input)
            setLastAddedId(issue.id)
          }}
        />
        <IssueFeed store={store} highlightId={lastAddedId} />
      </div>
    </div>
  )
}

function IssueForm({ onSubmit }: { onSubmit: (input: NewIssue) => void }) {
  const [category, setCategory] = useState<IssueCategory>('Flood/Waterlogging')
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') ?? '').trim()
    const location = String(data.get('location') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    if (!title || !location || !description) return

    onSubmit({
      title: title.slice(0, 120),
      location: location.slice(0, 120),
      description: description.slice(0, 1000),
      category,
      priority,
    })
    form.reset()
    setPriority('medium')
    setSubmittedTitle(title)
  }

  return (
    <Card className="lg:sticky lg:top-24 lg:col-span-2">
      <CardHeader>
        <CardTitle>New report</CardTitle>
        <CardDescription>All fields are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} onChange={() => setSubmittedTitle(null)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required maxLength={120} placeholder="e.g. Waterlogging near Zoo Road tiniali" />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Category</legend>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_CATEGORIES.map((c) => {
                const Icon = CATEGORY_META[c].icon
                const selected = category === c
                return (
                  <label
                    key={c}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                      selected
                        ? 'border-primary bg-primary/5 font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c}
                      checked={selected}
                      onChange={() => setCategory(c)}
                      className="sr-only appearance-none"
                    />
                    <Icon className={cn('size-4 shrink-0', selected && 'text-primary')} aria-hidden="true" />
                    <span className="truncate">{c}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="location"
                name="location"
                required
                maxLength={120}
                list="guwahati-locations"
                placeholder="Area, landmark, or road in Guwahati"
                className="pl-8"
              />
              <datalist id="guwahati-locations">
                {LOCATION_SUGGESTIONS.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Priority</legend>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {PRIORITIES.map((p) => (
                <label
                  key={p}
                  className={cn(
                    'cursor-pointer rounded-md py-1.5 text-center text-sm capitalize text-muted-foreground transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                    priority === p && 'bg-card font-medium text-foreground shadow-sm',
                  )}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                    className="sr-only appearance-none"
                  />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              maxLength={1000}
              rows={4}
              placeholder="What's happening? Include anything responders should know."
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Send data-icon="inline-start" />
            Submit report
          </Button>

          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm">
            {submittedTitle && (
              <span className="inline-flex items-center gap-1.5 text-success">
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                {`"${submittedTitle}" added to the live feed.`}
              </span>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

function IssueFeed({ store, highlightId }: { store: IssueStore; highlightId: string | null }) {
  const { issues, toggleStatus, toggleUpvote, removeIssue, resetIssues } = store
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState<IssueCategory | 'All'>('All')
  const [sort, setSort] = useState<SortMode>('urgent')
  const [query, setQuery] = useState('')

  const counts = {
    all: issues.length,
    active: issues.filter((i) => i.status === 'active').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
  }

  const q = query.trim().toLowerCase()
  const filtered = issues
    .filter((i) => status === 'all' || i.status === status)
    .filter((i) => category === 'All' || i.category === category)
    .filter(
      (i) =>
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
    )
  const visible = sort === 'urgent' ? sortByUrgency(filtered) : [...filtered].sort((a, b) => b.createdAt - a.createdAt)
  const hasFilters = status !== 'all' || category !== 'All' || q !== ''

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              Live issue feed
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
            </CardTitle>
            <CardDescription>Upvote to boost urgent problems to the top</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={resetIssues}>
            <RotateCcw data-icon="inline-start" />
            Reset demo
          </Button>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, area, or description"
                aria-label="Search issues"
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <ArrowDownWideNarrow className="size-4 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="feed-sort" className="sr-only">
                Sort issues
              </label>
              <select
                id="feed-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="urgent">Most urgent</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
          </div>

          <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {(['All', ...ISSUE_CATEGORIES] as const).map((c) => {
              const Icon = c === 'All' ? null : CATEGORY_META[c].icon
              const count = c === 'All' ? issues.length : issues.filter((i) => i.category === c).length
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                    category === c
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground',
                  )}
                >
                  {Icon && <Icon className="size-3.5" aria-hidden="true" />}
                  {c}
                  <span className="opacity-70">{count}</span>
                </button>
              )
            })}
          </div>

          <div role="tablist" aria-label="Filter by status" className="flex w-fit gap-1 rounded-lg bg-muted p-1">
            {(['all', 'active', 'resolved'] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={status === f}
                onClick={() => setStatus(f)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm capitalize text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  status === f && 'bg-card font-medium text-foreground shadow-sm',
                )}
              >
                {f}
                <span className="font-mono text-xs text-muted-foreground">{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="sr-only" aria-live="polite">
          {`Showing ${visible.length} of ${issues.length} issues`}
        </p>
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">No issues match</p>
              <p className="text-sm text-muted-foreground">Try a different filter or search term.</p>
            </div>
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus('all')
                  setCategory('All')
                  setQuery('')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((issue) => (
              <li
                key={issue.id}
                className={cn(
                  'flex gap-3 rounded-xl border p-4 transition-colors',
                  issue.status === 'resolved' && 'bg-muted/40',
                  issue.id === highlightId && 'animate-in fade-in slide-in-from-top-2 border-primary/50 duration-500',
                )}
              >
                <UpvoteButton issue={issue} onToggle={toggleUpvote} />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <CategoryIcon category={issue.category} className="hidden sm:flex" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={cn(
                            'text-sm font-medium text-pretty',
                            issue.status === 'resolved' &&
                              'text-muted-foreground line-through decoration-muted-foreground/40',
                          )}
                        >
                          {issue.title}
                        </h3>
                        <UrgentBadge issue={issue} />
                      </div>
                      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{issue.category}</span>
                        <span aria-hidden="true">·</span>
                        <MapPin className="size-3" aria-hidden="true" />
                        <span>{issue.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" aria-hidden="true" />
                        <span className="sr-only">Reported</span>
                        <TimeAgo timestamp={issue.createdAt} showClock />
                        {issue.status === 'resolved' && issue.resolvedAt && (
                          <span className="text-success">
                            {' · Resolved '}
                            <TimeAgo timestamp={issue.resolvedAt} />
                          </span>
                        )}
                      </p>
                    </div>
                    <StatusPill status={issue.status} />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{issue.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <PriorityTag priority={issue.priority} />
                    <div className="flex items-center gap-1">
                      <Button
                        variant={issue.status === 'active' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleStatus(issue.id)}
                      >
                        {issue.status === 'active' ? (
                          <>
                            <CheckCircle2 data-icon="inline-start" />
                            Mark as Resolved
                          </>
                        ) : (
                          <>
                            <Undo2 data-icon="inline-start" />
                            Reopen
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeIssue(issue.id)}
                        aria-label={`Delete ${issue.title}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
