import { formatCurrency } from '@/lib/calculations'
import type { Currency } from '@/types'
import { ShieldCheck, ShieldAlert, Shield, ArrowUpRight } from 'lucide-react'

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
          text: 'Cumples con la cobertura recomendada ante imprevistos o emergencias médicas en Venezuela.',
        }
      case 'building':
        return {
          label: 'En Construcción (1 a 3 meses)',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Shield,
          text: 'Vas por buen camino, pero una emergencia mediana podría consumir tu liquidez. Sigue sumando aportes.',
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
  const Icon = badge.icon
  const progressTo3Months = Math.min(100, Math.round((fund.currentBalance / (fund.targetFund3Months || 1)) * 100))

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/30 text-secondary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface">Fondo de Emergencia</h2>
            <p className="text-body-sm text-on-surface-variant">Meses de supervivencia cubiertos</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
          {fund.monthsCovered} {fund.monthsCovered === 1 ? 'mes' : 'meses'}
        </span>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-xs text-on-surface-variant font-medium">Gasto mensual promedio:</span>
            <p className="text-label-lg font-bold text-on-surface">
              {formatCurrency(fund.avgMonthlyExpense, currency)} / mes
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-on-surface-variant font-medium">Meta 3 meses:</span>
            <p className="text-label-lg font-bold text-primary">
              {formatCurrency(fund.targetFund3Months, currency)}
            </p>
          </div>
        </div>

        {/* Progress bar to 3 months */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant">
            <span>Progreso hacia meta mínima:</span>
            <span className="font-bold text-on-surface">{progressTo3Months}%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary-fixed shadow-sm transition-all duration-500"
              style={{ width: `${progressTo3Months}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-body-sm">
        <Icon className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <p className="text-on-surface text-xs leading-relaxed font-medium">
          {badge.text}
        </p>
      </div>
    </div>
  )
}
