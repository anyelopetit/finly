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
  type?: CategoryGroup
  user_id: string | null // null = default system category
  budget_limit?: number | null
  subcategories?: string[]
  tags?: string[]
  created_at: string
}

export interface CreateCategoryInput {
  name: string
  icon: string
  color: string
  group?: CategoryGroup
  type?: CategoryGroup
  budget_limit?: number | null
  subcategories?: string[]
  tags?: string[]
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  // Income categories
  {
    name: 'Salario',
    icon: 'payments',
    color: '#4d6700',
    group: 'income',
    subcategories: ['Quincena', 'Bono', 'Liquidación'],
  },
  {
    name: 'Independiente',
    icon: 'work',
    color: '#4d6700',
    group: 'income',
    subcategories: ['Freelance', 'Consultoría', 'Honorarios'],
  },
  {
    name: 'Negocio',
    icon: 'storefront',
    color: '#4d6700',
    group: 'income',
    subcategories: ['Ventas', 'Comisiones', 'Servicios'],
  },
  {
    name: 'Otros ingresos',
    icon: 'add_circle',
    color: '#4d6700',
    group: 'income',
    subcategories: ['Remesas', 'Regalos', 'Intereses'],
  },
  // Expense categories
  {
    name: 'Alimentación',
    icon: 'restaurant',
    color: '#ba1a1a',
    group: 'expense',
    subcategories: ['Supermercado', 'Carnicería', 'Frutas y Verduras', 'Panadería'],
  },
  {
    name: 'Transporte',
    icon: 'directions_car',
    color: '#7653c8',
    group: 'expense',
    subcategories: ['Gasolina', 'Mantenimiento', 'Taxi/Yummy/Ridery', 'Repuestos'],
  },
  {
    name: 'Vivienda',
    icon: 'home',
    color: '#574397',
    group: 'expense',
    subcategories: ['Alquiler', 'Condominio', 'Reparaciones'],
  },
  {
    name: 'Servicios',
    icon: 'bolt',
    color: '#7653c8',
    group: 'expense',
    subcategories: ['Internet Fibra', 'Luz / Corpoelec', 'Agua', 'Telefonía'],
  },
  {
    name: 'Salud',
    icon: 'favorite',
    color: '#ba1a1a',
    group: 'expense',
    subcategories: ['Farmacia', 'Consultas', 'Seguro / Emergencias'],
  },
  {
    name: 'Entretenimiento',
    icon: 'sports_esports',
    color: '#5d39ae',
    group: 'expense',
    subcategories: ['Streaming', 'Cine', 'Juegos', 'Salidas'],
  },
  {
    name: 'Compras',
    icon: 'shopping_bag',
    color: '#7653c8',
    group: 'expense',
    subcategories: ['Ropa', 'Electrónica', 'Hogar'],
  },
  {
    name: 'Educación',
    icon: 'school',
    color: '#574397',
    group: 'expense',
    subcategories: ['Cursos', 'Libros', 'Colegiatura'],
  },
  {
    name: 'Deudas',
    icon: 'account_balance',
    color: '#ba1a1a',
    group: 'expense',
    subcategories: ['Tarjetas', 'Préstamos familiares', 'Cuotas'],
  },
  {
    name: 'Cafeterías',
    icon: 'local_cafe',
    color: '#7653c8',
    group: 'expense',
    subcategories: ['Café diario', 'Meriendas', 'Pan'],
  },
  {
    name: 'Comida a domicilio',
    icon: 'delivery_dining',
    color: '#ba1a1a',
    group: 'expense',
    subcategories: ['Almuerzo trabajo', 'Cena fin de semana', 'Antojos'],
  },
  {
    name: 'Otros gastos',
    icon: 'more_horiz',
    color: '#494452',
    group: 'expense',
    subcategories: ['Imprevistos', 'Donaciones', 'Trámites'],
  },
]

// ----- Accounts -----

export type AccountType =
  | 'cash'
  | 'bank_ve'
  | 'bank_us'
  | 'p2p_crypto'
  | 'digital_wallet'
  | 'other'

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  provider: string // e.g. 'Binance', 'Zelle', 'Banesco', 'BDV', 'Mercantil', 'Bancamiga', 'Provincial', 'PayPal', 'Zinli', 'Ubii', 'Wally', 'Efectivo USD', 'Efectivo VES'
  currency: Currency // 'USD' | 'VES'
  initial_balance: number
  color: string
  icon: string
  account_number?: string | null
  is_archived?: boolean
  created_at: string
  updated_at: string
}

export interface CreateAccountInput {
  name: string
  type: AccountType
  provider: string
  currency: Currency
  initial_balance: number
  account_number?: string | null
  color?: string
  icon?: string
}

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
  subcategory?: string | null
  tags?: string[]
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
  subcategory?: string
  tags?: string[]
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
