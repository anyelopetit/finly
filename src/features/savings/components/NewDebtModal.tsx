import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CreateDebtInput, Currency } from '@/types'

interface NewDebtModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (input: CreateDebtInput) => void
  activeCurrency: Currency
}

export function NewDebtModal({ isOpen, onClose, onSave, activeCurrency }: NewDebtModalProps) {
  const [debtName, setDebtName] = useState('')
  const [debtAmount, setDebtAmount] = useState('')
  const [debtCreditor, setDebtCreditor] = useState('')
  const [debtDueDate, setDebtDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!debtName || !debtAmount) return
    onSave({
      name: debtName,
      initial_amount: parseFloat(debtAmount),
      currency: activeCurrency,
      creditor: debtCreditor || undefined,
      due_date: debtDueDate || undefined,
    })
    setDebtName('')
    setDebtAmount('')
    setDebtCreditor('')
    setDebtDueDate('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl z-10 space-y-4"
          >
            <h2 className="text-headline-sm font-bold text-on-surface">Registrar Deuda</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Nombre de la deuda"
                placeholder="Ej. Tarjeta de crédito, Préstamo"
                value={debtName}
                onChange={(e) => setDebtName(e.target.value)}
                required
              />
              <Input
                label={`Monto Inicial (${activeCurrency})`}
                type="number"
                placeholder="300.00"
                step="0.01"
                min="1"
                value={debtAmount}
                onChange={(e) => setDebtAmount(e.target.value)}
                required
              />
              <Input
                label="Acreedor / Institución (opcional)"
                placeholder="Ej. Banco Mercantil, Amigo"
                value={debtCreditor}
                onChange={(e) => setDebtCreditor(e.target.value)}
              />
              <Input
                label="Fecha de vencimiento (opcional)"
                type="date"
                value={debtDueDate}
                onChange={(e) => setDebtDueDate(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" fullWidth onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  Guardar Deuda
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
