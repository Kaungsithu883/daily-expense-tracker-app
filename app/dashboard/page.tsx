'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { MonthNavigator } from '@/components/month-navigator'
import { MonthlySummary } from '@/components/monthly-summary'
import { ExpenseForm } from '@/components/expense-form'
import { ExpenseList } from '@/components/expense-list'
import { BudgetSetter } from '@/components/budget-setter'
import { CategoryManager } from '@/components/category-manager'
import { DailyBreakdown } from '@/components/daily-breakdown'
import { CategoryBreakdown } from '@/components/category-breakdown'
import { ProfilePanel } from '@/components/profile-panel'
import { Button } from '@/components/ui/button'
import {
  getExpenses,
  getMonthlyStats,
  getDailyStats,
  getCategoryStats,
} from '@/app/actions/expenses'

interface Expense {
  id: string
  amount: string
  description: string | null
  date: Date
  categoryId: string
  categoryName: string | null
  categoryColor: string | null
  categoryIcon: string | null
}

interface MonthlyStats {
  totalSpent: number
  budgetLimit: number
  month: number
  year: number
}

interface DailyData {
  date: Date
  total: number
  count: number
}

interface CategoryData {
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  total: number
  count: number
}

export default function Dashboard() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
  const [dailyStats, setDailyStats] = useState<DailyData[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview')

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/admin')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (isPending || !session?.user) return

    const loadData = async () => {
      setIsLoading(true)
      try {
        const [expensesData, statsData, dailyData, categoryData] = await Promise.all([
          getExpenses(year, month),
          getMonthlyStats(year, month),
          getDailyStats(year, month),
          getCategoryStats(year, month),
        ])
        setExpenses(expensesData)
        setMonthlyStats(statsData)
        setDailyStats(dailyData)
        setCategoryStats(categoryData)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [month, year, isPending, session?.user?.id])

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  const handleRefresh = async () => {
    try {
      const [expensesData, statsData, dailyData, categoryData] = await Promise.all([
        getExpenses(year, month),
        getMonthlyStats(year, month),
        getDailyStats(year, month),
        getCategoryStats(year, month),
      ])
      setExpenses(expensesData)
      setMonthlyStats(statsData)
      setDailyStats(dailyData)
      setCategoryStats(categoryData)
    } catch (err) {
      console.error('Failed to refresh data:', err)
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="h-10 w-48 animate-pulse rounded-2xl bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-3xl bg-muted" />)}
          </div>
          <div className="h-80 animate-pulse rounded-3xl bg-muted" />
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Daily expense tracking and budget monitoring
            </p>
          </div>
          {session?.user && (
            <Button
              variant="outline"
              onClick={async () => {
                await fetch('/api/auth/sign-out', { method: 'POST' })
                router.replace('/admin')
                router.refresh()
              }}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Month Navigator */}
        <MonthNavigator
          month={month}
          year={year}
          onMonthChange={handleMonthChange}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading expenses...</p>
          </div>
        ) : (
          <>
            {/* Monthly Summary */}
            {monthlyStats && (
              <MonthlySummary
                totalSpent={monthlyStats.totalSpent}
                budgetLimit={monthlyStats.budgetLimit}
                month={month}
                year={year}
              />
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Details
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Add Expense Form */}
                  <div id="add-expense" className="lg:col-span-1">
                    <ExpenseForm onSuccess={handleRefresh} />
                  </div>

                  {/* Budget Setter */}
                  <div className="lg:col-span-2">
                    <BudgetSetter
                      month={month}
                      year={year}
                      onUpdate={handleRefresh}
                    />
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DailyBreakdown
                    data={dailyStats}
                    budgetLimit={monthlyStats?.budgetLimit || 500000}
                    month={month}
                  />
                  <CategoryBreakdown data={categoryStats} />
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Expense List */}
                  <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">All Expenses</h3>
                      <span className="text-sm text-muted-foreground">
                        {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ExpenseList expenses={expenses} onDelete={handleRefresh} />
                  </div>

                  {/* Category Manager */}
                  <div className="flex flex-col gap-6 lg:col-span-1">
                    <div id="categories">
                      <CategoryManager onCategoryAdded={handleRefresh} />
                    </div>
                    <div id="profile">
                      <ProfilePanel
                        name={session.user.name}
                        email={session.user.email}
                        onSignOut={async () => {
                          await fetch('/api/auth/sign-out', { method: 'POST' })
                          router.replace('/admin')
                          router.refresh()
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <nav aria-label="Dashboard navigation" className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-md items-center justify-around rounded-3xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-xl md:inset-x-auto md:right-8 md:bottom-8 md:mx-0 md:max-w-none md:gap-2 md:rounded-2xl">
        <button onClick={() => setActiveTab('overview')} className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">Dashboard</button>
        <button onClick={() => { setActiveTab('overview'); document.getElementById('add-expense')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Add expense</button>
        <button onClick={() => { setActiveTab('details'); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">Categories</button>
        <button onClick={() => { setActiveTab('details'); document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">Profile</button>
      </nav>
    </div>
  )
}
