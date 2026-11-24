import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Target,
  ArrowRight,
  ArrowLeft,
  Check,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { useDataStore, useCurrencyStore } from '@/store'
import type { Currency, FinancialPriority } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { cn } from '@/lib/utils'

interface FinancialCalibrationModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRIORITY_OPTIONS: {
  id: FinancialPriority
  title: string
  subtitle: string
  icon: typeof ShieldCheck
  color: string
}[] = [
  {
    id: 'emergency_fund',
    title: 'Crear Fondo de Emergencia',
    subtitle: 'Colchón de 3 a 6 meses de gastos fijos ante imprevistos',
    icon: ShieldCheck,
    color: '#4D6700',
  },
  {
    id: 'debt_payoff',
    title: 'Salir de Deudas',
    subtitle: 'Liquidar tarjetas de crédito, cuotas o préstamos familiares',
    icon: CreditCard,
    color: '#BA1A1A',
  },
  {
    id: 'investing',
    title: 'Multiplicar e Invertir',
    subtitle: 'Rendimientos en USDT (Binance Earn) y compras estratégicas',
    icon: TrendingUp,
    color: '#F0B90B',
  },
  {
    id: 'savings_goal',
    title: 'Meta de Compra Específica',
    subtitle: 'Ahorrar para vehículo, remodelación, viaje o tecnología',
    icon: Target,
    color: '#5D39AE',
  },
]

