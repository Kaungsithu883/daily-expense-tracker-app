'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

interface CategoryData {
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  total: number
  count: number
}

interface CategoryBreakdownProps {
  data: CategoryData[]
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = data.map((d) => ({
    name: `${d.categoryIcon} ${d.categoryName}`,
    value: d.total,
    originalName: d.categoryName,
    count: d.count,
  }))

  const colors = data.map((d) => d.categoryColor)

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Spending by Category</h3>

      {chartData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No expenses this month
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: number) => `₭${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-2 mt-4 max-h-40 overflow-y-auto">
            {data.map((item) => (
              <div key={item.categoryId} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.categoryColor }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate">
                    {item.categoryIcon} {item.categoryName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₭{item.total.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
