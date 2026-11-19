import { motion } from 'framer-motion'

interface SpendingBarsProps {
  data: number[]
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

export function SpendingBars({ data }: SpendingBarsProps) {
  const max = Math.max(...data, 1)
  const currentIdx = new Date().getMonth()

  return (
    <div className="flex items-end justify-between gap-2 h-28 pt-4 px-2">
      {MONTHS.map((label, i) => {
        const height = Math.round((data[i] / max) * 100)
        const isCurrent = i === currentIdx
        const isFuture = i > currentIdx

        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-2 relative group cursor-pointer">
            {isCurrent && data[i] > 0 && i > 0 && (
              <div className="absolute -top-7 bg-inverse-surface text-secondary-fixed px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                {data[i - 1] > 0
                  ? `${data[i] < data[i - 1] ? '-' : '+'}${Math.abs(Math.round(((data[i] - data[i - 1]) / data[i - 1]) * 100))}%`
                  : 'Nuevo'}
              </div>
            )}
            <motion.div
              className={`w-full max-w-[28px] rounded-t-full transition-colors ${
                isCurrent
                  ? 'bg-secondary-fixed shadow-[0_4px_12px_rgba(190,245,50,0.5)]'
                  : isFuture
                  ? 'bg-outline-variant opacity-40'
                  : 'bg-primary-fixed group-hover:bg-primary-container'
              }`}
              initial={{ height: 0 }}
              animate={{ height: `${isFuture ? 25 : height}%` }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
            <span
              className={`text-label-sm ${
                isCurrent ? 'font-bold text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
