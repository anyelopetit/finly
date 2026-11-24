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
  // ==========================================
  // DÓLARES (USD)
  // ==========================================
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
  {
    id: 'preset-airtm',
    name: 'Airtm',
    provider: 'Airtm',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#0052FF',
    iconName: 'Smartphone',
    description: 'Billetera digital y P2P en AirUSD',
  },
  {
    id: 'preset-bancamiga-usd',
    name: 'Bancamiga (Cuenta Cash USD)',
    provider: 'Bancamiga',
    type: 'bank_ve',
    currency: 'USD',
    color: '#00A3E0',
    iconName: 'Landmark',
    description: 'Cuenta en moneda extranjera y tarjeta internacional',
  },
  {
    id: 'preset-bdv-usd',
    name: 'Banco de Venezuela (Cuenta USD)',
    provider: 'BDV',
    type: 'bank_ve',
    currency: 'USD',
    color: '#E31B23',
    iconName: 'Landmark',
    description: 'Cuenta en divisas y custodia BDV',
  },
  {
    id: 'preset-banesco-pa',
    name: 'Banesco Panamá',
    provider: 'Banesco Panamá',
    type: 'bank_us',
    currency: 'USD',
    color: '#007A33',
    iconName: 'Building2',
    description: 'Cuenta simplificada e internacional en Panamá',
  },
  {
    id: 'preset-banesco-verde',
    name: 'Banesco (Cuenta Verde USD)',
    provider: 'Banesco',
    type: 'bank_ve',
    currency: 'USD',
    color: '#007A33',
    iconName: 'Landmark',
    description: 'Cuenta especial en dólares en Banesco',
  },
  {
    id: 'preset-boa',
    name: 'Bank of America',
    provider: 'Bank of America',
    type: 'bank_us',
    currency: 'USD',
    color: '#00529B',
    iconName: 'Landmark',
    description: 'Cuenta bancaria en Estados Unidos',
  },
  {
    id: 'preset-binance',
    name: 'Binance USDT',
    provider: 'Binance',
    type: 'p2p_crypto',
    currency: 'USD',
    color: '#F0B90B',
    iconName: 'Coins',
    description: 'Billetera P2P, Spot y Earn en USDT',
  },
  {
    id: 'preset-bitget',
    name: 'Bitget USDT',
    provider: 'Bitget',
    type: 'p2p_crypto',
    currency: 'USD',
    color: '#00F0FF',
    iconName: 'Coins',
    description: 'Exchange y P2P de criptomonedas',
  },
  {
    id: 'preset-bybit',
    name: 'Bybit USDT',
    provider: 'Bybit',
    type: 'p2p_crypto',
    currency: 'USD',
    color: '#F7A600',
    iconName: 'Coins',
    description: 'Billetera cripto y mercado P2P',
  },
  {
    id: 'preset-chase',
    name: 'Chase Bank',
    provider: 'Chase',
    type: 'bank_us',
    currency: 'USD',
    color: '#117ACA',
    iconName: 'Landmark',
    description: 'Cuenta bancaria en EE. UU.',
  },
  {
    id: 'preset-facebank',
    name: 'Facebank',
    provider: 'Facebank',
    type: 'bank_us',
    currency: 'USD',
    color: '#003366',
    iconName: 'Building2',
    description: 'Banco internacional en Puerto Rico / EE. UU.',
  },
  {
    id: 'preset-kucoin',
    name: 'KuCoin',
    provider: 'KuCoin',
    type: 'p2p_crypto',
    currency: 'USD',
    color: '#24AE8F',
    iconName: 'Coins',
    description: 'Criptoactivos y USDT P2P',
  },
  {
    id: 'preset-mony',
    name: 'Mercantil Panamá (Mony)',
    provider: 'Mercantil Panamá',
    type: 'bank_us',
    currency: 'USD',
    color: '#003B71',
    iconName: 'Smartphone',
    description: 'Billetera Mony y cuenta bancaria en Panamá',
  },
  {
    id: 'preset-mercantil-usd',
    name: 'Mercantil (Cuenta USD)',
    provider: 'Mercantil',
    type: 'bank_ve',
    currency: 'USD',
    color: '#003B71',
    iconName: 'Landmark',
    description: 'Cuenta en moneda extranjera Mercantil',
  },
  {
    id: 'preset-neteller',
    name: 'Neteller',
    provider: 'Neteller',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#86B817',
    iconName: 'CreditCard',
    description: 'Billetera electrónica internacional',
  },
  {
    id: 'preset-payoneer',
    name: 'Payoneer',
    provider: 'Payoneer',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#FF4800',
    iconName: 'CreditCard',
    description: 'Cuenta para cobros internacionales y tarjeta prepagada',
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
    id: 'preset-revolut',
    name: 'Revolut',
    provider: 'Revolut',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#191C1F',
    iconName: 'CreditCard',
    description: 'Neobanco digital multimoneda',
  },
  {
    id: 'preset-skrill',
    name: 'Skrill',
    provider: 'Skrill',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#811246',
    iconName: 'CreditCard',
    description: 'Billetera virtual en dólares y euros',
  },
  {
    id: 'preset-strike',
    name: 'Strike',
    provider: 'Strike',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#000000',
    iconName: 'Zap',
    description: 'Envío de dinero y dólares digitales por Lightning',
  },
  {
    id: 'preset-uphold',
    name: 'Uphold',
    provider: 'Uphold',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#49CC6A',
    iconName: 'CreditCard',
    description: 'Plataforma multiactivo en dólares',
  },
  {
    id: 'preset-wally',
    name: 'Wally Tech',
    provider: 'Wally',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#FF5A00',
    iconName: 'Smartphone',
    description: 'Billetera digital internacional en USD',
  },
  {
    id: 'preset-wells-fargo',
    name: 'Wells Fargo',
    provider: 'Wells Fargo',
    type: 'bank_us',
    currency: 'USD',
    color: '#D71E28',
    iconName: 'Landmark',
    description: 'Cuenta bancaria en EE. UU.',
  },
  {
    id: 'preset-wise',
    name: 'Wise (TransferWise)',
    provider: 'Wise',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#9FE870',
    iconName: 'CreditCard',
    description: 'Cuenta multidivisa internacional',
  },
  {
    id: 'preset-zelle',
    name: 'Zelle',
    provider: 'Zelle',
    type: 'bank_us',
    currency: 'USD',
    color: '#7414CA',
    iconName: 'Zap',
    description: 'Transferencias bancarias en EE. UU.',
  },
  {
    id: 'preset-zinli',
    name: 'Zinli',
    provider: 'Zinli',
    type: 'digital_wallet',
    currency: 'USD',
    color: '#6C2BD9',
    iconName: 'Smartphone',
    description: 'Billetera digital Visa prepagada en USD',
  },

  // ==========================================
  // BOLÍVARES (VES)
  // ==========================================
  {
    id: 'preset-cash-ves',
    name: 'Efectivo Bolívares (Bs.)',
    provider: 'Efectivo',
    type: 'cash',
    currency: 'VES',
    color: '#574397',
    iconName: 'Banknote',
    description: 'Efectivo en mano en bolívares',
  },
  {
    id: 'preset-100-banco',
    name: '100% Banco',
    provider: '100% Banco',
    type: 'bank_ve',
    currency: 'VES',
    color: '#105099',
    iconName: 'Landmark',
    description: 'Cuenta corriente y Pago Móvil 100% Banco',
  },
  {
    id: 'preset-bancamiga',
    name: 'Bancamiga',
    provider: 'Bancamiga',
    type: 'bank_ve',
    currency: 'VES',
    color: '#00A3E0',
    iconName: 'Landmark',
    description: 'Cuenta corriente, Pago Móvil y Tarjeta Débito',
  },
  {
    id: 'preset-bancaribe',
    name: 'Bancaribe',
    provider: 'Bancaribe',
    type: 'bank_ve',
    currency: 'VES',
    color: '#002B49',
    iconName: 'Landmark',
    description: 'Mi Conexión Bancaribe y Pago Móvil',
  },
  {
    id: 'preset-banco-activo',
    name: 'Banco Activo',
    provider: 'Banco Activo',
    type: 'bank_ve',
    currency: 'VES',
    color: '#E36D00',
    iconName: 'Landmark',
    description: 'Cuenta corriente y Activo Móvil',
  },
  {
    id: 'preset-bav',
    name: 'Banco Agrícola de Venezuela',
    provider: 'BAV',
    type: 'bank_ve',
    currency: 'VES',
    color: '#156524',
    iconName: 'Landmark',
    description: 'Banco Agrícola en línea y Pago Móvil',
  },
  {
    id: 'preset-bicentenario',
    name: 'Banco Bicentenario',
    provider: 'Banco Bicentenario',
    type: 'bank_ve',
    currency: 'VES',
    color: '#1A4F98',
    iconName: 'Landmark',
    description: 'Bicentenario en Línea y Tu Pago Móvil',
  },
  {
    id: 'preset-caroni',
    name: 'Banco Caroní',
    provider: 'Banco Caroní',
    type: 'bank_ve',
    currency: 'VES',
    color: '#003366',
    iconName: 'Landmark',
    description: 'Click Caroní y Pago Móvil',
  },
  {
    id: 'preset-bdv',
    name: 'Banco de Venezuela (BDV)',
    provider: 'BDV',
    type: 'bank_ve',
    currency: 'VES',
    color: '#E31B23',
    iconName: 'Landmark',
    description: 'Cuenta corriente y BDVenlínea Pago Móvil',
  },
  {
    id: 'preset-tesoro',
    name: 'Banco del Tesoro',
    provider: 'Banco del Tesoro',
    type: 'bank_ve',
    currency: 'VES',
    color: '#C4161C',
    iconName: 'Landmark',
    description: 'Tesoro en Línea y Tesoro Pago Móvil',
  },
  {
    id: 'preset-exterior',
    name: 'Banco Exterior',
    provider: 'Banco Exterior',
    type: 'bank_ve',
    currency: 'VES',
    color: '#00386B',
    iconName: 'Landmark',
    description: 'Exterior NEXO y Pago Móvil',
  },
  {
    id: 'preset-bfc',
    name: 'Banco Fondo Común (BFC)',
    provider: 'BFC',
    type: 'bank_ve',
    currency: 'VES',
    color: '#00529C',
    iconName: 'Landmark',
    description: 'BFC en Línea y BFC Móvil',
  },
  {
    id: 'preset-mercantil',
    name: 'Banco Mercantil',
    provider: 'Mercantil',
    type: 'bank_ve',
    currency: 'VES',
    color: '#003B71',
    iconName: 'Landmark',
    description: 'Cuenta corriente y Tpago Mercantil',
  },
  {
    id: 'preset-bnc',
    name: 'Banco Nacional de Crédito (BNC)',
    provider: 'BNC',
    type: 'bank_ve',
    currency: 'VES',
    color: '#006432',
    iconName: 'Landmark',
    description: 'BNCNET y BNC Pago Móvil',
  },
  {
    id: 'preset-plaza',
    name: 'Banco Plaza',
    provider: 'Banco Plaza',
    type: 'bank_ve',
    currency: 'VES',
    color: '#00833E',
    iconName: 'Landmark',
    description: 'Tu Plaza en Línea y Tu Pago Plaza',
  },
  {
    id: 'preset-sofitasa',
    name: 'Banco Sofitasa',
    provider: 'Sofitasa',
    type: 'bank_ve',
    currency: 'VES',
    color: '#004380',
    iconName: 'Landmark',
    description: 'Sofinet y Sofimóvil Pago',
  },
  {
    id: 'preset-bvc',
    name: 'Banco Venezolano de Crédito (BVC)',
    provider: 'BVC',
    type: 'bank_ve',
    currency: 'VES',
    color: '#002B49',
    iconName: 'Landmark',
    description: 'Venecredit y Vico Pago Móvil',
  },
  {
    id: 'preset-bancrecer',
    name: 'Bancrecer',
    provider: 'Bancrecer',
    type: 'bank_ve',
    currency: 'VES',
    color: '#E05A10',
    iconName: 'Landmark',
    description: 'Bancrecer en Línea y Pago Móvil',
  },
  {
    id: 'preset-banesco',
    name: 'Banesco',
    provider: 'Banesco',
    type: 'bank_ve',
    currency: 'VES',
    color: '#007A33',
    iconName: 'Landmark',
    description: 'BanescOnline y Banesco PagoMóvil',
  },
  {
    id: 'preset-banfanb',
    name: 'BANFANB',
    provider: 'BANFANB',
    type: 'bank_ve',
    currency: 'VES',
    color: '#0E4D2B',
    iconName: 'Landmark',
    description: 'BANFANB en Línea y Pago Móvil',
  },
  {
    id: 'preset-banplus',
    name: 'Banplus',
    provider: 'Banplus',
    type: 'bank_ve',
    currency: 'VES',
    color: '#003366',
    iconName: 'Landmark',
    description: 'Banplus On Line y PagoPlus',
  },
  {
    id: 'preset-provincial',
    name: 'BBVA Provincial',
    provider: 'Provincial',
    type: 'bank_ve',
    currency: 'VES',
    color: '#004481',
    iconName: 'Landmark',
    description: 'Provinet y Dinero Rápido Pago Móvil',
  },
  {
    id: 'preset-mi-banco',
    name: 'Mi Banco',
    provider: 'Mi Banco',
    type: 'bank_ve',
    currency: 'VES',
    color: '#00857C',
    iconName: 'Landmark',
    description: 'Mi Banco en Línea y Mi Pago',
  },
  {
    id: 'preset-pago-movil',
    name: 'Pago Móvil (Interbancario)',
    provider: 'Pago Móvil',
    type: 'bank_ve',
    currency: 'VES',
    color: '#5D39AE',
    iconName: 'Smartphone',
    description: 'Pagos móviles interbancarios P2P / C2P',
  },
  {
    id: 'preset-pos-ves',
    name: 'Punto de Venta / Débito',
    provider: 'Tarjeta Débito',
    type: 'bank_ve',
    currency: 'VES',
    color: '#006688',
    iconName: 'CreditCard',
    description: 'Cobros y pagos por terminal POS',
  },
  {
    id: 'preset-ubii',
    name: 'Ubii Pagos',
    provider: 'Ubii',
    type: 'digital_wallet',
    currency: 'VES',
    color: '#E6007E',
    iconName: 'Smartphone',
    description: 'Ubii App, tarjeta prepagada y Pago Móvil',
  },
  {
    id: 'preset-vippo',
    name: 'Vippo',
    provider: 'Vippo',
    type: 'digital_wallet',
    currency: 'VES',
    color: '#6C2BD9',
    iconName: 'Smartphone',
    description: 'Billetera electrónica de pagos en bolívares',
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

export function getSortedAccountPresets(currency: Currency): AccountPreset[] {
  const presetsForCurrency = ACCOUNT_PRESETS.filter((p) => p.currency === currency)
  const cashPreset = presetsForCurrency.find((p) => p.type === 'cash')
  const otherPresets = presetsForCurrency
    .filter((p) => p.type !== 'cash')
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))

  return cashPreset ? [cashPreset, ...otherPresets] : otherPresets
}


