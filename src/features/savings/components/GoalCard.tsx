import { motion } from 'framer-motion'
import type { Goal } from '@/types'
import { formatCurrency, getGoalProgress, getGoalAccumulated, getGoalMonthlyNeeded } from '@/lib/calculations'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { usePrivacyStore } from '@/store'
import { useNavigate } from 'react-router-dom'

interface GoalCardProps {
  goal: Goal
  index?: number
  compact?: boolean
}

export function GoalCard({ goal, index = 0, compact = false }: GoalCardProps) {
  const navigate = useNavigate()
  const { isHidden } = usePrivacyStore()

  const accumulated = getGoalAccumulated(goal.contributions ?? [])
  const progress = getGoalProgress(goal)
  const monthlyNeeded = getGoalMonthlyNeeded(goal)

  return (
    <motion.div
      layoutId={`goal-${goal.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => navigate(`/metas/${goal.id}`)}
      className="bg-surface-container-low rounded-DEFAULT p-space-md space-y-3 cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-primary-fixed flex items-center justify-center text-xl">
            {goal.emoji}
          </div>
          <div>
            <p className="text-label-lg font-bold text-on-surface">{goal.name}</p>
            <p className="text-body-sm text-on-surface-variant">
              {isHidden
                ? '•••••• de ••••••'
                : `${formatCurrency(accumulated, goal.currency)} de ${formatCurrency(goal.target_amount, goal.currency)}`}
            </p>
          </div>
        </div>

        <span className="text-label-md bg-secondary-fixed text-on-secondary-fixed font-bold px-2 py-0.5 rounded-full shrink-0">
          {progress.toFixed(0)}%
        </span>
      </div>

      <ProgressBar value={progress} />

      {!compact && monthlyNeeded !== null && monthlyNeeded > 0 && (
        <p className="text-body-sm text-on-surface-variant">
          Ahorra{' '}
          <span className="font-semibold text-primary">
            {formatCurrency(monthlyNeeded, goal.currency)}
          </span>{' '}
          al mes para llegar a tiempo
        </p>
      )}
    </motion.div>
  )
}
