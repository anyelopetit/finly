import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore, useCurrencyStore } from '@/store'
import { useDataStore } from '@/store/dataStore'
import { Button } from '@/components/ui/Button'
import { AmountInput, Input } from '@/components/ui/Input'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { formatCurrency } from '@/lib/calculations'
import type { Currency, TransactionType } from '@/types'
import { X, CheckCircle, Check } from 'lucide-react'

export function AddTransactionModal() {
  const { isAddTransactionOpen, closeAddTransaction, setLastCreatedTransactionId } = useUIStore()
  const { activeCurrency } = useCurrencyStore()
  const { categories, addTransaction } = useDataStore()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>(activeCurrency)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  // State when user taps "Guardar" to trigger morphing into card
  const [createdTxId, setCreatedTxId] = useState<string | null>(null)
  const [isTransforming, setIsTransforming] = useState(false)

  const availableCategories = categories.filter((c) => c.group === type)
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0')
      return
    }
    if (!selectedCategoryId) {
      setError('Por favor selecciona una categoría')
      return
    }

    const newTx = addTransaction({
      type,
      amount: num,
      currency,
      category_id: selectedCategoryId,
      description: description.trim() || undefined,
      date,
    })

    // Set the created transaction ID for shared element animation
    setCreatedTxId(newTx.id)
    setLastCreatedTransactionId(newTx.id)
    setIsTransforming(true)

    // Briefly show the morphed card preview, then close to let it fly to the list
    setTimeout(() => {
      closeAddTransaction()
      // Reset local state after unmount
      setTimeout(() => {
        setIsTransforming(false)
        setCreatedTxId(null)
        setAmount('')
        setDescription('')
        setError('')
      }, 400)
    }, 320)
  }

  const handleClose = () => {
    if (isTransforming) return
    setIsTransforming(false)
    setCreatedTxId(null)
    setError('')
    closeAddTransaction()
  }

  return (
    <AnimatePresence>
      {isAddTransactionOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransforming ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"
          />

          <motion.div
            layoutId={createdTxId ? `transaction-${createdTxId}` : 'fab-add-button'}
            className={`relative w-full max-w-lg bg-surface-container-lowest shadow-2xl z-10 transition-colors ${
              isTransforming
                ? 'rounded-2xl p-4 ring-2 ring-secondary-fixed glow-lime overflow-hidden'
                : 'rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto'
            }`}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            {isTransforming ? (
              /* Morphed Card Preview that docks into the recent list */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      type === 'income'
                        ? 'bg-surface-container-high text-secondary'
                        : 'bg-primary-fixed text-primary'
                    }`}
                  >
                    <CategoryIcon
                      name={selectedCategory?.icon || selectedCategory?.name}
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-label-lg font-bold text-on-surface leading-snug">
                        {description.trim() || selectedCategory?.name || 'Movimiento'}
                      </p>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Añadido
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      {selectedCategory?.name} &bull; Hoy
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <p
                    className={`text-label-lg font-bold ${
                      type === 'income' ? 'text-secondary' : 'text-on-surface'
                    }`}
                  >
                    {type === 'income' ? '+' : '-'}
                    {formatCurrency(parseFloat(amount) || 0, currency)}
                  </p>
                  <span className="text-label-sm text-on-surface-variant">{currency}</span>
                </div>
              </motion.div>
            ) : (
              /* Full Creation Form */
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-headline-sm font-bold text-on-surface">
                    {type === 'expense' ? 'Registrar Gasto' : 'Registrar Ingreso'}
                  </h2>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex p-1 bg-surface-container-low rounded-full">
                    <button
                      type="button"
                      onClick={() => {
                        setType('expense')
                        setSelectedCategoryId('')
                      }}
                      className={`flex-1 py-2 rounded-full text-label-md font-bold transition-all cursor-pointer ${
                        type === 'expense'
                          ? 'bg-error text-white shadow-sm'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      Gasto
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setType('income')
                        setSelectedCategoryId('')
                      }}
                      className={`flex-1 py-2 rounded-full text-label-md font-bold transition-all cursor-pointer ${
                        type === 'income'
                          ? 'bg-secondary text-white shadow-sm'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      Ingreso
                    </button>
                  </div>

                  <div className="py-2">
                    <AmountInput
                      value={amount}
                      onChange={(val) => {
                        setAmount(val)
                        if (error) setError('')
                      }}
                      currency={currency}
                      error={error}
                    />
                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all cursor-pointer ${
                          currency === 'USD'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('VES')}
                        className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all cursor-pointer ${
                          currency === 'VES'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        VES (Bs.)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label-md font-semibold text-on-surface-variant">
                      Categoría
                    </label>
                    <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                      {availableCategories.map((cat) => {
                        const isSelected = selectedCategoryId === cat.id
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-primary-fixed/40 text-primary shadow-sm scale-105'
                                : 'border-transparent bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                            }`}
                          >
                            <CategoryIcon name={cat.icon || cat.name} className="w-6 h-6 mb-1" />
                            <span className="text-[11px] font-medium text-center line-clamp-1 leading-tight">
                              {cat.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Input
                    label="Descripción / Nota (opcional)"
                    placeholder="Ej. Almuerzo de trabajo"
                    leftIcon="edit"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Input
                    type="date"
                    label="Fecha"
                    leftIcon="calendar"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />

                  <Button
                    type="submit"
                    variant="secondary"
                    fullWidth
                    size="lg"
                    className="mt-4"
                  >
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Guardar {type === 'expense' ? 'Gasto' : 'Ingreso'}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
