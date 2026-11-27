import { formatCurrency } from '@/lib/calculations'
import type { Currency } from '@/types'
import { PieChart, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'

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

  const targetNeeds = budget.income * 0.5
  const targetWants = budget.income * 0.3
  const targetSavings = budget.income * 0.2

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface">Regla 50 / 30 / 20</h2>
            <p className="text-body-sm text-on-surface-variant">Distribución óptima de tus ingresos</p>
          </div>
        </div>

        {/* Calibrated income badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-primary-fixed/20 border border-primary/20 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs font-bold text-primary font-numeric">
            Base mensual: {formatCurrency(budget.income, currency)}
          </span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Necesidades (50%) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-label-sm font-semibold">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              Necesidades básicas (50%)
            </span>
            <div className="text-right">
              <span className={budget.needsPct > 60 ? 'text-error font-bold' : 'text-on-surface font-bold'}>
                {formatCurrency(budget.needs, currency)}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium ml-1">
                de {formatCurrency(targetNeeds, currency)}
              </span>
              <span className="text-xs font-bold text-on-surface-variant ml-1.5">
                ({budget.needsPct}%)
              </span>
            </div>
          </div>
          <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budget.needsPct > 60 ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, budget.needsPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>Alimentación, vivienda, servicios, salud y deudas.</span>
            <span>Límite seguro: 50%</span>
          </div>
        </div>

        {/* Deseos (30%) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-label-sm font-semibold">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7653C8]" />
              Deseos y estilo de vida (30%)
            </span>
            <div className="text-right">
              <span className={budget.wantsPct > 35 ? 'text-amber-600 font-bold' : 'text-on-surface font-bold'}>
                {formatCurrency(budget.wants, currency)}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium ml-1">
                de {formatCurrency(targetWants, currency)}
              </span>
              <span className="text-xs font-bold text-on-surface-variant ml-1.5">
                ({budget.wantsPct}%)
              </span>
            </div>
          </div>
          <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budget.wantsPct > 35 ? 'bg-amber-500' : 'bg-[#7653C8]'
              }`}
              style={{ width: `${Math.min(100, budget.wantsPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>Cafeterías, delivery, entretenimiento y compras.</span>
            <span>Límite seguro: 30%</span>
          </div>
        </div>

        {/* Ahorro e Inversión (20%) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-label-sm font-semibold">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-variant" />
              Ahorro e inversión (20% sugerido)
            </span>
            <div className="text-right">
              <span className="text-secondary-fixed-variant font-bold">
                {formatCurrency(budget.savings, currency)}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium ml-1">
                • Meta: {formatCurrency(targetSavings, currency)}
              </span>
              <span className="text-xs font-bold text-secondary-fixed-variant ml-1.5">
                ({budget.savingsPct}%)
              </span>
            </div>
          </div>
          <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary-fixed shadow-sm transition-all duration-500"
              style={{ width: `${Math.min(100, budget.savingsPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>Excedente mensual para fondo de emergencia, USDT o metas.</span>
            <span>Meta sana: 20%</span>
          </div>
        </div>
      </div>

      {/* Verdict / Status */}
      <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2 text-body-sm">
        {isNeedsGood && isSavingsGood ? (
          <>
            <CheckCircle2 className="w-4.5 h-4.5 text-secondary shrink-0" />
            <span className="text-on-surface font-medium">
              ¡Tu presupuesto está en equilibrio! Tienes capacidad positiva de ahorro proyectada este mes.
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
            <span className="text-on-surface font-medium">
              {budget.needsPct > 60
                ? 'Tus necesidades básicas superan el 60% de tu ingreso calibrado. Revisa servicios o deudas para liberar liquidez.'
                : 'Intenta destinar al menos el 10-20% del remanente al ahorro antes de gastos discrecionales.'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
