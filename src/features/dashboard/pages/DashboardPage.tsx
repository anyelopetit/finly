import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrivacyStore, useUIStore } from '@/store'
import { useDashboard } from '../hooks/useDashboard'
import { HeroBalanceCard } from '../components/HeroBalanceCard'
import { SpendingBars } from '../components/SpendingBars'
import { AccountsCarouselCard } from '@/features/accounts/components/AccountsCarouselCard'
import { FinancialSummaryPills } from '../components/FinancialSummaryPills'
import { TransactionItem } from '@/features/transactions'
import { GoalCard } from '@/features/savings'
import { InsightCard, InsightPlaceholder } from '@/components/common/InsightCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { formatPercent } from '@/lib/calculations'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PiggyBank, PlusCircle } from 'lucide-react'

export default function DashboardPage() {
  const { isHidden } = usePrivacyStore()
  const { openAddTransaction } = useUIStore()

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'
  const dateLabel = format(now, "EEEE, d 'de' MMMM", { locale: es })

  const {
    profile,
    activeCurrency,
    exchangeRate,
    currentFinancials,
    prevFinancials,
    currentBalance,
    changePercent,
    spendingData,
    insights,
    recentTransactions,
    topGoals,
    hasTransactions,
  } = useDashboard()

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 pt-1">
      {/* 1. Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold capitalize">
            {dateLabel}
          </span>
          <h1 className="text-headline-lg text-on-surface tracking-tight mt-0.5 flex items-center gap-1.5">
            {greeting}{profile?.display_name ? `, ${profile.display_name}` : ''} 👋
          </h1>
        </div>
      </div>

      {/* 2. Hero Balance Card */}
      <HeroBalanceCard
        balance={currentBalance}
        changePercent={changePercent}
        currency={activeCurrency}
        exchangeRate={exchangeRate}
      />

      {/* 3. Monthly Income / Expense pills */}
      <FinancialSummaryPills
        currentFinancials={currentFinancials}
        prevFinancials={prevFinancials}
        currency={activeCurrency}
      />

      {/* 4. Recent transactions — positioned directly after balance and monthly financials */}
      <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-headline-sm font-bold text-on-surface">Movimientos Recientes</h2>
            <span className="text-label-sm font-semibold bg-surface-container-low text-primary px-2 py-0.5 rounded-full">
              Últimos {recentTransactions.length}
            </span>
          </div>
          <Link to="/movimientos" className="text-label-sm text-primary font-bold hover:underline">
            Ver historial
          </Link>
        </div>

        {!hasTransactions ? (
          <EmptyState
            icon="receipt"
            title="¡Empecemos!"
            description="Registra tu primer ingreso o gasto para conocer mejor tus finanzas."
            actionLabel="Registrar movimiento"
          />
        ) : (
          <motion.div layout className="space-y-1">
            <AnimatePresence initial={false}>
              {recentTransactions.map((t, i) => (
                <TransactionItem key={t.id} transaction={t} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* 5. Accounts overview */}
      <AccountsCarouselCard />

      {/* 6. Smart insight */}
      {insights.length > 0 ? (
        <InsightCard insight={insights[0]} />
      ) : (
        <InsightPlaceholder />
      )}

      {/* 7. Goals summary */}
      {topGoals.length > 0 && (
        <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-on-secondary-container">
                <PiggyBank className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface">Ahorro y Metas</h2>
                <span className="text-label-sm text-on-surface-variant">
                  {isHidden ? '••••%%' : `Tasa de ahorro: ${formatPercent(currentFinancials.savings_rate)}`}
                </span>
              </div>
            </div>
            <Link to="/metas" className="text-label-sm text-primary font-bold">
              Ver todas
            </Link>
          </div>
          {topGoals.map((goal, i) => (
            <GoalCard key={goal.id} goal={goal} index={i} compact />
          ))}
        </div>
      )}

      {/* 8. Full-width CTA button */}
      <Button
        variant="secondary"
        fullWidth
        size="lg"
        onClick={openAddTransaction}
        className="shadow-fab"
      >
        <PlusCircle className="w-5 h-5 mr-1" />
        Registrar Nuevo Movimiento
      </Button>
    </div>
  )
}
