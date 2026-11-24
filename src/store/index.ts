import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, ExchangeRateRecord } from '@/types'
import {
  DEFAULT_EFFECTIVE_DATE,
  DEFAULT_USD_RATE,
  INITIAL_RATES_HISTORY,
  fetchLatestBcvRates,
} from '@/lib/exchangeRates'

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

// ---- Currency Store: active display currency & BCV exchange rates ----
interface CurrencyState {
  activeCurrency: Currency
  exchangeRate: number // 1 USD = X VES
  effectiveDate: string
  source: 'BCV' | 'MANUAL' | 'BINANCE_P2P'
  isStale: boolean
  isLoadingRates: boolean
  lastSyncAt: string | null
  ratesHistory: ExchangeRateRecord[]
  setActiveCurrency: (c: Currency) => void
  setExchangeRate: (rate: number) => void
  setManualRate: (rate: number) => void
  syncRates: (force?: boolean) => Promise<void>
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      activeCurrency: 'USD',
      exchangeRate: DEFAULT_USD_RATE,
      effectiveDate: DEFAULT_EFFECTIVE_DATE,
      source: 'BCV',
      isStale: false,
      isLoadingRates: false,
      lastSyncAt: null,
      ratesHistory: INITIAL_RATES_HISTORY,

      setActiveCurrency: (activeCurrency) => set({ activeCurrency }),

      setExchangeRate: (exchangeRate) => set({ exchangeRate }),

      setManualRate: (rate) => {
        const nowIso = new Date().toISOString()
        const today = nowIso.split('T')[0]
        const manualRecord: ExchangeRateRecord = {
          id: `rate-manual-${Date.now()}`,
          source: 'MANUAL',
          currency: 'USD',
          price: rate,
          effective_date: today,
          fetched_at: nowIso,
          is_stale: false,
        }
        set((state) => ({
          exchangeRate: rate,
          source: 'MANUAL',
          isStale: false,
          ratesHistory: [manualRecord, ...state.ratesHistory],
        }))
      },

      syncRates: async (force = false) => {
        const state = get()
        const nowMs = Date.now()
        // Deduplicate requests: don't poll if synced in the last 15 minutes unless forced
        if (!force && state.lastSyncAt) {
          const lastSyncMs = new Date(state.lastSyncAt).getTime()
          if (nowMs - lastSyncMs < 15 * 60 * 1000) {
            return
          }
        }

        set({ isLoadingRates: true })
        try {
          const { usdRecord, eurRecord } = await fetchLatestBcvRates()
          const currentHistory = get().ratesHistory

          // Deduplicate: check if this effective_date + currency + source exists
          const existingIndex = currentHistory.findIndex(
            (r) =>
              r.effective_date === usdRecord.effective_date &&
              r.currency === usdRecord.currency &&
              r.source === usdRecord.source
          )

          let updatedHistory = [...currentHistory]
          if (existingIndex >= 0) {
            // Update the existing entry if price changed or update timestamp
            updatedHistory[existingIndex] = usdRecord
          } else {
            // Insert at beginning
            updatedHistory = [usdRecord, ...updatedHistory]
          }

          if (eurRecord) {
            const eurIdx = updatedHistory.findIndex(
              (r) =>
                r.effective_date === eurRecord.effective_date &&
                r.currency === eurRecord.currency &&
                r.source === eurRecord.source
            )
            if (eurIdx >= 0) {
              updatedHistory[eurIdx] = eurRecord
            } else {
              updatedHistory = [eurRecord, ...updatedHistory]
            }
          }

          set({
            exchangeRate: usdRecord.price,
            effectiveDate: usdRecord.effective_date,
            source: 'BCV',
            isStale: false,
            isLoadingRates: false,
            lastSyncAt: new Date().toISOString(),
            ratesHistory: updatedHistory,
          })
        } catch (err) {
          console.warn('[BCV Rate Sync] Could not fetch latest rate, using fallback cached value:', err)
          // Keep last good value and mark as stale
          set({
            isStale: true,
            isLoadingRates: false,
          })
        }
      },
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
  lastCreatedTransactionId: string | null
  setLastCreatedTransactionId: (id: string | null) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isAddTransactionOpen: false,
  openAddTransaction: () => set({ isAddTransactionOpen: true }),
  closeAddTransaction: () => set({ isAddTransactionOpen: false }),
  activeBottomTab: 'inicio',
  setActiveBottomTab: (activeBottomTab) => set({ activeBottomTab }),
  lastCreatedTransactionId: null,
  setLastCreatedTransactionId: (lastCreatedTransactionId) => set({ lastCreatedTransactionId }),
}))

export { useDataStore } from './dataStore'
