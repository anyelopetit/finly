import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { usePrivacyStore } from '@/store'
import { formatCurrency } from '@/lib/calculations'
import type { Currency, MonthlyFinancials } from '@/types'

interface FinancialSummaryPillsProps {
  currentFinancials: MonthlyFinancials
  prevFinancials: MonthlyFinancials
  currency: Currency
}

export function FinancialSummaryPills({
  currentFinancials,
  prevFinancials,
  currency,
}: FinancialSummaryPillsProps) {
  const { isHidden } = usePrivacyStore()
  const now = new Date()

  return (
    <div className="grid grid-cols-2 gap-space-sm">
      {/* Income */}
      <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm text-on-surface-variant font-medium">
            Ingresos {format(now, 'MMM', { locale: es })}
          </span>
          <div className="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </div>
        </div>
        <div>
          <p className="text-headline-sm font-bold text-on-surface">
            {isHidden ? '••••••' : `+${formatCurrency(currentFinancials.total_income, currency)}`}
          </p>
          {currentFinancials.total_income > 0 && (
            <span className="text-label-sm text-secondary font-semibold mt-0.5 inline-block">
              Plan activo
            </span>
          )}
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm text-on-surface-variant font-medium">
            Gastos {format(now, 'MMM', { locale: es })}
          </span>
          <div className="w-7 h-7 rounded-full bg-error-container/40 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </div>
        </div>
        <div>
          <p className="text-headline-sm font-bold text-on-surface">
            {isHidden ? '••••••' : `-${formatCurrency(currentFinancials.total_expenses, currency)}`}
          </p>
          {prevFinancials.total_expenses > 0 && currentFinancials.total_expenses > 0 && (
            <div className="inline-flex items-center gap-1 bg-secondary-container/30 px-1.5 py-0.5 rounded-full mt-0.5">
              <span className="material-symbols-outlined text-[12px] text-secondary font-bold">
                {currentFinancials.total_expenses < prevFinancials.total_expenses ? 'trending_down' : 'trending_up'}
              </span>
              <span className="text-label-sm text-secondary font-bold">
                {currentFinancials.total_expenses < prevFinancials.total_expenses ? '-' : '+'}
                {Math.abs(Math.round(((currentFinancials.total_expenses - prevFinancials.total_expenses) / prevFinancials.total_expenses) * 100))}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
