import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Account,
  Category,
  CreateAccountInput,
  CreateCategoryInput,
  CreateDebtInput,
  CreateGoalInput,
  CreateTransactionInput,
  Debt,
  Goal,
  Profile,
  Transaction,
} from '@/types'
import { useCurrencyStore } from '@/store'
import { calculateEquivalent } from '@/lib/exchangeRates'
import {
  DEMO_ACCOUNTS,
  DEMO_CATEGORIES,
  DEMO_DEBTS,
  DEMO_GOALS,
  DEMO_PROFILE,
  DEMO_TRANSACTIONS,
} from '@/lib/demoData'
import { DEFAULT_ACCOUNTS } from '@/lib/accounts'

interface DataState {
  profile: Profile
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  goals: Goal[]
  debts: Debt[]

  // Account Actions
  addAccount: (input: CreateAccountInput) => Account
  updateAccount: (id: string, updates: Partial<Account>) => void
  deleteAccount: (id: string) => void

  // Category Actions
  addCategory: (input: CreateCategoryInput) => Category

  // Transaction Actions
  addTransaction: (input: CreateTransactionInput) => Transaction
  deleteTransaction: (id: string) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void

  // Goal Actions
  addGoal: (input: CreateGoalInput) => Goal
  addGoalContribution: (goalId: string, amount: number, note?: string) => void
  deleteGoal: (id: string) => void

  // Debt Actions
  addDebt: (input: CreateDebtInput) => Debt
  addDebtPayment: (debtId: string, amount: number, note?: string) => void
  deleteDebt: (id: string) => void

  // Profile & Reset Actions
  updateProfile: (updates: Partial<Profile>) => void
  resetToDemoData: () => void
  clearAllData: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      profile: DEMO_PROFILE,
      accounts: DEMO_ACCOUNTS,
      categories: DEMO_CATEGORIES,
      transactions: DEMO_TRANSACTIONS,
      goals: DEMO_GOALS,
      debts: DEMO_DEBTS,

