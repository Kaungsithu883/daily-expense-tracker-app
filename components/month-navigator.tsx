'use client'

import { Button } from '@/components/ui/button'

interface MonthNavigatorProps {
  month: number
  year: number
  onMonthChange: (month: number, year: number) => void
}

export function MonthNavigator({
  month,
  year,
  onMonthChange,
}: MonthNavigatorProps) {
  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
  })

  const handlePrevious = () => {
    if (month === 1) {
      onMonthChange(12, year - 1)
    } else {
      onMonthChange(month - 1, year)
    }
  }

  const handleNext = () => {
    if (month === 12) {
      onMonthChange(1, year + 1)
    } else {
      onMonthChange(month + 1, year)
    }
  }

  const handleToday = () => {
    const today = new Date()
    onMonthChange(today.getMonth() + 1, today.getFullYear())
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={handlePrevious}
        className="px-3"
      >
        ←
      </Button>

      <div className="text-center min-w-40">
        <p className="text-2xl font-bold text-foreground">
          {monthName} {year}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleToday}
          className="text-sm"
        >
          Today
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          className="px-3"
        >
          →
        </Button>
      </div>
    </div>
  )
}
