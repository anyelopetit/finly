import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { formatCurrency, formatPercent } from '@/lib/calculations'
import { usePrivacyStore } from '@/store'
import type { CategoryBreakdown, Currency } from '@/types'

const COLORS = [
  '#7653C8',
  '#BEF532',
  '#A990E8',
  '#4D6700',
  '#E9DDFF',
  '#BA1A1A',
  '#3B82F6',
  '#F59E0B',
  '#10B981',
  '#6366F1',
]

interface CategoryPieChartProps {
  breakdown: CategoryBreakdown[]
  chartData: { name: string; value: number }[]
  activeCurrency: Currency
}

export function CategoryPieChart({
  breakdown,
  chartData,
  activeCurrency,
}: CategoryPieChartProps) {
  const { isHidden } = usePrivacyStore()

  if (chartData.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-headline-sm font-bold text-on-surface">Gastos por Categoría</h2>
        <p className="text-body-md text-on-surface-variant text-center py-10">
          No hay gastos registrados en este período.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
      <h2 className="text-headline-sm font-bold text-on-surface">Gastos por Categoría</h2>

      <div className="h-56 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                formatCurrency(value, activeCurrency),
                'Gasto',
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table */}
      <div className="space-y-2.5 pt-2 border-t border-outline-variant/30">
        {breakdown.map((item, idx) => (
          <div key={item.category.id} className="flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="font-semibold text-on-surface">{item.category.name}</span>
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="font-bold text-on-surface">
                {isHidden ? '••••••' : formatCurrency(item.total, activeCurrency)}
              </span>
              <span className="text-label-sm text-on-surface-variant w-12 text-right">
                {formatPercent(item.percentage)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
