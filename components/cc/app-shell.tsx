'use client'

import { useState } from 'react'
import { BookUser, Bot, FilePlus2, LayoutDashboard, Radio, type LucideIcon } from 'lucide-react'
import { useIssues } from '@/hooks/use-issues'
import { cn } from '@/lib/utils'
import { AssistantView } from './assistant-view'
import { DashboardView } from './dashboard-view'
import { DirectoryView } from './directory-view'
import { ReportView } from './report-view'
import { ThemeToggle } from './theme-toggle'

export type TabId = 'dashboard' | 'report' | 'directory' | 'assistant'

const TABS: { id: TabId; label: string; shortLabel: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'report', label: 'Report Issue', shortLabel: 'Report', icon: FilePlus2 },
  { id: 'directory', label: 'Emergency Directory', shortLabel: 'Directory', icon: BookUser },
  { id: 'assistant', label: 'AI Helper', shortLabel: 'Helper', icon: Bot },
]

export function AppShell() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const store = useIssues()
  const activeCount = store.issues.filter((i) => i.status === 'active').length

  function navigate(next: TabId) {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-dvh bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Radio className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-base font-semibold tracking-tight">CommunityConnect</span>
              <span className="hidden text-xs text-muted-foreground sm:block md:hidden xl:block">Guwahati, Assam · Resource & disaster tracking</span>
            </span>
          </button>

          <nav aria-label="Main" className="ml-auto hidden md:block">
            <ul className="flex items-center gap-1 rounded-xl bg-muted p-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => navigate(id)}
                    aria-current={tab === id ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
                      tab === id && 'bg-card text-foreground shadow-sm',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <span className="hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground lg:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Live
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === 'dashboard' && <DashboardView store={store} onNavigate={navigate} />}
        {tab === 'report' && <ReportView store={store} />}
        {tab === 'directory' && <DirectoryView />}
        {tab === 'assistant' && <AssistantView />}
      </main>

      <nav
        aria-label="Main mobile"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-4">
          {TABS.map(({ id, shortLabel, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => navigate(id)}
                aria-current={tab === id ? 'page' : undefined}
                className={cn(
                  'relative flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground outline-none focus-visible:bg-muted',
                  tab === id && 'text-primary',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {shortLabel}
                {id === 'report' && activeCount > 0 && (
                  <span className="absolute top-1.5 left-1/2 ml-2 rounded-full bg-destructive px-1.5 text-[10px] leading-4 text-white">
                    {activeCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
