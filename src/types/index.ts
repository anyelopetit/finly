// ============================================================
// Finly — Core TypeScript Types
// ============================================================

export type Currency = 'USD' | 'VES'

export type TransactionType = 'income' | 'expense'

export type CategoryGroup = 'income' | 'expense'

// ----- Categories -----

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  group: CategoryGroup
  user_id: string | null // null = default system category
  created_at: string
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  // Income categories
  { name: 'Salario', icon: 'payments', color: '#4d6700', group: 'income' },
  { name: 'Independiente', icon: 'work', color: '#4d6700', group: 'income' },
  { name: 'Negocio', icon: 'storefront', color: '#4d6700', group: 'income' },
  { name: 'Otros ingresos', icon: 'add_circle', color: '#4d6700', group: 'income' },
  // Expense categories
  { name: 'Alimentación', icon: 'restaurant', color: '#ba1a1a', group: 'expense' },
  { name: 'Transporte', icon: 'directions_car', color: '#7653c8', group: 'expense' },
  { name: 'Vivienda', icon: 'home', color: '#574397', group: 'expense' },
  { name: 'Servicios', icon: 'bolt', color: '#7653c8', group: 'expense' },
  { name: 'Salud', icon: 'favorite', color: '#ba1a1a', group: 'expense' },
  { name: 'Entretenimiento', icon: 'sports_esports', color: '#5d39ae', group: 'expense' },
  { name: 'Compras', icon: 'shopping_bag', color: '#7653c8', group: 'expense' },
  { name: 'Educación', icon: 'school', color: '#574397', group: 'expense' },
  { name: 'Deudas', icon: 'account_balance', color: '#ba1a1a', group: 'expense' },
  { name: 'Cafeterías', icon: 'local_cafe', color: '#7653c8', group: 'expense' },
  { name: 'Comida a domicilio', icon: 'delivery_dining', color: '#ba1a1a', group: 'expense' },
  { name: 'Otros gastos', icon: 'more_horiz', color: '#494452', group: 'expense' },
]

// ----- Transactions -----

export type RateSource = 'BCV' | 'BINANCE_P2P' | 'BANCO' | 'MANUAL'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number // stored as positive integer (cents or main unit)
  currency: Currency
  category_id: string
  category?: Category
  description: string | null
  date: string // ISO date string YYYY-MM-DD
  // Exchange rate snapshot at movement creation
  exchange_rate?: number // e.g. 919.8227 (VES per 1 USD)
  exchange_rate_source?: RateSource
  exchange_rate_date?: string // effective date of the rate (YYYY-MM-DD)
  equivalent_amount?: number // converted amount in opposite currency
  time?: string | null // optional HH:mm, only when the user sets a time
  account_id?: string | null // optional account selection
  created_at: string
  updated_at: string
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  currency: Currency
  category_id: string
  description?: string
  date: string
  exchange_rate?: number
  exchange_rate_source?: RateSource
  exchange_rate_date?: string
  equivalent_amount?: number
  time?: string | null
  account_id?: string | null
}

// ----- Savings Goals -----

export interface Goal {
  id: string
  user_id: string
  name: string
  emoji: string
  target_amount: number
  currency: Currency
  deadline: string | null // ISO date string
  created_at: string
  updated_at: string
  contributions?: GoalContribution[]
}

export interface GoalContribution {
  id: string
  goal_id: string
  user_id: string
  amount: number
  currency: Currency
  note: string | null
  date: string
  created_at: string
}

export interface CreateGoalInput {
  name: string
  emoji: string
  target_amount: number
  currency: Currency
  deadline?: string
}

// ----- Debts -----

export interface Debt {
  id: string
  user_id: string
  name: string
  initial_amount: number
  currency: Currency
  creditor: string | null
  due_date: string | null
  created_at: string
  updated_at: string
  payments?: DebtPayment[]
}

export interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount: number
  currency: Currency
  date: string
  note: string | null
  created_at: string
}

export interface CreateDebtInput {
  name: string
  initial_amount: number
  currency: Currency
  creditor?: string
  due_date?: string
}

// ----- Exchange Rates -----

export interface ExchangeRateRecord {
  id: string
  source: RateSource
  currency: 'USD' | 'EUR' | 'USDT' | 'CNY'
  price: number // VES per unit (e.g. 919.8227)
  bid?: number // only P2P
  ask?: number // only P2P
  effective_date: string // YYYY-MM-DD
  fetched_at: string // ISO timestamp
  is_stale?: boolean
}

export interface ExchangeRate {
  id: string
  from_currency: Currency
  to_currency: Currency
  rate: number // e.g. 919.82 means 1 USD = 919.82 VES
  source: RateSource | string
  date: string
  created_at: string
}

// ----- User Profile -----

export interface Profile {
  id: string
  display_name: string
  email: string
  primary_currency: Currency
  initial_balance_usd: number
  initial_balance_ves: number
  tracking_start_date: string
  created_at: string
  updated_at: string
}

// ----- Financial Calculations -----

export interface MonthlyFinancials {
  year: number
  month: number
  total_income: number
  total_expenses: number
  balance: number
  savings_rate: number
  currency: Currency
}

export interface CategoryBreakdown {
  category: Category
  total: number
  percentage: number
  count: number
}

// ----- Insights -----

export interface Insight {
  id: string
  type: 'savings_rate' | 'category_spike' | 'goal_progress' | 'positive_trend' | 'budget_warning'
  message: string
  value?: number
  badge?: string
}
