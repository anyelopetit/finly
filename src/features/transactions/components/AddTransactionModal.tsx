import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore, useCurrencyStore } from '@/store'
import { useDataStore } from '@/store/dataStore'
import { Button } from '@/components/ui/Button'
import { AmountInput, Input } from '@/components/ui/Input'
import type { Currency, TransactionType } from '@/types'

export function AddTransactionModal() {
  const { isAddTransactionOpen, closeAddTransaction } = useUIStore()
  const { activeCurrency } = useCurrencyStore()
  const { categories, addTransaction } = useDataStore()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>(activeCurrency)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const availableCategories = categories.filter((c) => c.group === type)

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

    addTransaction({
      type,
      amount: num,
      currency,
      category_id: selectedCategoryId,
      description: description.trim() || undefined,
      date,
    })

    setAmount('')
    setDescription('')
    setError('')
    closeAddTransaction()
  }

  return (
    <AnimatePresence>
      {isAddTransactionOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAddTransaction}
            className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"
          />

          <motion.div
            layoutId="fab-add-button"
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 z-10 max-h-[92vh] overflow-y-auto"
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-headline-sm font-bold text-on-surface">
                {type === 'expense' ? 'Registrar Gasto' : 'Registrar Ingreso'}
              </h2>
              <button
                type="button"
                onClick={closeAddTransaction}
                className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
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
                  className={`flex-1 py-2 rounded-full text-label-md font-bold transition-all ${
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
                  className={`flex-1 py-2 rounded-full text-label-md font-bold transition-all ${
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
                    className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all ${
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
                    className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all ${
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
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-fixed/40 text-primary shadow-sm scale-105'
                            : 'border-transparent bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[24px] mb-1">
                          {cat.icon}
                        </span>
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
                leftIcon="edit_note"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Input
                type="date"
                label="Fecha"
                leftIcon="calendar_today"
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
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Guardar {type === 'expense' ? 'Gasto' : 'Ingreso'}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
