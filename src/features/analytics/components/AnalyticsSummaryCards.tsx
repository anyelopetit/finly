import { formatCurrency, formatPercent } from '@/lib/calculations'
import { usePrivacyStore } from '@/store'
import type { Currency, MonthlyFinancials } from '@/types'

interface AnalyticsSummaryCardsProps {
  financials: MonthlyFinancials
  totalExpense: number
  activeCurrency: Currency
  activeCategoriesCount: number
}

export function AnalyticsSummaryCards({
  financials,
  totalExpense,
  activeCurrency,
  activeCategoriesCount,
}: AnalyticsSummaryCardsProps) {
  const { isHidden } = usePrivacyStore()

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
        <span className="text-label-sm text-on-surface-variant font-medium">Tasa de Ahorro</span>
        <p className="text-headline-sm font-bold text-primary mt-1">
          {isHidden ? '••••%' : formatPercent(financials.savings_rate)}
        </p>
        <span className="text-body-sm text-on-surface-variant">del ingreso mensual</span>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
        <span className="text-label-sm text-on-surface-variant font-medium">Gasto Total</span>
        <p className="text-headline-sm font-bold text-on-surface mt-1">
          {isHidden ? '••••••' : formatCurrency(totalExpense, activeCurrency)}
        </p>
        <span className="text-body-sm text-on-surface-variant">
          {activeCategoriesCount} categorías activas
        </span>
      </div>
    </div>
  )
}
