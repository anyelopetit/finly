import { useMemo, useState } from 'react'
import { useDataStore } from '@/store/dataStore'
import { useCurrencyStore, usePrivacyStore } from '@/store'
import {
  getCategoryBreakdown,
  getMonthlyFinancials,
} from '@/lib/calculations'

export function useAnalytics() {
  const { transactions, categories } = useDataStore()
  const { activeCurrency } = useCurrencyStore()
  const { isHidden } = usePrivacyStore()

  const [timeframe, setTimeframe] = useState<'month' | 'all'>('month')

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const filteredTransactions = useMemo(() => {
    if (timeframe === 'all') return transactions
    return transactions.filter((t) => {
      const [y, m] = t.date.split('-').map(Number)
      return y === currentYear && m === currentMonth
    })
  }, [transactions, timeframe, currentYear, currentMonth])

  const breakdown = useMemo(() => {
    return getCategoryBreakdown(filteredTransactions, categories, activeCurrency)
  }, [filteredTransactions, categories, activeCurrency])

  const chartData = useMemo(() => {
    return breakdown.map((b) => ({
      name: b.category.name,
      value: b.total,
    }))
  }, [breakdown])

  const totalExpense = useMemo(() => {
    return breakdown.reduce((acc, b) => acc + b.total, 0)
  }, [breakdown])

  const monthlyData = useMemo(() => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return Array.from({ length: 4 }, (_, i) => {
      const m = ((currentMonth - 4 + i + 12) % 12) + 1
      const y = m > currentMonth ? currentYear - 1 : currentYear
      const f = getMonthlyFinancials(transactions, y, m, activeCurrency)
      return {
        month: monthNames[m - 1],
        Ingresos: f.total_income,
        Gastos: f.total_expenses,
      }
    })
  }, [transactions, currentMonth, currentYear, activeCurrency])

  const financials = useMemo(() => {
    return getMonthlyFinancials(transactions, currentYear, currentMonth, activeCurrency)
  }, [transactions, currentYear, currentMonth, activeCurrency])

  return {
    timeframe,
    setTimeframe,
    breakdown,
    chartData,
    totalExpense,
    monthlyData,
    financials,
    activeCurrency,
    isHidden,
  }
}
