import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSavings } from '../hooks/useSavings'
import { formatCurrency, getGoalAccumulated, getGoalProgress } from '@/lib/calculations'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Trash2, Calendar, Flag } from 'lucide-react'

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { goals, deleteGoal } = useSavings()

  const goal = goals.find((g) => g.id === id)

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Flag className="w-12 h-12 text-on-surface-variant" />
        <h2 className="text-headline-sm font-bold text-on-surface">Meta no encontrada</h2>
        <Button onClick={() => navigate('/metas')} variant="primary">
          Volver a metas
        </Button>
      </div>
    )
  }

  const accumulated = getGoalAccumulated(goal.contributions || [])
  const progress = getGoalProgress(goal)

  const handleDelete = () => {
    if (window.confirm('¿Seguro que deseas eliminar esta meta?')) {
      deleteGoal(goal.id)
      navigate('/metas')
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-8 space-y-6 pt-2">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-label-lg font-bold text-on-surface">Detalle de Meta</h1>
        <button
          onClick={handleDelete}
          className="w-10 h-10 rounded-full bg-error-container/40 text-error flex items-center justify-center hover:bg-error-container active:scale-95 transition-all cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Card with layoutId */}
      <motion.div
        layoutId={`goal-${goal.id}`}
        className="bg-surface-container-lowest rounded-3xl p-6 shadow-card space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-3xl">
            {goal.emoji}
          </div>
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface">{goal.name}</h2>
            <p className="text-body-sm text-on-surface-variant">
              Objetivo: {formatCurrency(goal.target_amount, goal.currency)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center text-label-md">
            <span className="text-on-surface-variant">Acumulado actual</span>
            <span className="font-bold text-primary">
              {formatCurrency(accumulated, goal.currency)} ({progress.toFixed(0)}%)
            </span>
          </div>
          <ProgressBar value={progress} height="lg" />
        </div>

        {goal.deadline && (
          <div className="flex items-center gap-2 pt-2 text-body-sm text-on-surface-variant">
            <Calendar className="w-4.5 h-4.5" />
            <span>Fecha límite: {goal.deadline}</span>
          </div>
        )}
      </motion.div>

      {/* Contributions History */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-label-lg font-bold text-on-surface">Historial de Aportes</h3>
        {!goal.contributions || goal.contributions.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant py-4 text-center">
            Aún no has registrado ningún aporte en esta meta.
          </p>
        ) : (
          <div className="space-y-2">
            {goal.contributions.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low"
              >
                <div>
                  <p className="text-label-md font-semibold text-on-surface">{c.note || 'Aporte'}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    {format(parseISO(c.date), "d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <span className="text-label-md font-bold text-secondary">
                  +{formatCurrency(c.amount, c.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
