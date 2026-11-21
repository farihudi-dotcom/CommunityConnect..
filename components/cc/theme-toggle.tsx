'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const nextDark = !root.classList.contains('dark')
    root.classList.toggle('dark', nextDark)
    try {
      localStorage.setItem('cc-theme', nextDark ? 'dark' : 'light')
    } catch {
      // Ignore storage errors; the theme still applies for this session.
    }
  }

  return (
    <Button variant="outline" size="icon-lg" onClick={toggle} aria-label="Toggle dark mode">
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  )
}
