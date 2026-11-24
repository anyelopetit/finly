import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { usePrivacyStore, useUIStore } from '@/store'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { format, parseISO, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface TransactionItemProps {
  transaction: Transaction
  index?: number
}

const categoryColors: Record<string, string> = {
  income: 'bg-surface-container-high text-secondary',
  expense: 'bg-primary-fixed text-primary',
}

function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoy'
  if (isYesterday(date)) return 'Ayer'
  return format(date, 'd MMM', { locale: es })
}

export function TransactionItem({ transaction, index = 0 }: TransactionItemProps) {
  const navigate = useNavigate()
  const { isHidden } = usePrivacyStore()
  const { lastCreatedTransactionId, setLastCreatedTransactionId } = useUIStore()

  const isNewlyCreated = lastCreatedTransactionId === transaction.id

  useEffect(() => {
    if (isNewlyCreated) {
      const timer = setTimeout(() => {
        setLastCreatedTransactionId(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isNewlyCreated, setLastCreatedTransactionId])

  const isIncome = transaction.type === 'income'
  const colorClass = isIncome ? categoryColors.income : categoryColors.expense
  const amountColor = isIncome ? 'text-secondary font-bold' : 'text-on-surface font-bold'
  const amountPrefix = isIncome ? '+' : '-'

  return (
    <motion.div
      layout
      layoutId={`transaction-${transaction.id}`}
      initial={{ opacity: 0, y: isNewlyCreated ? -18 : 8, scale: isNewlyCreated ? 0.95 : 1 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        backgroundColor: isNewlyCreated
          ? ['rgba(190,245,50,0.35)', 'rgba(190,245,50,0.12)', 'rgba(255,255,255,0)']
          : 'rgba(255,255,255,0)',
      }}
      transition={{
        layout: { type: 'spring', stiffness: 350, damping: 28 },
        delay: isNewlyCreated ? 0 : index * 0.04,
        duration: isNewlyCreated ? 1.5 : 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => navigate(`/movimientos/${transaction.id}`)}
      className={cn(
        'relative flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group',
        isNewlyCreated
          ? 'ring-2 ring-secondary-fixed shadow-[0_4px_16px_rgba(190,245,50,0.35)]'
          : 'hover:bg-surface-container-low active:bg-surface-container'
      )}
    >
      {/* Category icon */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0',
            colorClass
          )}
        >
          <CategoryIcon
            name={transaction.category?.icon || transaction.category?.name}
            className="w-5 h-5"
          />
        </motion.div>

        {/* Description + meta */}
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-label-lg font-semibold text-on-surface leading-snug">
              {transaction.description ?? transaction.category?.name ?? 'Movimiento'}
            </p>
            <AnimatePresence>
              {isNewlyCreated && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="text-[10px] uppercase tracking-wider font-extrabold bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full shadow-sm"
                >
                  Nuevo
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {transaction.category?.name} &bull;{' '}
            {formatRelativeDate(transaction.date)}
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0 ml-2">
        <p className={cn('text-label-lg', amountColor)}>
          {isHidden
            ? '••••••'
            : `${amountPrefix}${formatCurrency(transaction.amount, transaction.currency)}`}
        </p>
        <span className="text-label-sm text-on-surface-variant">
          {transaction.currency}
        </span>
      </div>
    </motion.div>
  )
}
