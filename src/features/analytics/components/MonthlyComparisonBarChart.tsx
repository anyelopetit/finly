import { useState, useEffect } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/calculations'
import type { Currency } from '@/types'

interface MonthlyComparisonBarChartProps {
  data: { month: string; Ingresos: number; Gastos: number }[]
  currency: Currency
}

export function MonthlyComparisonBarChart({ data, currency }: MonthlyComparisonBarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">Ritmo de Gastos e Ingresos</h2>
          <p className="text-body-sm text-on-surface-variant">Comparativa de flujo de efectivo por mes</p>
        </div>
      </div>

      <div className="h-52 w-full min-h-[208px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#858191" fontSize={12} />
              <YAxis stroke="#858191" fontSize={12} />
              <Tooltip
                formatter={(val: unknown) => [
                  typeof val === 'number' ? formatCurrency(val, currency) : '',
                  '',
                ]}
              />
              <Bar dataKey="Ingresos" fill="#4D6700" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastos" fill="#7653C8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-surface-container-low/50 rounded-2xl animate-pulse" />
        )}
      </div>
      <div className="flex justify-center gap-6 text-label-sm font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#4D6700]" />
          <span>Ingresos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#7653C8]" />
          <span>Gastos</span>
        </div>
      </div>
    </div>
  )
}
