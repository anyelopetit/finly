import { motion } from 'framer-motion'
import type { Insight } from '@/types'

interface InsightCardProps {
  insight: Insight
}

const typeConfig = {
  positive_trend: {
    icon: 'auto_awesome',
    bgIcon: 'bg-primary-container text-on-primary-container',
    gradient: 'from-primary-fixed/40 via-surface-container-low to-surface-container-lowest',
  },
  savings_rate: {
    icon: 'savings',
    bgIcon: 'bg-secondary-container/40 text-on-secondary-container',
    gradient: 'from-secondary-fixed/20 via-surface-container-low to-surface-container-lowest',
  },
  category_spike: {
    icon: 'trending_up',
    bgIcon: 'bg-error-container/60 text-error',
    gradient: 'from-error-container/20 via-surface-container-low to-surface-container-lowest',
  },
  budget_warning: {
    icon: 'warning',
    bgIcon: 'bg-error-container/60 text-error',
    gradient: 'from-error-container/20 via-surface-container-low to-surface-container-lowest',
  },
  goal_progress: {
    icon: 'flag',
    bgIcon: 'bg-primary-fixed text-primary',
    gradient: 'from-primary-fixed/40 via-surface-container-low to-surface-container-lowest',
  },
}

export function InsightCard({ insight }: InsightCardProps) {
  const config = typeConfig[insight.type]

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
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {config.icon}
        </span>
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
          dangerouslySetInnerHTML={{ __html: insight.message.replace(/\*\*(.*?)\*\*/g, '<strong class="text-on-surface font-semibold">$1</strong>') }}
        />
      </div>

      {/* Arrow */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </motion.button>
    </motion.div>
  )
}

// ----- Empty / placeholder insight when no data yet -----
export function InsightPlaceholder() {
  return (
    <div className="bg-gradient-to-r from-primary-fixed/30 via-surface-container-low to-surface-container-lowest rounded-lg p-space-md shadow-sm flex items-start gap-space-md">
      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
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
