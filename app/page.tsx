'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, CircleDollarSign, Moon, ShieldCheck, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><CircleDollarSign /></span>
          <span>Our Expense Tracker</span>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={() => setDark((value) => !value)} className="flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur-xl transition hover:text-foreground">
            {dark ? <Sun /> : <Moon />}
          </button>
          <Link href="/admin" className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted sm:block">Log in</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 md:grid-cols-[1.1fr_.9fr] md:px-8 md:pb-28 md:pt-20">
        <div className="flex flex-col gap-7">
          <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">A calmer way to spend</span>
          <h1 className="max-w-2xl text-balance text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Know where your money goes.</h1>
          <p className="max-w-xl text-pretty text-lg leading-8 text-muted-foreground">A private, beautifully simple space for you and your household to track expenses, protect your budget, and make better everyday decisions.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition hover:-translate-y-0.5">Open your tracker <ArrowRight className="transition group-hover:translate-x-1" /></Link>
            <a href="#features" className="rounded-full border border-border bg-card/70 px-5 py-3 font-semibold backdrop-blur-xl transition hover:bg-muted">Explore features</a>
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-border bg-card/70 p-5 shadow-2xl shadow-primary/10 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-border pb-5"><div><p className="text-sm text-muted-foreground">This month</p><p className="mt-1 text-3xl font-semibold tracking-tight">MMK 286,400</p></div><span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">57% used</span></div>
          <div className="flex h-48 items-end gap-2 py-6">{[34, 54, 42, 68, 48, 78, 58, 86, 62, 72, 50, 66].map((height, index) => <div key={index} className="flex-1 rounded-t-lg bg-primary/20" style={{ height: `${height}%` }}><div className="h-1/2 rounded-t-lg bg-primary" /></div>)}</div>
          <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-card text-primary"><ShieldCheck /></span><div><p className="font-medium">You are on track</p><p className="text-sm text-muted-foreground">Keep daily spending under MMK 16,800</p></div></div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 md:grid-cols-3 md:px-8"><Feature icon={<BarChart3 />} title="Clear insights" text="See daily patterns and category trends without the spreadsheet headache." /><Feature icon={<ShieldCheck />} title="Private by default" text="Separate secure accounts keep your personal spending yours." /><Feature icon={<CircleDollarSign />} title="Built for daily life" text="Add an expense in seconds and stay close to your monthly plan." /></section>
    </main>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl"><div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 leading-6 text-muted-foreground">{text}</p></article>
}
