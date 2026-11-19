import { motion } from 'framer-motion'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface ReceiptCardProps {
  transaction: Transaction
}

export function ReceiptCard({ transaction }: ReceiptCardProps) {
  const isIncome = transaction.type === 'income'
  const dateFormatted = format(parseISO(transaction.date), "d 'de' MMMM, yyyy", { locale: es })

  return (
    <motion.div
      layoutId={`transaction-${transaction.id}`}
      className="bg-surface-container-lowest rounded-3xl p-6 shadow-card space-y-6 flex flex-col items-center text-center"
    >
      <div
        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm ${
          isIncome ? 'bg-secondary-container/30 text-secondary' : 'bg-primary-fixed text-primary'
        }`}
      >
        <CategoryIcon
          name={transaction.category?.icon || transaction.category?.name}
          className="w-8 h-8"
        />
      </div>

      <div className="space-y-1">
        <span className="text-label-sm uppercase font-bold tracking-wider text-on-surface-variant">
          {isIncome ? 'Ingreso Registrado' : 'Gasto Registrado'}
        </span>
        <h2
          className={`text-display font-extrabold ${
            isIncome ? 'text-secondary' : 'text-on-surface'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, transaction.currency)}
        </h2>
        <span className="text-label-md text-on-surface-variant font-medium">
          {transaction.currency === 'USD' ? 'Dólares Americanos' : 'Bolívares'}
        </span>
      </div>

      <div className="w-full border-t border-outline-variant/30" />

      <div className="w-full space-y-4 text-left">
        <div className="flex justify-between items-center">
          <span className="text-body-sm text-on-surface-variant">Concepto</span>
          <span className="text-label-md font-bold text-on-surface">
            {transaction.description || transaction.category?.name}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-body-sm text-on-surface-variant">Categoría</span>
          <span className="text-label-md font-semibold text-primary bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
            {transaction.category?.name}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-body-sm text-on-surface-variant">Fecha</span>
          <span className="text-label-md font-semibold text-on-surface">
            {dateFormatted}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-body-sm text-on-surface-variant">Estado</span>
          <span className="inline-flex items-center gap-1 text-label-sm font-bold text-secondary">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Completado
          </span>
        </div>
      </div>
    </motion.div>
  )
}
