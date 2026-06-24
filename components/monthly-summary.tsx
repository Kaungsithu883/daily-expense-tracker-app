'use client'

interface MonthlySummaryProps {
  totalSpent: number
  budgetLimit: number
  month: number
  year: number
}

export function MonthlySummary({
  totalSpent,
  budgetLimit,
  month,
  year,
}: MonthlySummaryProps) {
  const remaining = budgetLimit - totalSpent
  const percentage = (totalSpent / budgetLimit) * 100
  const isBudgetExceeded = totalSpent > budgetLimit

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
  })

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {monthName} {year}
          </p>
          <h2 className="text-2xl font-bold text-foreground">
            Monthly Summary
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-3xl font-bold text-primary">
            ₭{totalSpent.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Budget Progress
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBudgetExceeded ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="text-lg font-semibold text-foreground">
            ₭{budgetLimit.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Spent</p>
          <p className="text-lg font-semibold text-primary">
            ₭{totalSpent.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p
            className={`text-lg font-semibold ${
              isBudgetExceeded ? 'text-destructive' : 'text-green-600'
            }`}
          >
            ₭{Math.max(remaining, 0).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {isBudgetExceeded && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Budget exceeded by ₭
            {(totalSpent - budgetLimit).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      )}
    </div>
  )
}
