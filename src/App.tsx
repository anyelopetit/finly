import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useCurrencyStore } from '@/store'

import { DashboardPage } from '@/features/dashboard'
import {
  TransactionsPage,
  TransactionDetailPage,
  AddTransactionModal,
} from '@/features/transactions'
import { SavingsPage, GoalDetailPage } from '@/features/savings'
import { AnalyticsPage } from '@/features/analytics'
import { ProfilePage } from '@/features/profile'
import { OnboardingPage } from '@/features/onboarding'

export default function App() {
  const location = useLocation()
  const isOnboarding = location.pathname === '/onboarding'
  const syncRates = useCurrencyStore((s) => s.syncRates)

  useEffect(() => {
    // Sincronizar tasa BCV en background con cacheo inteligente de 15 minutos
    syncRates().catch(() => {
      // Ignorar silenciosamente si no hay red, mantendrá el último valor bueno (stale)
    })
  }, [syncRates])

  return (
    <>
      <Routes>
        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />

        {/* Transactions */}
        <Route
          path="/movimientos"
          element={
            <AppShell>
              <TransactionsPage />
            </AppShell>
          }
        />
        <Route
          path="/movimientos/:id"
          element={
            <AppShell hideNav>
              <TransactionDetailPage />
            </AppShell>
          }
        />

        {/* Savings & Debts */}
        <Route
          path="/metas"
          element={
            <AppShell>
              <SavingsPage />
            </AppShell>
          }
        />
        <Route
          path="/metas/:id"
          element={
            <AppShell hideNav>
              <GoalDetailPage />
            </AppShell>
          }
        />

        {/* Analytics */}
        <Route
          path="/analisis"
          element={
            <AppShell>
              <AnalyticsPage />
            </AppShell>
          }
        />

        {/* Profile / Settings */}
        <Route
          path="/perfil"
          element={
            <AppShell>
              <ProfilePage />
            </AppShell>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Add Transaction Modal with shared element transition */}
      {!isOnboarding && <AddTransactionModal />}
    </>
  )
}
