'use client'

import { useState, useEffect } from 'react'
import { setBudgetLimit, getBudgetLimit } from '@/app/actions/expenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BudgetSetterProps {
  month: number
  year: number
  onUpdate?: () => void
}

export function BudgetSetter({ month, year, onUpdate }: BudgetSetterProps) {
  const [budget, setBudget] = useState('500000')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const data = await getBudgetLimit(year, month)
        if (data) {
          setBudget(data.budgetLimit)
        }
      } catch (err) {
        console.error('Failed to load budget:', err)
      }
    }
    loadBudget()
  }, [month, year])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await setBudgetLimit(budget, year, month)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
      onUpdate?.()
    } catch (err) {
      console.error('Failed to save budget:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <h3 className="font-semibold text-foreground">Monthly Budget Limit</h3>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget Amount (MMK)</Label>
        <Input
          id="budget"
          type="number"
          step="1000"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value)
            setIsSaved(false)
          }}
          placeholder="Enter budget limit"
        />
        <p className="text-xs text-muted-foreground">
          Current limit: ₭{parseFloat(budget).toLocaleString('en-US', {
            minimumFractionDigits: 0,
          })}
        </p>
      </div>

      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : isSaved ? '✓ Saved' : 'Save Budget'}
      </Button>
    </div>
  )
}
