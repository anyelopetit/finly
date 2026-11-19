// ============================================================
// Finly — Financial Calculations Engine
// All monetary logic is centralized here. No floats for money.
// Amounts are stored and computed as numbers with 2 decimal precision.
// ============================================================

import type {
  Transaction,
  Goal,
  GoalContribution,
  Debt,
  DebtPayment,
  Category,
  MonthlyFinancials,
  CategoryBreakdown,
  Insight,
  Currency,
} from '@/types'
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns'

// ---- Safe rounding to avoid floating point artifacts ----
export const round2 = (n: number): number => Math.round(n * 100) / 100

// ---- Currency formatters ----
export const formatUSD = (amount: number, hideSensitive = false): string => {
  if (hideSensitive) return '••••••'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatVES = (amount: number, hideSensitive = false): string => {
  if (hideSensitive) return '••••••'
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatCurrency = (
  amount: number,
  currency: Currency,
  hideSensitive = false
): string => {
  if (hideSensitive) return '••••••'
  return currency === 'USD' ? formatUSD(amount) : formatVES(amount)
}

export const formatPercent = (value: number): string => `${round2(value)}%`

// ---- Date helpers ----
export const toISODate = (date: Date): string => format(date, 'yyyy-MM-dd')
export const todayISO = (): string => toISODate(new Date())

export const getMonthRange = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1)
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export const isInMonth = (dateStr: string, year: number, month: number): boolean => {
  const date = parseISO(dateStr)
  const start = startOfMonth(new Date(year, month - 1))
  const end = endOfMonth(new Date(year, month - 1))
  return isWithinInterval(date, { start, end })
}

// ---- Transaction aggregations ----

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] => {
  return transactions.filter((t) => isInMonth(t.date, year, month))
}

export const filterByCurrency = (
  transactions: Transaction[],
  currency: Currency
): Transaction[] => {
  return transactions.filter((t) => t.currency === currency)
}

export const sumIncome = (transactions: Transaction[]): number => {
  return round2(
    transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  )
}

export const sumExpenses = (transactions: Transaction[]): number => {
  return round2(
    transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  )
}

/**
 * Available balance = initial_balance + total_income - total_expenses
 * Note: goal contributions are NOT subtracted again (they're already expenses if recorded)
 */
export const calculateAvailableBalance = (
  initialBalance: number,
  transactions: Transaction[],
  currency: Currency
): number => {
  const filtered = filterByCurrency(transactions, currency)
  const income = sumIncome(filtered)
  const expenses = sumExpenses(filtered)
  return round2(initialBalance + income - expenses)
}

/**
 * Savings rate = (income - expenses) / income * 100
 * Returns 0 if income is 0 to avoid division by zero
 */
export const calculateSavingsRate = (income: number, expenses: number): number => {
  if (income <= 0) return 0
  const netSavings = income - expenses
  if (netSavings <= 0) return 0
  return round2((netSavings / income) * 100)
}

/**
 * Monthly financials for a given month/year and currency
 */
export const getMonthlyFinancials = (
  transactions: Transaction[],
  year: number,
  month: number,
  currency: Currency
): MonthlyFinancials => {
  const monthly = filterByCurrency(filterTransactionsByMonth(transactions, year, month), currency)
  const total_income = sumIncome(monthly)
  const total_expenses = sumExpenses(monthly)
  const balance = round2(total_income - total_expenses)
  const savings_rate = calculateSavingsRate(total_income, total_expenses)

  return { year, month, total_income, total_expenses, balance, savings_rate, currency }
}

/**
 * Breakdown of expenses by category for a period
 */
export const getCategoryBreakdown = (
  transactions: Transaction[],
  categories: Category[],
  currency: Currency
): CategoryBreakdown[] => {
  const expenses = filterByCurrency(
    transactions.filter((t) => t.type === 'expense'),
    currency
  )
  const total = sumExpenses(expenses)
  if (total === 0) return []

  const grouped = new Map<string, number>()
  for (const t of expenses) {
    grouped.set(t.category_id, (grouped.get(t.category_id) ?? 0) + t.amount)
  }

  const result: CategoryBreakdown[] = []
  for (const [catId, catTotal] of grouped.entries()) {
    const category = categories.find((c) => c.id === catId)
    if (!category) continue
    const count = expenses.filter((t) => t.category_id === catId).length
    result.push({
      category,
      total: round2(catTotal),
      percentage: round2((catTotal / total) * 100),
      count,
    })
  }

  return result.sort((a, b) => b.total - a.total)
}

