import { useAnalytics } from '../hooks/useAnalytics'
import { CategoryPieChart } from '../components/CategoryPieChart'
import { MonthlyComparisonBarChart } from '../components/MonthlyComparisonBarChart'
import { AnalyticsSummaryCards } from '../components/AnalyticsSummaryCards'

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
  } = useAnalytics()

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">
            Análisis Financiero
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Entiende en qué se va tu dinero
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
              : 'text-on-surface-variant'
          }`}
        >
          Este Mes
        </button>
        <button
          onClick={() => setTimeframe('all')}
          className={`flex-1 py-1.5 rounded-full text-label-md font-bold transition-all cursor-pointer ${
            timeframe === 'all'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant'
          }`}
        >
          Histórico Total
        </button>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummaryCards
        financials={financials}
        totalExpense={totalExpense}
        activeCurrency={activeCurrency}
        activeCategoriesCount={breakdown.length}
      />

      {/* Category Pie Chart */}
      <CategoryPieChart
        breakdown={breakdown}
        chartData={chartData}
        activeCurrency={activeCurrency}
      />

      {/* Monthly Rhythm Bar Chart */}
      <MonthlyComparisonBarChart
        data={monthlyData}
        currency={activeCurrency}
      />
    </div>
  )
}
