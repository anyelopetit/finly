import { useState } from 'react'
import { Sparkles, SlidersHorizontal, ShieldCheck, Target, TrendingUp, CreditCard } from 'lucide-react'
import { useDataStore, useCurrencyStore } from '@/store'
import { formatCurrency } from '@/lib/calculations'
import { FinancialCalibrationModal } from './FinancialCalibrationModal'
import { cn } from '@/lib/utils'

export function CalibrationBanner() {
  const { profile } = useDataStore()
  const { activeCurrency } = useCurrencyStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isCalibrated = profile.is_financial_profile_calibrated
  const income = profile.monthly_estimated_income || 0
  const fixedExpenses = profile.monthly_fixed_expenses || 0
  const priority = profile.financial_priority || 'emergency_fund'

  const priorityLabels: Record<string, string> = {
    emergency_fund: 'Fondo de Emergencia',
    debt_payoff: 'Salir de Deudas',
    investing: 'Multiplicar Ahorro',
    savings_goal: 'Meta de Compra',
  }

  return (
    <>
      {isCalibrated ? (
        <div className="rounded-2xl border border-hairline bg-surface-container-lowest p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 grid place-items-center text-primary flex-shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-bold text-on-surface">Diagnóstico Calibrado</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary-fixed-variant">
                  Personalizado
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-label-xs text-on-surface-variant font-numeric">
                <span>Ingreso base: {formatCurrency(income, activeCurrency)}</span>
                <span>•</span>
                <span>Costo de vida: {formatCurrency(fixedExpenses, activeCurrency)}/mes</span>
                <span>•</span>
                <span className="font-semibold text-primary">{priorityLabels[priority]}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-hairline bg-surface-container-low hover:bg-surface-container text-label-sm font-bold text-on-surface transition-colors self-end sm:self-center"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span>Recalibrar</span>
          </button>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-secondary-fixed/20 border border-primary/20 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-label-sm">
              <Sparkles className="h-4 w-4" />
              <span>Diagnóstico financiero a tu medida</span>
            </div>
            <h3 className="text-title-md font-bold text-on-surface">
              Calibra tus números en 1 minuto
            </h3>
            <p className="text-body-sm text-on-surface-variant max-w-md">
              Ingresa tu ingreso aproximado y costo de vida indispensable para que la regla 50/30/20 y tu fondo de emergencia reflejen tu realidad.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-label-md font-bold shadow-md hover:bg-primary/90 transition-all flex-shrink-0"
          >
            <span>Comenzar</span>
          </button>
        </div>
      )}

      <FinancialCalibrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
