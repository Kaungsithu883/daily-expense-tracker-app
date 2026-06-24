'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  expenses,
  categories,
  monthlyBudgets,
  user,
} from '@/lib/db/schema'
import {
  and,
  eq,
  gte,
  lte,
  desc,
  sql,
} from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const DEMO_USER_ID = 'demo-user-123' // Demo mode - temporary

async function getUserId() {
  // Demo mode - return demo user ID
  if (process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'development') {
    return DEMO_USER_ID
  }
  
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return session.user.id
}

export async function addExpense(
  categoryId: string,
  amount: string,
  description: string,
  date: string
) {
  const userId = await getUserId()

  const result = await db.insert(expenses).values({
    id: crypto.randomUUID(),
    userId,
    categoryId,
    amount,
    description,
    date: new Date(date),
  })

  revalidatePath('/')
  return result
}

export async function getExpenses(year: number, month: number) {
  const userId = await getUserId()

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const result = await db
    .select({
      id: expenses.id,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      categoryId: expenses.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .orderBy(desc(expenses.date))

  return result
}

export async function deleteExpense(expenseId: string) {
  const userId = await getUserId()

  await db
    .delete(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)))

  revalidatePath('/')
}

export async function addCategory(name: string, color: string, icon: string) {
  const userId = await getUserId()

  const result = await db.insert(categories).values({
    id: crypto.randomUUID(),
    userId,
    name,
    color,
    icon,
  })

  revalidatePath('/')
  return result
}

export async function getCategories() {
  const userId = await getUserId()

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.name)

  return result
}

export async function deleteCategory(categoryId: string) {
  const userId = await getUserId()

  await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))

  revalidatePath('/')
}

export async function setBudgetLimit(limit: string, year: number, month: number) {
  const userId = await getUserId()

  const existingBudget = await db
    .select()
    .from(monthlyBudgets)
    .where(
      and(
        eq(monthlyBudgets.userId, userId),
        eq(monthlyBudgets.month, month),
        eq(monthlyBudgets.year, year)
      )
    )

  if (existingBudget.length > 0) {
    await db
      .update(monthlyBudgets)
      .set({ budgetLimit: limit, updatedAt: new Date() })
      .where(eq(monthlyBudgets.id, existingBudget[0].id))
  } else {
    await db.insert(monthlyBudgets).values({
      id: crypto.randomUUID(),
      userId,
      month,
      year,
      budgetLimit: limit,
    })
  }

  revalidatePath('/')
}

export async function getBudgetLimit(year: number, month: number) {
  const userId = await getUserId()

  const result = await db
    .select()
    .from(monthlyBudgets)
    .where(
      and(
        eq(monthlyBudgets.userId, userId),
        eq(monthlyBudgets.month, month),
        eq(monthlyBudgets.year, year)
      )
    )

  return result[0] || null
}

export async function getMonthlyStats(year: number, month: number) {
  const userId = await getUserId()

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const totalSpent = await db
    .select({
      total: sql<string>`CAST(COALESCE(SUM(amount), 0) AS varchar)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )

  const budget = await getBudgetLimit(year, month)

  return {
    totalSpent: parseFloat(totalSpent[0]?.total || '0'),
    budgetLimit: budget ? parseFloat(budget.budgetLimit) : 500000,
    month,
    year,
  }
}

export async function getDailyStats(year: number, month: number) {
  const userId = await getUserId()

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const result = await db
    .select({
      date: expenses.date,
      total: sql<string>`CAST(COALESCE(SUM(amount), 0) AS varchar)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .groupBy(expenses.date)
    .orderBy(expenses.date)

  return result.map((row) => ({
    date: row.date,
    total: parseFloat(row.total || '0'),
    count: row.count,
  }))
}

export async function getCategoryStats(year: number, month: number) {
  const userId = await getUserId()

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const result = await db
    .select({
      categoryId: expenses.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
      total: sql<string>`CAST(COALESCE(SUM(amount), 0) AS varchar)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .groupBy(expenses.categoryId, categories.name, categories.color, categories.icon)
    .orderBy(desc(sql`SUM(amount)`))

  return result.map((row) => ({
    categoryId: row.categoryId,
    categoryName: row.categoryName || 'Uncategorized',
    categoryColor: row.categoryColor || '#3b82f6',
    categoryIcon: row.categoryIcon || 'tag',
    total: parseFloat(row.total || '0'),
    count: row.count,
  }))
}
