import { useMemo } from 'react'
import { useDataStore } from '@/store/dataStore'
import { useCurrencyStore } from '@/store'
import {
  getMonthlyFinancials,
  getCategoryBreakdown,
  generateInsights,
} from '@/lib/calculations'

export function useDashboard() {
  const profile = useDataStore((s) => s.profile)
  const transactions = useDataStore((s) => s.transactions)
  const goals = useDataStore((s) => s.goals)
  const categories = useDataStore((s) => s.categories)
  const { activeCurrency, exchangeRate } = useCurrencyStore()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const currentFinancials = useMemo(
    () => getMonthlyFinancials(transactions, year, month, activeCurrency),
    [transactions, year, month, activeCurrency]
  )

  const prevFinancials = useMemo(
    () => getMonthlyFinancials(transactions, prevYear, prevMonth, activeCurrency),
    [transactions, prevYear, prevMonth, activeCurrency]
  )

  const breakdown = useMemo(
    () => getCategoryBreakdown(transactions, categories, activeCurrency),
    [transactions, categories, activeCurrency]
  )

  const initialBalance =
    activeCurrency === 'USD'
      ? profile?.initial_balance_usd ?? 0
      : profile?.initial_balance_ves ?? 0

  const prevBalance = initialBalance + prevFinancials.total_income - prevFinancials.total_expenses
  const currentBalance =
    initialBalance + currentFinancials.total_income - currentFinancials.total_expenses
  const changePercent =
    prevBalance > 0 ? ((currentBalance - prevBalance) / prevBalance) * 100 : 0

  // 6-month spending rhythm
  const spendingData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const m = ((month - 6 + i + 12) % 12) + 1
      const y = m > month ? year - 1 : year
      const f = getMonthlyFinancials(transactions, y, m, activeCurrency)
      return f.total_expenses
    })
  }, [transactions, month, year, activeCurrency])

  const insights = useMemo(
    () => generateInsights(currentFinancials, prevFinancials, breakdown, goals),
    [currentFinancials, prevFinancials, breakdown, goals]
  )

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  }, [transactions])

  const topGoals = useMemo(() => goals.slice(0, 2), [goals])

  return {
    profile,
    transactions,
    goals,
    categories,
    activeCurrency,
    exchangeRate,
    currentFinancials,
    prevFinancials,
    currentBalance,
    changePercent,
    spendingData,
    insights,
    recentTransactions,
    topGoals,
    hasTransactions: transactions.length > 0,
    isLoading: false,
  }
}
