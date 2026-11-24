import { useAnalytics } from '../hooks/useAnalytics'
import { CategoryPieChart } from '../components/CategoryPieChart'
import { MonthlyComparisonBarChart } from '../components/MonthlyComparisonBarChart'
import { AnalyticsSummaryCards } from '../components/AnalyticsSummaryCards'
import { Budget503020Card } from '../components/Budget503020Card'
import { EmergencyFundCard } from '../components/EmergencyFundCard'
import { FinancialStrategiesCard } from '../components/FinancialStrategiesCard'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export default function AnalyticsPage() {
  const {
    timeframe,
    setTimeframe,
    breakdown,
    chartData,
    totalExpense,
    monthlyData,
    financials,
    activeCurrency,
    budget503020,
    emergencyFund,
    microExpenses,
    surplusAdvice,
  } = useAnalytics()

  return (
    <div className="flex flex-col w-full pb-8 space-y-5 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">
            Análisis Financiero
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Diagnóstico, ritmo de gastos y estrategias para hacer crecer tu dinero
          </p>
        </div>
      </div>

      {/* Timeframe pill selector */}
      <div className="flex p-1 bg-surface-container-low rounded-full">
        <button
          onClick={() => setTimeframe('month')}
          className={`flex-1 py-1.5 rounded-full text-label-md font-bold transition-all cursor-pointer ${
            timeframe === 'month'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Este Mes
        </button>
        <button
          onClick={() => setTimeframe('all')}
          className={`flex-1 py-1.5 rounded-full text-label-md font-bold transition-all cursor-pointer ${
            timeframe === 'all'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Histórico Total
        </button>
      </div>

      {/* 1. Summary Cards */}
      <ErrorBoundary fallbackTitle="Resumen financiero no disponible">
        <AnalyticsSummaryCards
          financials={financials}
          totalExpense={totalExpense}
          activeCurrency={activeCurrency}
          activeCategoriesCount={breakdown.length}
        />
      </ErrorBoundary>

      {/* 2. Monthly Rhythm Bar Chart (migrated from Dashboard) */}
      <ErrorBoundary fallbackTitle="Gráfico de flujo mensual no disponible">
        <MonthlyComparisonBarChart
          data={monthlyData}
          currency={activeCurrency}
        />
      </ErrorBoundary>

      {/* 3. Category Pie Chart */}
      <ErrorBoundary fallbackTitle="Gráfico de categorías no disponible">
        <CategoryPieChart
          breakdown={breakdown}
          chartData={chartData}
          activeCurrency={activeCurrency}
        />
      </ErrorBoundary>

      {/* 4. Regla 50 / 30 / 20 */}
      <ErrorBoundary fallbackTitle="Diagnóstico de presupuesto no disponible">
        <Budget503020Card
          budget={budget503020}
          currency={activeCurrency}
        />
      </ErrorBoundary>

      {/* 5. Fondo de Emergencia */}
      <ErrorBoundary fallbackTitle="Fondo de emergencia no disponible">
        <EmergencyFundCard
          fund={emergencyFund}
          currency={activeCurrency}
        />
      </ErrorBoundary>

      {/* 6. Estrategias y Consejos para Venezuela */}
      <ErrorBoundary fallbackTitle="Estrategias financieras no disponibles">
        <FinancialStrategiesCard
          surplusAdvice={surplusAdvice}
          microExpenses={microExpenses}
          currency={activeCurrency}
        />
      </ErrorBoundary>
    </div>
  )
}
