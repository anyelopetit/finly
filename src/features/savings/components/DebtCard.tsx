import type { Debt } from '@/types'
import { formatCurrency, getDebtProgress, getDebtRemaining } from '@/lib/calculations'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { usePrivacyStore } from '@/store'

interface DebtCardProps {
  debt: Debt
  onPay: () => void
}

export function DebtCard({ debt, onPay }: DebtCardProps) {
  const { isHidden } = usePrivacyStore()
  const remaining = getDebtRemaining(debt)
  const progress = getDebtProgress(debt)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-label-lg font-bold text-on-surface">{debt.name}</h3>
          <p className="text-body-sm text-on-surface-variant">
            {debt.creditor ? `Acreedor: ${debt.creditor}` : 'Compromiso financiero'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-label-lg font-bold text-error">
            {isHidden ? '••••••' : formatCurrency(remaining, debt.currency)}
          </span>
          <p className="text-label-sm text-on-surface-variant">por pagar</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-body-sm text-on-surface-variant">
          <span>Progreso pagado</span>
          <span className="font-bold text-secondary">{progress.toFixed(0)}%</span>
        </div>
        <ProgressBar value={progress} barClassName="bg-secondary" />
      </div>

      <div className="flex justify-between items-center pt-1">
        <span className="text-label-sm text-on-surface-variant">
          {debt.due_date ? `Vence: ${debt.due_date}` : 'Sin fecha límite'}
        </span>
        <button
          onClick={onPay}
          className="text-label-sm font-bold text-secondary bg-secondary-container/20 px-3 py-1 rounded-full hover:bg-secondary-container/40 transition-all cursor-pointer"
        >
          + Abonar pago
        </button>
      </div>
    </div>
  )
}
