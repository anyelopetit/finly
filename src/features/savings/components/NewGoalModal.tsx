import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CreateGoalInput, Currency } from '@/types'

interface NewGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (input: CreateGoalInput) => void
  activeCurrency: Currency
}

export function NewGoalModal({ isOpen, onClose, onSave, activeCurrency }: NewGoalModalProps) {
  const [goalName, setGoalName] = useState('')
  const [goalEmoji, setGoalEmoji] = useState('🎯')
  const [goalTarget, setGoalTarget] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalName || !goalTarget) return
    onSave({
      name: goalName,
      emoji: goalEmoji || '🎯',
      target_amount: parseFloat(goalTarget),
      currency: activeCurrency,
      deadline: goalDeadline || undefined,
    })
    setGoalName('')
    setGoalTarget('')
    setGoalDeadline('')
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
            <h2 className="text-headline-sm font-bold text-on-surface">Nueva Meta de Ahorro</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="w-16">
                  <Input
                    label="Emoji"
                    value={goalEmoji}
                    onChange={(e) => setGoalEmoji(e.target.value)}
                    maxLength={2}
                    className="text-center text-xl"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Nombre de la meta"
                    placeholder="Ej. Vacaciones, Moto, Fondo"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Input
                label={`Monto Objetivo (${activeCurrency})`}
                type="number"
                placeholder="500.00"
                step="0.01"
                min="1"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                required
              />
              <Input
                label="Fecha objetivo (opcional)"
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" fullWidth onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  Crear Meta
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
