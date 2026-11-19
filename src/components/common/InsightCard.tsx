import { motion } from 'framer-motion'
import type { Insight } from '@/types'
import {
  Sparkles,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  Flag,
  ArrowRight,
} from 'lucide-react'

interface InsightCardProps {
  insight: Insight
}

const typeConfig = {
  positive_trend: {
    icon: Sparkles,
    bgIcon: 'bg-primary-container text-on-primary-container',
    gradient: 'from-primary-fixed/40 via-surface-container-low to-surface-container-lowest',
  },
  savings_rate: {
    icon: PiggyBank,
    bgIcon: 'bg-secondary-container/40 text-on-secondary-container',
    gradient: 'from-secondary-fixed/20 via-surface-container-low to-surface-container-lowest',
  },
  category_spike: {
    icon: TrendingUp,
    bgIcon: 'bg-error-container/60 text-error',
    gradient: 'from-error-container/20 via-surface-container-low to-surface-container-lowest',
  },
  budget_warning: {
    icon: AlertTriangle,
    bgIcon: 'bg-error-container/60 text-error',
    gradient: 'from-error-container/20 via-surface-container-low to-surface-container-lowest',
  },
  goal_progress: {
    icon: Flag,
    bgIcon: 'bg-primary-fixed text-primary',
    gradient: 'from-primary-fixed/40 via-surface-container-low to-surface-container-lowest',
  },
}

export function InsightCard({ insight }: InsightCardProps) {
  const config = typeConfig[insight.type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`bg-gradient-to-r ${config.gradient} rounded-lg p-space-md shadow-sm flex items-start gap-space-md`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${config.bgIcon}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-label-md text-primary font-bold">Insight de Finly</span>
          {insight.badge && (
            <span className="text-label-sm bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full font-bold">
              {insight.badge}
            </span>
          )}
        </div>
        <p
          className="text-body-sm text-on-surface-variant leading-snug"
          dangerouslySetInnerHTML={{
            __html: insight.message.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="text-on-surface font-semibold">$1</strong>'
            ),
          }}
        />
      </div>

      {/* Arrow */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

// ----- Empty / placeholder insight when no data yet -----
export function InsightPlaceholder() {
  return (
    <div className="bg-gradient-to-r from-primary-fixed/30 via-surface-container-low to-surface-container-lowest rounded-lg p-space-md shadow-sm flex items-start gap-space-md">
      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-label-md text-primary font-bold mb-1">Insight de Finly</p>
        <p className="text-body-sm text-on-surface-variant">
          Registra algunos movimientos y te daré recomendaciones personalizadas sobre tus finanzas.
        </p>
      </div>
    </div>
  )
}
