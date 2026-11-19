import { useState } from 'react'
import { useSavings } from '../hooks/useSavings'
import { GoalCard } from '../components/GoalCard'
import { DebtCard } from '../components/DebtCard'
import { NewGoalModal } from '../components/NewGoalModal'
import { NewDebtModal } from '../components/NewDebtModal'
import { ContributeModal } from '../components/ContributeModal'
import { PayDebtModal } from '../components/PayDebtModal'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency } from '@/lib/calculations'
import { Plus, PiggyBank, CreditCard } from 'lucide-react'

export default function SavingsPage() {
  const {
    goals,
    debts,
    activeTab,
    setActiveTab,
    activeCurrency,
    isHidden,
    totalGoalTarget,
    totalGoalSaved,
    totalDebtRemaining,
    addGoal,
    addDebt,
    addGoalContribution,
    addDebtPayment,
  } = useSavings()

  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false)
  const [isNewDebtOpen, setIsNewDebtOpen] = useState(false)
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null)
  const [payDebtId, setPayDebtId] = useState<string | null>(null)

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">
            Metas y Deudas
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Planifica tu ahorro y mantén el control
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => (activeTab === 'goals' ? setIsNewGoalOpen(true) : setIsNewDebtOpen(true))}
        >
          <Plus className="w-4 h-4 mr-0.5" />
          {activeTab === 'goals' ? 'Nueva Meta' : 'Nueva Deuda'}
        </Button>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-br from-primary via-primary-container to-primary text-white rounded-3xl p-6 shadow-hero space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-label-sm text-surface-container-high uppercase tracking-wider font-semibold">
              {activeTab === 'goals' ? 'Ahorro Acumulado en Metas' : 'Deuda Total Pendiente'}
            </span>
            <h2 className="text-display font-black mt-1">
              {isHidden
                ? '••••••'
                : activeTab === 'goals'
                ? formatCurrency(totalGoalSaved, activeCurrency)
                : formatCurrency(totalDebtRemaining, activeCurrency)}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            {activeTab === 'goals' ? (
              <PiggyBank className="w-7 h-7" />
            ) : (
              <CreditCard className="w-7 h-7" />
            )}
          </div>
        </div>

        {activeTab === 'goals' && totalGoalTarget > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-body-sm text-surface-container-high">
              <span>Meta total: {formatCurrency(totalGoalTarget, activeCurrency)}</span>
              <span className="font-bold text-secondary-fixed">
                {((totalGoalSaved / totalGoalTarget) * 100).toFixed(0)}%
              </span>
            </div>
            <ProgressBar
              value={(totalGoalSaved / totalGoalTarget) * 100}
              barClassName="bg-secondary-fixed"
              trackClassName="bg-white/20"
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-surface-container-low rounded-full">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2 rounded-full text-label-md font-bold transition-all cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant'
          }`}
        >
          Metas de Ahorro ({goals.length})
        </button>
        <button
          onClick={() => setActiveTab('debts')}
          className={`flex-1 py-2 rounded-full text-label-md font-bold transition-all cursor-pointer ${
            activeTab === 'debts'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant'
          }`}
        >
          Deudas ({debts.length})
        </button>
      </div>

      {/* Content List */}
      {activeTab === 'goals' ? (
        goals.length === 0 ? (
          <EmptyState
            icon="piggy"
            title="Aún no tienes metas"
            description="Crea tu primer objetivo de ahorro para comprar algo que deseas o crear un fondo de emergencia."
            actionLabel="Crear mi primera meta"
            onAction={() => setIsNewGoalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {goals.map((goal, idx) => (
              <div key={goal.id} className="relative group">
                <GoalCard goal={goal} index={idx} />
                <div className="mt-2 flex justify-end gap-2 px-1">
                  <button
                    onClick={() => setContributeGoalId(goal.id)}
                    className="text-label-sm font-bold text-primary bg-primary-fixed/40 px-3 py-1.5 rounded-full hover:bg-primary-fixed transition-all cursor-pointer"
                  >
                    + Aportar a esta meta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : debts.length === 0 ? (
        <EmptyState
          icon="credit_card"
          title="¡Sin deudas pendientes!"
          description="Llevar un registro ordenado de tus compromisos te ayuda a liquidarlos más rápido."
          actionLabel="Registrar deuda"
          onAction={() => setIsNewDebtOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {debts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onPay={() => setPayDebtId(debt.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NewGoalModal
        isOpen={isNewGoalOpen}
        onClose={() => setIsNewGoalOpen(false)}
        onSave={addGoal}
        activeCurrency={activeCurrency}
      />

      <NewDebtModal
        isOpen={isNewDebtOpen}
        onClose={() => setIsNewDebtOpen(false)}
        onSave={addDebt}
        activeCurrency={activeCurrency}
      />

      <ContributeModal
        goalId={contributeGoalId}
        onClose={() => setContributeGoalId(null)}
        onContribute={addGoalContribution}
      />

      <PayDebtModal
        debtId={payDebtId}
        onClose={() => setPayDebtId(null)}
        onPay={addDebtPayment}
      />
    </div>
  )
}
