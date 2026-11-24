import { formatCurrency } from '@/lib/calculations'
import type { Currency } from '@/types'
import { TrendingUp, Coins, Coffee, Lightbulb, ArrowRight, Sparkles } from 'lucide-react'

interface FinancialStrategiesProps {
  surplusAdvice: {
    surplus: number
    emergencyFundShare: number
    investmentShare: number
    personalRewardShare: number
  } | null
  microExpenses: {
    total: number
    percentage: number
    items: { category: { name: string }; total: number }[]
  }
  currency: Currency
}

export function FinancialStrategiesCard({
  surplusAdvice,
  microExpenses,
  currency,
}: FinancialStrategiesProps) {
  const annualMicroSavings = microExpenses.total * 12 * 0.4 // 40% reduction projected in 1 year

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/40 text-secondary flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">Estrategias y Consejos</h2>
          <p className="text-body-sm text-on-surface-variant">
            Multiplica y protege tu dinero en el contexto venezolano
          </p>
        </div>
      </div>

      {/* Plan for monthly surplus */}
      {surplusAdvice ? (
        <div className="bg-secondary-fixed/15 border border-secondary-fixed/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-secondary flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              ¿Qué hacer con tu excedente este mes?
            </span>
            <span className="text-label-md font-bold text-secondary">
              +{formatCurrency(surplusAdvice.surplus, currency)}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Te sobró dinero este mes. Distribúyelo con la regla inteligente para hacerlo crecer:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block">50% Fondo/Ahorro</span>
              <span className="text-xs font-bold text-on-surface block mt-0.5">
                {formatCurrency(surplusAdvice.emergencyFundShare, currency)}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block">30% Inversión/USDT</span>
              <span className="text-xs font-bold text-primary block mt-0.5">
                {formatCurrency(surplusAdvice.investmentShare, currency)}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block">20% Disfrute/Meta</span>
              <span className="text-xs font-bold text-secondary block mt-0.5">
                {formatCurrency(surplusAdvice.personalRewardShare, currency)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Mes ajustado o en déficit
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            Tus gastos igualaron o superaron tus ingresos este mes. Te recomendamos pausar compras no urgentes y enfocar los próximos 15 días en recortar gastos hormiga.
          </p>
        </div>
      )}

      {/* Micro-expenses warning */}
      {microExpenses.total > 0 && (
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-on-surface">Alerta de Gastos Hormiga</span>
            </div>
            <span className="text-xs font-bold text-on-surface">
              {formatCurrency(microExpenses.total, currency)} ({microExpenses.percentage}% de gastos)
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Gastos pequeños en cafeterías, comida rápida o antojos diarios suman{' '}
            <strong className="text-on-surface">{formatCurrency(microExpenses.total, currency)}</strong> este mes.
            Si recortas solo el 40%, podrías ahorrar{' '}
            <strong className="text-secondary">{formatCurrency(annualMicroSavings, currency)} al año</strong> para tus metas.
          </p>
        </div>
      )}

      {/* Actionable Strategy Cards for Venezuela */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Estrategias sugeridas para tus fondos
        </h4>

        <div className="p-3.5 rounded-2xl border border-outline-variant/30 flex items-start gap-3 hover:bg-surface-container-low transition-colors">
          <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Coins className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-on-surface">Rendimiento en USDT sin riesgo cambiario</h5>
            <p className="text-[11.5px] text-on-surface-variant leading-relaxed">
              Mantener ahorros en bolívares genera pérdida constante frente a la tasa BCV. Colocar tus excedentes en <strong>Binance Earn Flexible (USDT)</strong> genera entre 5% y 10% anual en dólares con retiro instantáneo.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-outline-variant/30 flex items-start gap-3 hover:bg-surface-container-low transition-colors">
          <div className="w-8 h-8 rounded-xl bg-secondary-fixed/40 text-secondary flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-on-surface">Compras mayoristas anticipadas</h5>
            <p className="text-[11.5px] text-on-surface-variant leading-relaxed">
              En alimentos no perecederos y productos de hogar, adelantar las compras del mes en bultos o supermercados mayoristas te ahorra entre 15% y 25% comparado con comprar al detal a medida que suben los precios.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