      addAccount: (input) => {
        const nowIso = new Date().toISOString()
        const newAccount: Account = {
          id: `acc-${Date.now()}`,
          user_id: get().profile.id,
          name: input.name.trim(),
          provider: input.provider.trim(),
          type: input.type,
          currency: input.currency,
          initial_balance: Number(input.initial_balance) || 0,
          color: input.color || '#5D39AE',
          icon: input.icon || 'Wallet',
          account_number: input.account_number?.trim() || null,
          created_at: nowIso,
          updated_at: nowIso,
        }

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }))

        return newAccount
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.id === id ? { ...acc, ...updates, updated_at: new Date().toISOString() } : acc
          ),
        }))
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((acc) => acc.id !== id),
        }))
      },

      addCategory: (input) => {
        const nowIso = new Date().toISOString()
        const group = input.group || input.type || 'expense'
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          user_id: get().profile.id,
          name: input.name.trim(),
          group,
          type: group,
          icon: input.icon || 'Tag',
          color: input.color || '#5D39AE',
          budget_limit: input.budget_limit ? Number(input.budget_limit) : null,
          subcategories: input.subcategories || [],
          tags: input.tags || [],
          created_at: nowIso,
        }

        set((state) => ({
          categories: [...state.categories, newCategory],
        }))

        return newCategory
      },

      addTransaction: (input) => {
        const categories = get().categories
        const category = categories.find((c) => c.id === input.category_id)
        const nowIso = new Date().toISOString()
        const currencyState = useCurrencyStore.getState()

        const appliedRate = input.exchange_rate || currencyState.exchangeRate
        const appliedSource = input.exchange_rate_source || currencyState.source || 'BCV'
        const appliedDate = input.exchange_rate_date || currencyState.effectiveDate || nowIso.split('T')[0]
        const equivalentAmount =
          input.equivalent_amount ??
          calculateEquivalent(Number(input.amount), input.currency, appliedRate)

        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          user_id: get().profile.id,
          type: input.type,
          amount: Number(input.amount),
          currency: input.currency,
          account_id: input.account_id || null,
          subcategory: input.subcategory || null,
          tags: input.tags || [],
          category_id: input.category_id,
          category: category,
          description: input.description || category?.name || 'Movimiento',
          date: input.date,
          exchange_rate: appliedRate,
          exchange_rate_source: appliedSource,
          exchange_rate_date: appliedDate,
          equivalent_amount: equivalentAmount,
          created_at: nowIso,
          updated_at: nowIso,
        }

        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }))

        return newTx
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }))
      },

      updateTransaction: (id, updates) => {
        const categories = get().categories
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.id === id) {
              const updated = { ...t, ...updates, updated_at: new Date().toISOString() }
              if (updates.category_id) {
                updated.category = categories.find((c) => c.id === updates.category_id)
              }
              return updated
            }
            return t
          }),
        }))
      },

      addGoal: (input) => {
        const nowIso = new Date().toISOString()
        const newGoal: Goal = {
          id: `goal-${Date.now()}`,
          user_id: get().profile.id,
          name: input.name,
          emoji: input.emoji || '🎯',
          target_amount: Number(input.target_amount),
          currency: input.currency,
          deadline: input.deadline || null,
          created_at: nowIso,
          updated_at: nowIso,
          contributions: [],
        }

        set((state) => ({
          goals: [...state.goals, newGoal],
        }))

        return newGoal
      },

      addGoalContribution: (goalId, amount, note) => {
        const nowIso = new Date().toISOString()
        const nowFormatted = new Date().toISOString().split('T')[0]
        const state = get()
        const targetGoal = state.goals.find((g) => g.id === goalId)
        if (!targetGoal) return

        const contribution = {
          id: `gc-${Date.now()}`,
          goal_id: goalId,
          user_id: state.profile.id,
          amount: Number(amount),
          currency: targetGoal.currency,
          note: note || 'Aporte a meta',
          date: nowFormatted,
          created_at: nowIso,
        }

        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  contributions: [...(g.contributions || []), contribution],
                  updated_at: nowIso,
                }
              : g
          ),
        }))
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }))
      },

      addDebt: (input) => {
        const nowIso = new Date().toISOString()
        const newDebt: Debt = {
          id: `debt-${Date.now()}`,
          user_id: get().profile.id,
          name: input.name,
          initial_amount: Number(input.initial_amount),
          currency: input.currency,
          creditor: input.creditor || null,
          due_date: input.due_date || null,
          created_at: nowIso,
          updated_at: nowIso,
          payments: [],
        }

        set((state) => ({
          debts: [...state.debts, newDebt],
        }))

        return newDebt
      },

      addDebtPayment: (debtId, amount, note) => {
        const nowIso = new Date().toISOString()
        const nowFormatted = new Date().toISOString().split('T')[0]
        const state = get()
        const targetDebt = state.debts.find((d) => d.id === debtId)
        if (!targetDebt) return

        const payment = {
          id: `dp-${Date.now()}`,
          debt_id: debtId,
          user_id: state.profile.id,
          amount: Number(amount),
          currency: targetDebt.currency,
          note: note || 'Abono a deuda',
          date: nowFormatted,
          created_at: nowIso,
        }

        set((s) => ({
          debts: s.debts.map((d) =>
            d.id === debtId
              ? {
                  ...d,
                  payments: [...(d.payments || []), payment],
                  updated_at: nowIso,
                }
              : d
          ),
        }))
      },

      deleteDebt: (id) => {
        set((state) => ({
          debts: state.debts.filter((d) => d.id !== id),
        }))
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates, updated_at: new Date().toISOString() },
        }))
      },

      resetToDemoData: () => {
        set({
          profile: DEMO_PROFILE,
          accounts: DEMO_ACCOUNTS,
          categories: DEMO_CATEGORIES,
          transactions: DEMO_TRANSACTIONS,
          goals: DEMO_GOALS,
          debts: DEMO_DEBTS,
        })
      },

      clearAllData: () => {
        set({
          accounts: DEFAULT_ACCOUNTS,
          transactions: [],
          goals: [],
          debts: [],
          profile: {
            ...get().profile,
            initial_balance_usd: 0,
            initial_balance_ves: 0,
          },
        })
      },
    }),
    {
      name: 'finly-local-storage-data',
      version: 2,
      migrate: (persistedState: any) => {
        if (!persistedState?.accounts || !Array.isArray(persistedState.accounts) || persistedState.accounts.length === 0) {
          persistedState.accounts = DEMO_ACCOUNTS
        }
        return persistedState
      },
    }
  )
)
