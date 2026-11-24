import type { Account, AccountType, Currency, Transaction } from '@/types'
export type { Account, AccountType }
import {
  Wallet,
  Landmark,
  Banknote,
  Coins,
  CreditCard,
  Smartphone,
  Zap,
  Building2,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'

export interface AccountPreset {
  id: string
  name: string
  provider: string
  type: AccountType
  currency: Currency
  color: string
  iconName: string
  description: string
}

export const ACCOUNT_PRESETS: AccountPreset[] = [
  // Cripto & P2P
  {
    id: 'preset-binance',
    name: 'Binance USDT',
    provider: 'Binance',
    type: 'p2p_crypto',
    currency: 'USD',
    color: '#F0B90B',
    iconName: 'Coins',
    description: 'Billetera P2P y Earn en USDT',
  },
  // Billeteras USD
  {
    id: 'preset-zelle',
    name: 'Zelle',
    provider: 'Zelle',
    type: 'bank_us',
    currency: 'USD',
    color: '#7414CA',
    iconName: 'Zap',
    description: 'Cuenta bancaria en EE. UU.',
  },
  {
    id: 'preset-paypal',
    name: 'PayPal',
    provider: 'PayPal',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#003087',
    iconName: 'CreditCard',
    description: 'Billetera digital internacional',
  },
  {
    id: 'preset-zinli',
    name: 'Zinli',
    provider: 'Zinli',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#6C2BD9',
    iconName: 'Smartphone',
    description: 'Billetera digital Visa prepagada',
  },
  {
    id: 'preset-wally',
    name: 'Wally Tech',
    provider: 'Wally',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#FF5A00',
    iconName: 'Smartphone',
    description: 'Billetera internacional en USD',
  },
  {
    id: 'preset-cash-usd',
    name: 'Efectivo USD ($)',
    provider: 'Efectivo',
    type: 'cash',
    currency: 'USD',
    color: '#4D6700',
    iconName: 'Banknote',
    description: 'Billetes físicos en dólares',
  },
  // Bancos de Venezuela (VES y Custodia $)
  {
    id: 'preset-bdv',
    name: 'Banco de Venezuela',
    provider: 'BDV',
    type: 'bank_ve',
    currency: 'VES',
    color: '#E31B23',
    iconName: 'Landmark',
    description: 'Cuenta corriente y Pago Móvil BDV',
  },
  {
    id: 'preset-banesco',
    name: 'Banesco',
    provider: 'Banesco',
    type: 'bank_ve',
    currency: 'VES',
    color: '#007A33',
    iconName: 'Landmark',
    description: 'Banesco Pago Móvil y Cuenta Verde',
  },
  {
    id: 'preset-mercantil',
    name: 'Mercantil',
    provider: 'Mercantil',
    type: 'bank_ve',
    currency: 'VES',
    color: '#003B71',
    iconName: 'Landmark',
    description: 'Cuenta corriente y Tpago Mercantil',
  },
  {
    id: 'preset-bancamiga',
    name: 'Bancamiga',
    provider: 'Bancamiga',
    type: 'bank_ve',
    currency: 'VES',
    color: '#00A3E0',
    iconName: 'Landmark',
    description: 'Cuenta Cash y Tarjeta Mastercard Débito',
  },
  {
    id: 'preset-provincial',
    name: 'BBVA Provincial',
    provider: 'Provincial',
    type: 'bank_ve',
    currency: 'VES',
    color: '#004481',
    iconName: 'Landmark',
    description: 'Provinet y Dinero Rápido',
  },
  {
    id: 'preset-ubii',
    name: 'Ubii Pagos',
    provider: 'Ubii',
    type: 'digital_wallet',
    currency: 'VES',
    color: '#E6007E',
    iconName: 'Smartphone',
    description: 'Tarjeta prepagada y cuenta digital',
  },
  {
    id: 'preset-cash-ves',
    name: 'Efectivo Bolívares',
    provider: 'Efectivo',
    type: 'cash',
    currency: 'VES',
    color: '#574397',
    iconName: 'Banknote',
    description: 'Efectivo en mano en bolívares',
  },
]

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc-main',
    user_id: 'user-demo-1',
    name: 'Cuenta Principal',
    provider: 'Efectivo',
    type: 'cash',
    currency: 'USD',
    initial_balance: 850.0,
    color: '#5D39AE',
    icon: 'Wallet',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc-binance',
    user_id: 'user-demo-1',
    name: 'Binance USDT',
    provider: 'Binance',
    type: 'p2p_crypto',
    currency: 'USD',
    initial_balance: 350.0,
    color: '#F0B90B',
    icon: 'Coins',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc-bdv',
    user_id: 'user-demo-1',
    name: 'Banco de Venezuela',
    provider: 'BDV',
    type: 'bank_ve',
    currency: 'VES',
    initial_balance: 28500.0,
    color: '#E31B23',
    icon: 'Landmark',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'acc-banesco',
    user_id: 'user-demo-1',
    name: 'Banesco Pago Móvil',
    provider: 'Banesco',
    type: 'bank_ve',
    currency: 'VES',
    initial_balance: 16500.0,
    color: '#007A33',
    icon: 'Landmark',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

const LAST_ACCOUNT_KEY = 'finly-last-account'

export function getLastAccountId(): string {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS[0].id
  const stored = window.localStorage.getItem(LAST_ACCOUNT_KEY)
  return stored || DEFAULT_ACCOUNTS[0].id
}

export function rememberLastAccountId(id: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LAST_ACCOUNT_KEY, id)
}

export function getAccountIconComponent(iconName?: string): LucideIcon {
  switch (iconName?.toLowerCase()) {
    case 'coins':
    case 'binance':
      return Coins
    case 'zap':
    case 'zelle':
      return Zap
    case 'creditcard':
    case 'paypal':
      return CreditCard
    case 'smartphone':
    case 'zinli':
    case 'ubii':
    case 'wally':
      return Smartphone
    case 'banknote':
    case 'cash':
    case 'efectivo':
      return Banknote
    case 'landmark':
    case 'bank':
    case 'bdv':
    case 'banesco':
    case 'mercantil':
    case 'bancamiga':
    case 'provincial':
      return Landmark
    case 'building':
      return Building2
    case 'dollar':
      return DollarSign
    case 'wallet':
    default:
      return Wallet
  }
}

export function getAccountTypeLabel(type: AccountType): string {
  switch (type) {
    case 'p2p_crypto':
      return 'Cripto / P2P'
    case 'bank_ve':
      return 'Banco Nacional'
    case 'bank_us':
      return 'Banco EE. UU.'
    case 'digital_wallet':
      return 'Billetera Digital'
    case 'cash':
      return 'Efectivo'
    default:
      return 'Cuenta'
  }
}

export function calculateAccountBalances(
  accounts: Account[],
  transactions: Transaction[],
  _exchangeRate: number
): Record<string, number> {
  const balances: Record<string, number> = {}

  accounts.forEach((acc) => {
    balances[acc.id] = acc.initial_balance || 0
  })

  transactions.forEach((tx) => {
    const accId = tx.account_id || (accounts[0] ? accounts[0].id : '')
    if (accId && balances[accId] !== undefined) {
      if (tx.type === 'income') {
        balances[accId] += tx.amount
      } else {
        balances[accId] -= tx.amount
      }
    }
  })

  return balances
}

