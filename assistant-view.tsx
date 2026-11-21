'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { AlertCircle, Bot, Phone, RotateCcw, SendHorizontal, Sparkles, User } from 'lucide-react'
import { telHref } from '@/lib/cc/data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GUIDE_TOPICS, getAssistantReply, type AssistantReply } from '@/lib/cc/assistant'
import { cn } from '@/lib/utils'

type Message =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; reply: AssistantReply }

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  reply: {
    intro:
      "Nomoskar! I'm the CommunityConnect Helper for Guwahati. Type anything — like \"water entering my house in Anil Nagar\" or \"need ambulance near Dispur\" — and I'll give you local steps and the exact numbers to call.",
    callout: 'For any life-threatening emergency, call 112 right away.',
  },
}

let messageCounter = 0
const nextId = () => `m-${++messageCounter}`

export function AssistantView() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => () => clearTimeout(timer.current), [])

  function ask(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    timer.current = setTimeout(
      () => {
        setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', reply: getAssistantReply(trimmed) }])
        setTyping(false)
      },
      700 + Math.random() * 600,
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    ask(input)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) {
      event.preventDefault()
    }
  }

  function reset() {
    clearTimeout(timer.current)
    setTyping(false)
    setMessages([WELCOME])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">AI Helper</h1>
        <p className="text-sm text-muted-foreground">
          Ask for emergency advice and get clear, step-by-step guidance.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="gap-0 overflow-hidden py-0 lg:col-span-2">
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-semibold">CommunityConnect Helper</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                Online · Simulated assistant
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              New chat
            </Button>
          </div>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex h-[min(60dvh,34rem)] flex-col gap-4 overflow-y-auto bg-muted/30 p-4"
          >
            {messages.map((message) =>
              message.role === 'user' ? (
                <div key={message.id} className="flex items-end justify-end gap-2">
                  <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {message.text}
                  </p>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="size-4 text-secondary-foreground" aria-hidden="true" />
                    <span className="sr-only">You</span>
                  </span>
                </div>
              ) : (
                <AssistantBubble key={message.id} reply={message.reply} />
              ),
            )}
            {typing && (
              <div className="flex items-end gap-2">
                <BotAvatar />
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border bg-card px-4 py-3">
                  <span className="sr-only">Helper is typing</span>
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${delay}ms` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t p-3">
            <div className="-mx-3 flex gap-2 overflow-x-auto px-3">
              {GUIDE_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => ask(topic.prompt)}
                  disabled={typing}
                  className="shrink-0 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors outline-none hover:border-primary/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                >
                  {topic.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your situation…"
                aria-label="Message the helper"
                maxLength={300}
                className="h-10"
              />
              <Button type="submit" size="icon-lg" className="size-10" disabled={!input.trim() || typing} aria-label="Send message">
                <SendHorizontal />
              </Button>
            </form>
          </div>
        </Card>

        <aside className="flex flex-col gap-4">
          <Card className="gap-3 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Guided topics
            </h2>
            <ul className="flex flex-col gap-1">
              {GUIDE_TOPICS.map((topic) => (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => ask(topic.prompt)}
                    disabled={typing}
                    className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  >
                    <span className="text-sm font-medium">{topic.label}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{topic.prompt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm">
            <AlertCircle className="size-5 shrink-0 text-warning" aria-hidden="true" />
            <p className="leading-relaxed text-muted-foreground text-pretty">
              This helper offers general guidance and is not a substitute for professional medical or emergency
              services. <span className="font-medium text-foreground">In danger? Call 112.</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function BotAvatar() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <Bot className="size-4" aria-hidden="true" />
      <span className="sr-only">Helper</span>
    </span>
  )
}

function AssistantBubble({ reply }: { reply: AssistantReply }) {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="flex max-w-[85%] flex-col gap-3 rounded-2xl rounded-bl-sm border bg-card px-4 py-3 text-sm shadow-xs">
        {reply.detected && reply.detected.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>Detected:</span>
            {reply.detected.map((kw) => (
              <span key={kw} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                {kw}
              </span>
            ))}
          </div>
        )}
        <p className="leading-relaxed text-pretty">{reply.intro}</p>
        {reply.sections?.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <p className="font-semibold">{section.title}</p>
            <ol className="flex flex-col gap-2">
              {section.steps.map((step, index) => (
                <li key={step} className="flex gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        {reply.helplines && reply.helplines.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Call now</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {reply.helplines.map((h) => (
                <li key={h.number}>
                  <a
                    href={telHref(h.number)}
                    className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 transition-colors outline-none hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Phone className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="font-mono text-sm font-semibold">{h.number}</span>
                    <span className="truncate text-xs text-muted-foreground">{h.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {reply.callout && (
          <p className={cn('rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground')}>
            {reply.callout}
          </p>
        )}
      </div>
    </div>
  )
}
