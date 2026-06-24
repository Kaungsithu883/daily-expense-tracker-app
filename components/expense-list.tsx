'use client'

import { deleteExpense } from '@/app/actions/expenses'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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

export function ExpenseList({
  expenses,
  onDelete,
}: {
  expenses: Expense[]
  onDelete?: () => void
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    setIsDeleting(expenseId)
    try {
      await deleteExpense(expenseId)
      onDelete?.()
    } catch (err) {
      console.error('Failed to delete expense:', err)
    } finally {
      setIsDeleting(null)
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses for this period
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const dateStr = expense.date instanceof Date
          ? expense.date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : new Date(expense.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })

        return (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{ backgroundColor: expense.categoryColor || '#3b82f6' }}
              >
                {expense.categoryIcon || '💰'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {expense.categoryName || 'Uncategorized'}
                </p>
                {expense.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {expense.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-primary text-right">
                ₭{parseFloat(expense.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(expense.id)}
                disabled={isDeleting === expense.id}
              >
                {isDeleting === expense.id ? '...' : '×'}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