// ---- Goal calculations ----

export const getGoalAccumulated = (contributions: GoalContribution[]): number => {
  return round2(contributions.reduce((acc, c) => acc + c.amount, 0))
}

export const getGoalProgress = (goal: Goal): number => {
  const accumulated = getGoalAccumulated(goal.contributions ?? [])
  if (goal.target_amount <= 0) return 0
  return Math.min(100, round2((accumulated / goal.target_amount) * 100))
}

export const getGoalMonthlyNeeded = (goal: Goal): number | null => {
  if (!goal.deadline) return null
  const accumulated = getGoalAccumulated(goal.contributions ?? [])
  const remaining = goal.target_amount - accumulated
  if (remaining <= 0) return 0

  const now = new Date()
  const deadline = parseISO(goal.deadline)
  const monthsLeft = Math.max(
    1,
    (deadline.getFullYear() - now.getFullYear()) * 12 +
      (deadline.getMonth() - now.getMonth())
  )
  return round2(remaining / monthsLeft)
}

// ---- Debt calculations ----

export const getDebtPaid = (payments: DebtPayment[]): number => {
  return round2(payments.reduce((acc, p) => acc + p.amount, 0))
}

export const getDebtRemaining = (debt: Debt): number => {
  const paid = getDebtPaid(debt.payments ?? [])
  return round2(Math.max(0, debt.initial_amount - paid))
}

export const getDebtProgress = (debt: Debt): number => {
  if (debt.initial_amount <= 0) return 0
  const paid = getDebtPaid(debt.payments ?? [])
  return Math.min(100, round2((paid / debt.initial_amount) * 100))
}

// ---- Smart Insights (rule-based, no AI) ----

export const generateInsights = (
  currentMonth: MonthlyFinancials,
  prevMonth: MonthlyFinancials,
  categoryBreakdown: CategoryBreakdown[],
  goals: Goal[]
): Insight[] => {
  const insights: Insight[] = []

  // 1. Savings rate trend
  if (currentMonth.total_income > 0 && prevMonth.total_income > 0) {
    const diff = currentMonth.savings_rate - prevMonth.savings_rate
    if (diff >= 3) {
      insights.push({
        id: 'savings-rate-up',
        type: 'positive_trend',
        message: `Tu tasa de ahorro subió del ${formatPercent(prevMonth.savings_rate)} al ${formatPercent(currentMonth.savings_rate)}. ¡Excelente trabajo!`,
        value: diff,
        badge: '↑ Mejora',
      })
    } else if (diff <= -5) {
      insights.push({
        id: 'savings-rate-down',
        type: 'budget_warning',
        message: `Tu tasa de ahorro bajó del ${formatPercent(prevMonth.savings_rate)} al ${formatPercent(currentMonth.savings_rate)} este mes.`,
        value: diff,
        badge: '⚠ Atención',
      })
    }
  }

  // 2. Category spike: any category increased > 20%
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0]
    if (topCategory.percentage >= 40) {
      insights.push({
        id: 'top-category',
        type: 'category_spike',
        message: `${topCategory.category.name} representa el ${formatPercent(topCategory.percentage)} de tus gastos este mes.`,
        value: topCategory.percentage,
      })
    }
  }

  // 3. Expense reduction vs last month
  if (prevMonth.total_expenses > 0 && currentMonth.total_expenses > 0) {
    const expDiff = prevMonth.total_expenses - currentMonth.total_expenses
    const expDiffPct = round2((expDiff / prevMonth.total_expenses) * 100)
    if (expDiffPct >= 10) {
      insights.push({
        id: 'expenses-down',
        type: 'positive_trend',
        message: `Estás gastando un ${formatPercent(expDiffPct)} menos que el mes pasado. ¡Ritmo perfecto!`,
        value: expDiffPct,
        badge: 'Nuevo',
      })
    }
  }

  // 4. Goal progress nudge
  const nearGoal = goals.find((g) => {
    const pct = getGoalProgress(g)
    return pct >= 60 && pct < 100
  })
  if (nearGoal) {
    const pct = getGoalProgress(nearGoal)
    insights.push({
      id: `goal-${nearGoal.id}`,
      type: 'goal_progress',
      message: `Estás al ${formatPercent(pct)} de tu meta "${nearGoal.name}". ¡Ya casi llegas!`,
      value: pct,
      badge: '🎯 Meta',
    })
  }

  // Return first 2 most relevant insights
  return insights.slice(0, 2)
}