export function FinancialCalibrationModal({ isOpen, onClose }: FinancialCalibrationModalProps) {
  const { profile, updateProfile } = useDataStore()
  const { activeCurrency, exchangeRate } = useCurrencyStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Current values or fallback
  const [income, setIncome] = useState(
    profile.monthly_estimated_income ? String(profile.monthly_estimated_income) : '850'
  )
  const [fixedExpenses, setFixedExpenses] = useState(
    profile.monthly_fixed_expenses ? String(profile.monthly_fixed_expenses) : '350'
  )
  const [priority, setPriority] = useState<FinancialPriority>(
    profile.financial_priority || 'emergency_fund'
  )

  const parsedIncome = parseFloat(income) || 0
  const parsedExpenses = parseFloat(fixedExpenses) || 0

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3)
  }

  const handlePrev = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3)
  }

  const handleSave = () => {
    updateProfile({
      monthly_estimated_income: parsedIncome,
      monthly_fixed_expenses: parsedExpenses,
      financial_priority: priority,
      is_financial_profile_calibrated: true,
    })
    onClose()
  }

  // Quick-picks for income
  const quickIncomeOptions = [300, 600, 900, 1500, 2500]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-surface-container-lowest rounded-[28px] shadow-2xl z-10 overflow-hidden border border-hairline"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-hairline bg-surface-container-low/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-primary-fixed/40 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-title-md font-bold text-on-surface">
                      Diagnóstico Financiero Inteligente
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Paso {step} de 3 • Calibración en 1 minuto
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Step indicator bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    step >= 1 ? 'bg-primary' : 'bg-surface-container-high'
                  )}
                />
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    step >= 2 ? 'bg-primary' : 'bg-surface-container-high'
                  )}
                />
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    step === 3 ? 'bg-primary' : 'bg-surface-container-high'
                  )}
                />
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <AnimatePresence mode="wait">
                {/* STEP 1: Monthly Income */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-title-lg font-bold text-on-surface">
                        ¿Cuánto dinero entra a tu economía al mes?
                      </h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">
                        Tu salario, ingresos por honorarios o facturación promedio aproximada.
                      </p>
                    </div>

                    <div>
                      <label className="block text-label-sm font-semibold text-on-surface mb-1.5">
                        Ingreso mensual estimado ({activeCurrency})
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">
                          {activeCurrency === 'USD' ? '$' : 'Bs.'}
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          placeholder="850.00"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-container-low border border-hairline text-headline-sm font-bold text-on-surface focus:outline-none focus:border-primary font-numeric"
                        />
                      </div>
                    </div>

                    {/* Quick chips */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                        Atajos rápidos sugeridos
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {quickIncomeOptions.map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setIncome(String(val))}
                            className={cn(
                              'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
                              parsedIncome === val
                                ? 'bg-primary text-white border-primary shadow-xs'
                                : 'bg-surface-container-low text-on-surface border-hairline hover:bg-surface-container'
                            )}
                          >
                            ${val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* WHY WE ASK (Transparent Microcopy) */}
                    <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed-variant/20 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-on-secondary-fixed grid place-items-center flex-shrink-0 mt-0.5">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="text-body-xs">
                        <p className="font-bold text-on-surface">¿Por qué te pedimos esto?</p>
                        <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                          Para calcular tu <strong>capacidad de ahorro real (Regla 50/30/20)</strong> y avisarte con tiempo si tu ritmo de gasto mensual está por superar lo que ingresa antes del cierre de mes.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Cost of Living / Fixed Expenses */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-title-lg font-bold text-on-surface">
                        ¿Cuánto necesitas al mes para lo indispensable?
                      </h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">
                        Tus gastos ineludibles: comida del hogar, alquiler/condominio, servicios y salud.
                      </p>
                    </div>

                    <div>
                      <label className="block text-label-sm font-semibold text-on-surface mb-1.5">
                        Costo de vida básico mensual ({activeCurrency})
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">
                          {activeCurrency === 'USD' ? '$' : 'Bs.'}
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={fixedExpenses}
                          onChange={(e) => setFixedExpenses(e.target.value)}
                          placeholder="350.00"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-container-low border border-hairline text-headline-sm font-bold text-on-surface focus:outline-none focus:border-primary font-numeric"
                        />
                      </div>
                    </div>

                    {/* Auto-suggest button based on 50% of income */}
                    {parsedIncome > 0 && (
                      <button
                        type="button"
                        onClick={() => setFixedExpenses(String(Math.round(parsedIncome * 0.5)))}
                        className="text-label-sm font-bold text-primary hover:underline"
                      >
                        ⚡ Sugerir regla del 50%: ${Math.round(parsedIncome * 0.5)}
                      </button>
                    )}

                    {/* WHY WE ASK */}
                    <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/20 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white grid place-items-center flex-shrink-0 mt-0.5">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="text-body-xs">
                        <p className="font-bold text-on-surface">¿Por qué te pedimos esto?</p>
                        <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                          Para tu <strong>termómetro de Fondo de Emergencia</strong>: te diremos con exactitud cuántos meses de tranquilidad tienes si hoy se detienen tus ingresos o surge una urgencia médica o familiar.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Financial Priority */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-title-lg font-bold text-on-surface">
                        ¿Cuál es tu objetivo prioritario este trimestre?
                      </h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">
                        Finly adaptará las sugerencias de la pestaña de Análisis a tu situación actual.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      {PRIORITY_OPTIONS.map((opt) => {
                        const Icon = opt.icon
                        const isSelected = priority === opt.id

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPriority(opt.id)}
                            className={cn(
                              'flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all',
                              isSelected
                                ? 'bg-primary-fixed/30 border-primary shadow-xs ring-1 ring-primary'
                                : 'bg-surface-container-low border-hairline hover:bg-surface-container hover:border-outline-variant'
                            )}
                          >
                            <div
                              className="w-10 h-10 rounded-xl grid place-items-center text-white flex-shrink-0 shadow-xs"
                              style={{ backgroundColor: opt.color }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-bold text-on-surface">{opt.title}</p>
                              <p className="text-label-sm text-on-surface-variant">{opt.subtitle}</p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-primary text-white grid place-items-center flex-shrink-0">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* WHY WE ASK */}
                    <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed-variant/20 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-on-secondary-fixed grid place-items-center flex-shrink-0 mt-0.5">
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="text-body-xs">
                        <p className="font-bold text-on-surface">¿Por qué te pedimos esto?</p>
                        <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                          Para no sugerirte inversiones o compras si primero te conviene saldar deudas costosas o blindar tu fondo de emergencia contra la devaluación.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy Guarantee Note */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-on-surface-variant/80">
                <Lock className="h-3.5 w-3.5 text-secondary-fixed-variant flex-shrink-0" />
                <span>
                  Tus datos se guardan solo en tu dispositivo. Finly no comparte tu información financiera.
                </span>
              </div>
            </div>

            {/* Footer controls */}
            <div className="px-6 py-4 border-t border-hairline bg-surface-container-low/40 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-white text-label-md font-bold shadow-md hover:bg-primary/90 transition-all"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-white text-label-md font-bold shadow-md hover:bg-primary/90 transition-all"
                >
                  <Check className="h-4 w-4" />
                  Guardar Diagnóstico
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
