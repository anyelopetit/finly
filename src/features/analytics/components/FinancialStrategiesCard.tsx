import { formatCurrency } from '@/lib/calculations'
import type { Currency, Profile } from '@/types'
import {
  TrendingUp,
  Coins,
  Coffee,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Target,
} from 'lucide-react'

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
  profile?: Profile
}

export function FinancialStrategiesCard({
  surplusAdvice,
  microExpenses,
  currency,
  profile,
}: FinancialStrategiesProps) {
  const annualMicroSavings = microExpenses.total * 12 * 0.4
  const priority = profile?.financial_priority || 'emergency_fund'
  const fixedExpenses = profile?.monthly_fixed_expenses || 350
  const estimatedIncome = profile?.monthly_estimated_income || 850

  const renderPriorityStrategy = () => {
    switch (priority) {
      case 'emergency_fund':
        return (
          <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed/40 space-y-2">
            <div className="flex items-center gap-2 text-secondary-fixed-variant font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4.5 h-4.5 text-secondary" />
              <span>Tu estrategia prioritaria: Blindar Fondo de Emergencia</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tu costo básico mensual calibrado es de <strong className="text-on-surface">{formatCurrency(fixedExpenses, currency)}</strong>.
              Tu meta mínima de 3 meses son <strong className="text-primary font-bold">{formatCurrency(fixedExpenses * 3, currency)}</strong>.
              Te recomendamos resguardar este fondo en <strong>Binance USDT</strong> o cuenta en divisas para protegerlo de la devaluación antes de realizar compras discrecionales.
            </p>
          </div>
        )
      case 'debt_payoff':
        return (
          <div className="p-4 rounded-2xl bg-error-container/20 border border-error/30 space-y-2">
            <div className="flex items-center gap-2 text-error font-bold text-xs uppercase tracking-wider">
              <CreditCard className="w-4.5 h-4.5 text-error" />
              <span>Tu estrategia prioritaria: Liquidar Deudas</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Basado en tu ingreso calibrado de <strong className="text-on-surface">{formatCurrency(estimatedIncome, currency)}</strong>,
              destina al menos el 20% del remanente al método de amortización acelerada. Liquidar pasivos en dólares o con recargo te libera flujo de caja inmediato.
            </p>
          </div>
        )
      case 'investing':
        return (
          <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/30 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4.5 h-4.5 text-primary" />
              <span>Tu estrategia prioritaria: Multiplicar e Invertir Excedentes</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tienes tus gastos fijos bajo control. Tus excedentes en <strong>Binance Earn Flexible (USDT)</strong> rinden entre 5% y 10% anual en dólares con liquidez inmediata para compras de oportunidad o inversión productiva.
            </p>
          </div>
        )
      case 'savings_goal':
        return (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4.5 h-4.5 text-purple-600" />
              <span>Tu estrategia prioritaria: Meta de Compra Específica</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Con un margen libre mensual estimado de <strong className="text-on-surface">{formatCurrency(Math.max(0, estimatedIncome - fixedExpenses), currency)}</strong>,
              puedes programar aportes quincenales directos en la pestaña de Metas para alcanzar tu objetivo en tiempo récord sin tocar tu costo de vida.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/40 text-secondary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">Estrategias y Consejos</h2>
          <p className="text-body-sm text-on-surface-variant">
            Multiplica y protege tu dinero en el contexto venezolano
          </p>
        </div>
      </div>

      {/* Priority-based strategy card */}
      {renderPriorityStrategy()}

      {/* Plan for monthly surplus */}
      {surplusAdvice ? (
        <div className="bg-secondary-fixed/15 border border-secondary-fixed/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-secondary flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Distribución inteligente de excedente este mes
            </span>
            <span className="text-label-md font-bold text-secondary font-numeric">
              +{formatCurrency(surplusAdvice.surplus, currency)}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Te sobró dinero este mes. Distribúyelo con la regla inteligente para hacerlo crecer:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-numeric">
            <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">50% Fondo/Ahorro</span>
              <span className="text-xs font-bold text-on-surface block mt-0.5">
                {formatCurrency(surplusAdvice.emergencyFundShare, currency)}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">30% Inversión/USDT</span>
              <span className="text-xs font-bold text-primary block mt-0.5">
                {formatCurrency(surplusAdvice.investmentShare, currency)}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">20% Disfrute/Meta</span>
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
            <span className="text-xs font-bold text-on-surface font-numeric">
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
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Protección y rendimiento contra inflación
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
