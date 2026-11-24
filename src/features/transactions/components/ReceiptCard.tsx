import { motion } from 'framer-motion'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { calculateEquivalent } from '@/lib/exchangeRates'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowRightLeft } from 'lucide-react'

interface ReceiptCardProps {
  transaction: Transaction
}

export function ReceiptCard({ transaction }: ReceiptCardProps) {
  const isIncome = transaction.type === 'income'
  const dateFormatted = format(parseISO(transaction.date), "d 'de' MMMM, yyyy", { locale: es })

  const rate = transaction.exchange_rate
  const equivalent =
    transaction.equivalent_amount ??
    (rate ? calculateEquivalent(transaction.amount, transaction.currency, rate) : null)

  const rateDateFormatted = transaction.exchange_rate_date
    ? format(parseISO(transaction.exchange_rate_date), "d 'de' MMM, yyyy", { locale: es })
    : null

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
        <div className="flex flex-col items-center">
          <span className="text-label-md text-on-surface-variant font-medium">
            {transaction.currency === 'USD' ? 'Dólares Americanos' : 'Bolívares'}
          </span>
          {equivalent !== null && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-label-md font-bold text-primary bg-primary-fixed/30 px-3 py-1 rounded-full">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              ≈ {formatCurrency(equivalent, transaction.currency === 'USD' ? 'VES' : 'USD')}
            </span>
          )}
        </div>
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

        {/* Historical Exchange Rate Snapshot */}
        {rate && (
          <div className="pt-2 border-t border-outline-variant/20">
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Tasa aplicada en la compra
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-surface-container-highest text-primary">
                  {transaction.exchange_rate_source || 'BCV'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-body-sm text-on-surface font-semibold">
                  1 USD = {rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Bs.
                </span>
                {rateDateFormatted && (
                  <span className="text-[11px] text-on-surface-variant">
                    {rateDateFormatted}
                  </span>
                )}
              </div>
              {equivalent !== null && (
                <div className="text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20 flex justify-between">
                  <span>Equivalente calculado:</span>
                  <span className="font-bold text-on-surface">
                    {formatCurrency(equivalent, transaction.currency === 'USD' ? 'VES' : 'USD')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
