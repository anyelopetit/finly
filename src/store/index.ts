import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/types'

// ---- Privacy Store: hides/shows sensitive amounts ----
interface PrivacyState {
  isHidden: boolean
  toggle: () => void
  hide: () => void
  show: () => void
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      isHidden: false,
      toggle: () => set((s) => ({ isHidden: !s.isHidden })),
      hide: () => set({ isHidden: true }),
      show: () => set({ isHidden: false }),
    }),
    { name: 'finly-privacy' }
  )
)

// ---- Currency Store: active display currency ----
interface CurrencyState {
  activeCurrency: Currency
  exchangeRate: number // 1 USD = X VES
  setActiveCurrency: (c: Currency) => void
  setExchangeRate: (rate: number) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      activeCurrency: 'USD',
      exchangeRate: 37.0, // default fallback
      setActiveCurrency: (activeCurrency) => set({ activeCurrency }),
      setExchangeRate: (exchangeRate) => set({ exchangeRate }),
    }),
    { name: 'finly-currency' }
  )
)

// ---- UI Store: global transient UI state ----
interface UIState {
  isAddTransactionOpen: boolean
  openAddTransaction: () => void
  closeAddTransaction: () => void
  activeBottomTab: string
  setActiveBottomTab: (tab: string) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isAddTransactionOpen: false,
  openAddTransaction: () => set({ isAddTransactionOpen: true }),
  closeAddTransaction: () => set({ isAddTransactionOpen: false }),
  activeBottomTab: 'inicio',
  setActiveBottomTab: (activeBottomTab) => set({ activeBottomTab }),
}))
