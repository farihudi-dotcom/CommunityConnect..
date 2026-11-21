'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { buildSeedIssues, type Issue } from '@/lib/cc/data'

const STORAGE_KEY = 'cc-issues-guwahati-v1'
const SERVER_SNAPSHOT: Issue[] = buildSeedIssues(0)

let cache: Issue[] | null = null
const listeners = new Set<() => void>()

function readIssues(): Issue[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as Issue[]) : buildSeedIssues(Date.now())
    if (!raw) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    cache = buildSeedIssues(Date.now())
  }
  return cache
}

function writeIssues(next: Issue[]) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage may be full or disabled; keep the in-memory copy so the UI still updates.
  }
  listeners.forEach((listener) => listener())
}

function updateIssue(id: string, update: (issue: Issue) => Issue) {
  writeIssues(readIssues().map((issue) => (issue.id === id ? update(issue) : issue)))
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    cache = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export type NewIssue = Pick<Issue, 'title' | 'category' | 'location' | 'description' | 'priority'>

export function useIssues() {
  const issues = useSyncExternalStore(subscribe, readIssues, () => SERVER_SNAPSHOT)

  const addIssue = useCallback((input: NewIssue) => {
    const issue: Issue = {
      ...input,
      id: crypto.randomUUID(),
      status: 'active',
      upvotes: 1,
      upvotedByMe: true,
      createdAt: Date.now(),
    }
    writeIssues([issue, ...readIssues()])
    return issue
  }, [])

  const toggleStatus = useCallback((id: string) => {
    updateIssue(id, (issue) =>
      issue.status === 'active'
        ? { ...issue, status: 'resolved', resolvedAt: Date.now() }
        : { ...issue, status: 'active', resolvedAt: undefined },
    )
  }, [])

  const toggleUpvote = useCallback((id: string) => {
    updateIssue(id, (issue) => ({
      ...issue,
      upvotedByMe: !issue.upvotedByMe,
      upvotes: Math.max(0, issue.upvotes + (issue.upvotedByMe ? -1 : 1)),
    }))
  }, [])

  const removeIssue = useCallback((id: string) => {
    writeIssues(readIssues().filter((issue) => issue.id !== id))
  }, [])

  const resetIssues = useCallback(() => {
    writeIssues(buildSeedIssues(Date.now()))
  }, [])

  return { issues, addIssue, toggleStatus, toggleUpvote, removeIssue, resetIssues }
}

export type IssueStore = ReturnType<typeof useIssues>

const noopSubscribe = () => () => {}

export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}
