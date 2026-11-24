import type { LucideIcon } from 'lucide-react'
import { Landmark, Wallet, Banknote } from 'lucide-react'

export interface Account {
  id: string
  name: string
  icon: LucideIcon
}

/**
 * Lightweight accounts for the MVP. They live outside the transaction data
 * model until the accounts module lands; the movement stores the chosen id so
 * migrated data keeps its context.
 */
export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-main', name: 'Cuenta principal', icon: Wallet },
  { id: 'acc-cash', name: 'Efectivo', icon: Banknote },
  { id: 'acc-bdv', name: 'Banco de Venezuela', icon: Landmark },
]

const LAST_ACCOUNT_KEY = 'finly-last-account'

export function getLastAccountId(): string {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS[0].id
  const stored = window.localStorage.getItem(LAST_ACCOUNT_KEY)
  return DEFAULT_ACCOUNTS.some((a) => a.id === stored) ? (stored as string) : DEFAULT_ACCOUNTS[0].id
}

export function rememberLastAccountId(id: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LAST_ACCOUNT_KEY, id)
}
