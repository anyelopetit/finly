import { formatCurrency } from '@/lib/calculations'
import type { Currency } from '@/types'
import { ShieldCheck, ShieldAlert, Shield, Sparkles } from 'lucide-react'

interface EmergencyFundProps {
  fund: {
    currentBalance: number
    avgMonthlyExpense: number
    monthsCovered: number
    targetFund3Months: number
    targetFund6Months: number
    status: 'critical' | 'building' | 'healthy' | 'optimal'
  }
  currency: Currency
}

export function EmergencyFundCard({ fund, currency }: EmergencyFundProps) {
  const getStatusBadge = () => {
    switch (fund.status) {
      case 'optimal':
        return {
          label: 'Fondo Blindado (+6 meses)',
          color: 'bg-secondary-fixed/40 text-secondary border-secondary/30',
          icon: ShieldCheck,
          text: 'Tienes una excelente protección. Tu excedente ya puede destinarse a inversiones de mayor rendimiento.',
        }
      case 'healthy':
        return {
          label: 'Saludable (3 a 6 meses)',
          color: 'bg-secondary-container/30 text-secondary border-secondary/30',
          icon: ShieldCheck,
          text: 'Cumples con la cobertura recomendada ante imprevistos laborales o emergencias médicas en Venezuela.',
        }
      case 'building':
        return {
          label: 'En Construcción (1 a 3 meses)',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Shield,
          text: 'Vas por buen camino, pero un imprevisto mediano consumiría tu liquidez. Sigue sumando aportes.',
        }
      default:
        return {
          label: 'Vulnerable (< 1 mes)',
          color: 'bg-error-container/40 text-error border-error/30',
          icon: ShieldAlert,
          text: 'Tus ahorros actuales cubren menos de un mes de gastos. Tu prioridad número 1 debe ser acumular este colchón.',
        }
    }
  }

  const badge = getStatusBadge()
  const progressTo3Months = Math.min(100, Math.round((fund.currentBalance / (fund.targetFund3Months || 1)) * 100))

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/30 text-secondary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface">Fondo de Emergencia</h2>
            <p className="text-body-sm text-on-surface-variant">Meses de supervivencia cubiertos</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${badge.color}`}>
          {fund.monthsCovered} {fund.monthsCovered === 1 ? 'mes cubierto' : 'meses cubiertos'}
        </span>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <span>Costo básico indispensable:</span>
              <span className="text-[10px] bg-secondary-fixed/40 text-secondary-fixed-variant px-1.5 py-0.2 rounded font-bold">
                Calibrado
              </span>
            </div>
            <p className="text-label-lg font-bold text-on-surface font-numeric mt-0.5">
              {formatCurrency(fund.avgMonthlyExpense, currency)} / mes
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-on-surface-variant font-medium">Meta 3 meses:</span>
            <p className="text-label-lg font-bold text-primary font-numeric mt-0.5">
              {formatCurrency(fund.targetFund3Months, currency)}
            </p>
          </div>
        </div>

        {/* Progress bar to 3 months */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant">
            <span>Progreso hacia colchón mínimo de 3 meses:</span>
            <span className="font-bold text-on-surface font-numeric">{progressTo3Months}%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary-fixed shadow-sm transition-all duration-500"
              style={{ width: `${progressTo3Months}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
          <span>Meta óptima 6 meses: <strong>{formatCurrency(fund.targetFund6Months, currency)}</strong></span>
          <span>Saldo disponible: <strong>{formatCurrency(fund.currentBalance, currency)}</strong></span>
        </div>
      </div>

      {/* Explanation Verdict */}
      <div className="flex items-start gap-2.5 text-body-sm text-on-surface">
        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-on-surface-variant">
          {badge.text}
        </p>
      </div>
    </div>
  )
}
