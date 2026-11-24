import { formatCurrency, formatPercent } from '@/lib/calculations'
import type { Currency } from '@/types'
import { PieChart, CheckCircle2, AlertTriangle } from 'lucide-react'

interface Budget503020Props {
  budget: {
    needs: number
    wants: number
    savings: number
    income: number
    needsPct: number
    wantsPct: number
    savingsPct: number
  }
  currency: Currency
}

export function Budget503020Card({ budget, currency }: Budget503020Props) {
  const isNeedsGood = budget.needsPct <= 55
  const isSavingsGood = budget.savingsPct >= 15

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface">Regla 50 / 30 / 20</h2>
            <p className="text-body-sm text-on-surface-variant">Distribución óptima de tus ingresos</p>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Necesidades (50%) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-label-sm font-semibold">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              Necesidades básicas (50% sugerido)
            </span>
            <span className={budget.needsPct > 60 ? 'text-error font-bold' : 'text-on-surface'}>
              {budget.needsPct}% ({formatCurrency(budget.needs, currency)})
            </span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budget.needsPct > 60 ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, budget.needsPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Alimentación, vivienda, servicios, transporte y deudas.
          </p>
        </div>

        {/* Deseos (30%) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-label-sm font-semibold">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7653C8]" />
              Deseos y estilo de vida (30% sugerido)
            </span>
            <span className={budget.wantsPct > 35 ? 'text-amber-600 font-bold' : 'text-on-surface'}>
              {budget.wantsPct}% ({formatCurrency(budget.wants, currency)})
            </span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budget.wantsPct > 35 ? 'bg-amber-500' : 'bg-[#7653C8]'
              }`}
              style={{ width: `${Math.min(100, budget.wantsPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Cafeterías, delivery, entretenimiento y compras personales.
          </p>
        </div>

        {/* Ahorro e Inversión (20%) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-label-sm font-semibold">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              Ahorro e inversión (20% sugerido)
            </span>
            <span className="text-secondary font-bold">
              {budget.savingsPct}% ({formatCurrency(budget.savings, currency)})
            </span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary-fixed shadow-sm transition-all duration-500"
              style={{ width: `${Math.min(100, budget.savingsPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Excedente mensual para fondo de emergencia, USDT o metas.
          </p>
        </div>
      </div>

      {/* Verdict / Status */}
      <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2 text-body-sm">
        {isNeedsGood && isSavingsGood ? (
          <>
            <CheckCircle2 className="w-4.5 h-4.5 text-secondary shrink-0" />
            <span className="text-on-surface font-medium">
              ¡Tu presupuesto está en equilibrio! Tienes capacidad positiva de ahorro este mes.
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
            <span className="text-on-surface font-medium">
              {budget.needsPct > 60
                ? 'Tus gastos fijos ocupan más del 60% de tus ingresos. Revisa servicios o deudas para liberar liquidez.'
                : 'Intenta destinar al menos un 10-20% del remanente al ahorro antes de gastos discrecionales.'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
