'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface DailyData {
  date: Date
  total: number
  count: number
}

interface DailyBreakdownProps {
  data: DailyData[]
  budgetLimit: number
  month: number
}

export function DailyBreakdown({
  data,
  budgetLimit,
  month,
}: DailyBreakdownProps) {
  const chartData = data.map((d) => {
    const date = d.date instanceof Date ? d.date : new Date(d.date)
    return {
      day: date.getDate(),
      total: d.total,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })

  const avgDaily = budgetLimit / new Date(new Date().getFullYear(), month, 0).getDate()

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Daily Breakdown</h3>

      {chartData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data for this month
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
              formatter={(value: number) => [
                `₭${value.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                })}`,
                'Spent',
              ]}
            />
            <ReferenceLine
              y={avgDaily}
              stroke="var(--primary)"
              strokeDasharray="5 5"
              label={{
                value: `Daily Avg: ₭${avgDaily.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                position: 'top',
                fill: 'var(--primary)',
                fontSize: 12,
              }}
            />
            <Bar dataKey="total" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
