import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Trash2,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react'
import { useDataStore } from '@/store'
import { useCurrencyStore } from '@/store'
import {
  ACCOUNT_PRESETS,
  calculateAccountBalances,
  getAccountIconComponent,
  getAccountTypeLabel,
  type AccountPreset,
} from '@/lib/accounts'
import type { Account, AccountType, Currency } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { cn } from '@/lib/utils'

interface ManageAccountsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectAccount?: (account: Account) => void
}

export function ManageAccountsModal({ isOpen, onClose, onSelectAccount }: ManageAccountsModalProps) {
  const { accounts, transactions, addAccount, deleteAccount } = useDataStore()
  const { exchangeRate } = useCurrencyStore()

  const [isCreating, setIsCreating] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('')
  const [type, setType] = useState<AccountType>('bank_ve')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [initialBalance, setInitialBalance] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [color, setColor] = useState('#5D39AE')
  const [icon, setIcon] = useState('Wallet')

  // Calculate live balances
  const accountBalances = useMemo(() => {
    return calculateAccountBalances(accounts, transactions, exchangeRate)
  }, [accounts, transactions, exchangeRate])

  const handleSelectPreset = (preset: AccountPreset) => {
    setSelectedPresetId(preset.id)
    setName(preset.name)
    setProvider(preset.provider)
    setType(preset.type)
    setCurrency(preset.currency)
    setColor(preset.color)
    setIcon(preset.iconName)
  }

  const handleResetForm = () => {
    setIsCreating(false)
    setSelectedPresetId(null)
    setName('')
    setProvider('')
    setType('bank_ve')
    setCurrency('USD')
    setInitialBalance('')
    setAccountNumber('')
    setColor('#5D39AE')
    setIcon('Wallet')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newAcc = addAccount({
      name,
      provider: provider || name,
      type,
      currency,
      initial_balance: parseFloat(initialBalance) || 0,
      color,
      icon,
      account_number: accountNumber || undefined,
    })

    handleResetForm()
    if (onSelectAccount) {
      onSelectAccount(newAcc)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-[28px] shadow-2xl z-10 overflow-hidden border border-hairline"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-container-low/30">
              <div>
                <h2 className="text-title-lg font-bold text-on-surface">Mis Cuentas</h2>
                <p className="text-body-sm text-on-surface-variant">
                  Gestiona tus bancos venezolanos, billeteras y cuentas USD
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {/* Accounts List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Cuentas activas ({accounts.length})
                  </span>
                  {!isCreating && (
                    <button
                      type="button"
                      onClick={() => setIsCreating(true)}
                      className="inline-flex items-center gap-1.5 text-label-md font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva cuenta
                    </button>
                  )}
                </div>

                <div className="grid gap-2">
                  {accounts.map((acc: Account) => {
                    const IconComp = getAccountIconComponent(acc.icon)
                    const bal = accountBalances[acc.id] || 0
                    const isVeBank = acc.type === 'bank_ve'

                    return (
                      <div
                        key={acc.id}
                        onClick={() => onSelectAccount && onSelectAccount(acc)}
                        className={cn(
                          'group flex items-center justify-between p-3.5 rounded-2xl border border-hairline bg-surface-container-low/40 hover:bg-surface-container-low hover:border-outline-variant transition-all',
                          onSelectAccount && 'cursor-pointer'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl grid place-items-center text-white shadow-sm flex-shrink-0"
                            style={{ backgroundColor: acc.color || '#5D39AE' }}
                          >
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-body-md font-bold text-on-surface">{acc.name}</span>
                              <span
                                className={cn(
                                  'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full',
                                  acc.currency === 'USD'
                                    ? 'bg-secondary-fixed/50 text-secondary-fixed-variant'
                                    : 'bg-primary-fixed/50 text-primary'
                                )}
                              >
                                {acc.currency}
                              </span>
                            </div>
                            <span className="text-label-sm text-on-surface-variant">
                              {getAccountTypeLabel(acc.type)} • {acc.provider}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="text-body-md font-bold text-on-surface font-numeric">
                              {formatCurrency(bal, acc.currency)}
                            </p>
                            {acc.currency === 'VES' && exchangeRate > 0 && (
                              <p className="text-[11px] text-on-surface-variant font-numeric">
                                ≈ {formatCurrency(bal / exchangeRate, 'USD')}
                              </p>
                            )}
                          </div>

                          {accounts.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`¿Desactivar la cuenta ${acc.name}?`)) {
                                  deleteAccount(acc.id)
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-all"
                              title="Desactivar cuenta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Create Account Form */}
              {isCreating ? (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-primary/20 bg-primary-fixed-dim/10 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary font-bold text-label-lg">
                      <Sparkles className="h-4 w-4" />
                      <span>Agregar nueva cuenta</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-label-sm text-on-surface-variant hover:text-on-surface"
                    >
                      Cancelar
                    </button>
                  </div>

                  {/* Preset Quick-Picks */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Selecciona un proveedor de Venezuela o USD
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-surface-container-lowest rounded-xl border border-hairline">
                      {ACCOUNT_PRESETS.map((preset) => {
                        const IconComp = getAccountIconComponent(preset.iconName)
                        const isSelected = selectedPresetId === preset.id
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
                            )}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: preset.color }}
                            />
                            <IconComp className="h-3 w-3" />
                            <span>{preset.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-label-sm font-semibold text-on-surface mb-1">
                        Nombre de la cuenta
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Banesco Móvil, Binance P2P"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-hairline text-body-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-label-sm font-semibold text-on-surface mb-1">
                        Moneda
                      </label>
                      <div className="flex rounded-xl bg-surface-container-lowest border border-hairline p-0.5">
                        <button
                          type="button"
                          onClick={() => setCurrency('USD')}
                          className={cn(
                            'flex-1 py-1.5 rounded-lg text-label-sm font-bold transition-colors',
                            currency === 'USD'
                              ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          )}
                        >
                          Dólares (USD)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency('VES')}
                          className={cn(
                            'flex-1 py-1.5 rounded-lg text-label-sm font-bold transition-colors',
                            currency === 'VES'
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          )}
                        >
                          Bolívares (VES)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-label-sm font-semibold text-on-surface mb-1">
                        Saldo inicial ({currency})
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-hairline text-body-sm text-on-surface focus:outline-none focus:border-primary font-numeric"
                      />
                    </div>

                    <div>
                      <label className="block text-label-sm font-semibold text-on-surface mb-1">
                        Identificador / Número (opcional)
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Ej. Últimos 4 dígitos o correo"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-hairline text-body-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2 rounded-xl text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="px-5 py-2 rounded-xl bg-primary text-white text-label-md font-bold shadow-md hover:bg-primary/90 disabled:opacity-40 transition-all"
                    >
                      Guardar Cuenta
                    </button>
                  </div>
                </motion.form>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-hairline bg-surface-container-low/50 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-on-surface text-surface-container-lowest text-label-md font-bold hover:opacity-90 transition-opacity"
              >
                Listo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
