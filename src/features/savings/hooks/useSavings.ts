import { useMemo, useState } from 'react'
import { useDataStore } from '@/store/dataStore'
import { useCurrencyStore, usePrivacyStore } from '@/store'
import { getGoalAccumulated, getDebtRemaining } from '@/lib/calculations'

export function useSavings() {
  const {
    goals,
    debts,
    addGoal,
    addDebt,
    addGoalContribution,
    addDebtPayment,
    deleteGoal,
    deleteDebt,
  } = useDataStore()

  const { activeCurrency } = useCurrencyStore()
  const { isHidden } = usePrivacyStore()

  const [activeTab, setActiveTab] = useState<'goals' | 'debts'>('goals')

  const totalGoalTarget = useMemo(
    () => goals.reduce((acc, g) => acc + g.target_amount, 0),
    [goals]
  )

  const totalGoalSaved = useMemo(
    () => goals.reduce((acc, g) => acc + getGoalAccumulated(g.contributions || []), 0),
    [goals]
  )

  const totalDebtRemaining = useMemo(
    () => debts.reduce((acc, d) => acc + getDebtRemaining(d), 0),
    [debts]
  )

  return {
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
    deleteGoal,
    deleteDebt,
  }
}
