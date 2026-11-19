import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ContributeModalProps {
  goalId: string | null
  onClose: () => void
  onContribute: (goalId: string, amount: number, note?: string) => void
}

export function ContributeModal({ goalId, onClose, onContribute }: ContributeModalProps) {
  const [actionAmount, setActionAmount] = useState('')
  const [actionNote, setActionNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalId || !actionAmount) return
    onContribute(goalId, parseFloat(actionAmount), actionNote)
    setActionAmount('')
    setActionNote('')
    onClose()
  }

  return (
    <AnimatePresence>
      {goalId && (
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
            <h2 className="text-headline-sm font-bold text-on-surface">Aportar Ahorro</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Monto a aportar"
                type="number"
                step="0.01"
                min="0.5"
                placeholder="50.00"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                required
              />
              <Input
                label="Nota o motivo"
                placeholder="Ej. Quincena de ahorro"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" fullWidth onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="secondary" fullWidth>
                  Confirmar Aporte
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
