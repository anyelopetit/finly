import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wallet, ChevronRight } from 'lucide-react'
import { useDataStore, useCurrencyStore } from '@/store'
import { calculateAccountBalances, getAccountIconComponent } from '@/lib/accounts'
import { formatCurrency } from '@/lib/calculations'
import { cn } from '@/lib/utils'
import type { Account } from '@/types'
import { ManageAccountsModal } from './ManageAccountsModal'

export function AccountsCarouselCard() {
  const { accounts, transactions } = useDataStore()
  const { exchangeRate } = useCurrencyStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const balances = calculateAccountBalances(accounts, transactions, exchangeRate)

  return (
    <>
      <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Wallet className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">Mis Cuentas</h2>
              <span className="text-label-sm text-on-surface-variant">
                {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'} en USD y VES
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-label-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary-fixed/30 hover:bg-primary-fixed/50 px-3 py-1.5 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gestionar</span>
          </button>
        </div>

        {/* Horizontal scrollable cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 -mx-2 px-2 no-scrollbar">
          {accounts.map((acc: Account) => {
            const IconComp = getAccountIconComponent(acc.icon)
            const balance = balances[acc.id] || 0

            return (
              <motion.div
                key={acc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex-shrink-0 w-44 p-3 rounded-2xl border border-hairline bg-surface-container-low/40 hover:bg-surface-container-low hover:border-outline-variant cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-xl grid place-items-center text-white shadow-xs"
                    style={{ backgroundColor: acc.color || '#5D39AE' }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span
                    className={cn(
                      'text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded-full',
                      acc.currency === 'USD'
                        ? 'bg-secondary-fixed/50 text-secondary-fixed-variant'
                        : 'bg-primary-fixed/50 text-primary'
                    )}
                  >
                    {acc.currency}
                  </span>
                </div>

                <div>
                  <h3 className="text-body-sm font-bold text-on-surface truncate">{acc.name}</h3>
                  <p className="text-[11px] text-on-surface-variant truncate">{acc.provider}</p>
                  <p className="text-body-md font-bold text-on-surface font-numeric mt-1.5">
                    {formatCurrency(balance, acc.currency)}
                  </p>
                  {acc.currency === 'VES' && exchangeRate > 0 && (
                    <p className="text-[10px] text-on-surface-variant font-numeric">
                      ≈ {formatCurrency(balance / exchangeRate, 'USD')}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Quick Add Card */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 w-32 p-3 rounded-2xl border border-dashed border-outline-variant/60 hover:border-primary/60 bg-surface-container-low/20 hover:bg-primary-fixed/10 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-surface-container grid place-items-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-label-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              + Cuenta
            </span>
            <span className="text-[10px] text-on-surface-variant">Binance, Zelle, BDV...</span>
          </button>
        </div>
      </div>

      <ManageAccountsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
