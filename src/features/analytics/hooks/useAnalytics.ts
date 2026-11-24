import { useMemo, useState } from 'react'
import { useDataStore } from '@/store/dataStore'
import { useCurrencyStore, usePrivacyStore } from '@/store'
import {
  getCategoryBreakdown,
  getMonthlyFinancials,
  calculateAvailableBalance,
} from '@/lib/calculations'

export function useAnalytics() {
  const { transactions, categories, profile } = useDataStore()
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
    return Array.from({ length: 6 }, (_, i) => {
      const m = ((currentMonth - 6 + i + 12) % 12) + 1
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

  // Current global balance
  const currentBalance = useMemo(() => {
    const initialBalance =
      activeCurrency === 'USD' ? profile.initial_balance_usd : profile.initial_balance_ves
    return calculateAvailableBalance(initialBalance, transactions, activeCurrency)
  }, [profile, transactions, activeCurrency])

  // Rule 50/30/20 breakdown
  const budget503020 = useMemo(() => {
    const needsCategories = new Set([
      'Alimentación',
      'Vivienda',
      'Servicios',
      'Transporte',
      'Salud',
      'Educación',
      'Deudas',
    ])

    let needs = 0
    let wants = 0

    breakdown.forEach((item) => {
      if (needsCategories.has(item.category.name)) {
        needs += item.total
      } else {
        wants += item.total
      }
    })

    const income = financials.total_income || (needs + wants)
    const savings = Math.max(0, financials.balance)

    const needsPct = income > 0 ? Math.round((needs / income) * 100) : 0
    const wantsPct = income > 0 ? Math.round((wants / income) * 100) : 0
    const savingsPct = income > 0 ? Math.round((savings / income) * 100) : 0

    return {
      needs,
      wants,
      savings,
      income,
      needsPct,
      wantsPct,
      savingsPct,
    }
  }, [breakdown, financials])

  // Emergency Fund Health
  const emergencyFund = useMemo(() => {
    // Average monthly expenses from past 3 months with data
    const nonZeroExpenses = monthlyData
      .map((d) => d.Gastos)
      .filter((g) => g > 0)

    const avgExpense = nonZeroExpenses.length > 0
      ? nonZeroExpenses.reduce((a, b) => a + b, 0) / nonZeroExpenses.length
      : financials.total_expenses || 1

    const monthsCovered = avgExpense > 0 ? currentBalance / avgExpense : 0
    const targetFund3Months = avgExpense * 3
    const targetFund6Months = avgExpense * 6

    let status: 'critical' | 'building' | 'healthy' | 'optimal' = 'critical'
    if (monthsCovered >= 6) status = 'optimal'
    else if (monthsCovered >= 3) status = 'healthy'
    else if (monthsCovered >= 1) status = 'building'

    return {
      currentBalance,
      avgMonthlyExpense: avgExpense,
      monthsCovered: Math.round(monthsCovered * 10) / 10,
      targetFund3Months,
      targetFund6Months,
      status,
    }
  }, [monthlyData, financials, currentBalance])

  // Gastos hormiga (Micro-expenses: Cafeterías, Delivery, etc.)
  const microExpenses = useMemo(() => {
    const antCategories = new Set(['Cafeterías', 'Comida a domicilio', 'Otros gastos', 'Entretenimiento'])
    const antItems = breakdown.filter((b) => antCategories.has(b.category.name))
    const totalAnts = antItems.reduce((acc, b) => acc + b.total, 0)
    const percentageOfExpenses = totalExpense > 0 ? Math.round((totalAnts / totalExpense) * 100) : 0

    return {
      total: totalAnts,
      percentage: percentageOfExpenses,
      items: antItems,
    }
  }, [breakdown, totalExpense])

  // Surplus allocation recommendations
  const surplusAdvice = useMemo(() => {
    const surplus = financials.balance
    if (surplus <= 0) return null

    return {
      surplus,
      emergencyFundShare: surplus * 0.5, // 50%
      investmentShare: surplus * 0.3,    // 30%
      personalRewardShare: surplus * 0.2, // 20%
    }
  }, [financials.balance])

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
    currentBalance,
    budget503020,
    emergencyFund,
    microExpenses,
    surplusAdvice,
  }
}
