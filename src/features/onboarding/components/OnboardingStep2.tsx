import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export function OnboardingStep2() {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center space-y-6 w-full"
    >
      {/* Orb morphed to Lavender Pill Container with layoutId */}
      <motion.div
        layoutId="hero-orb"
        className="w-full max-w-xs py-4 px-6 rounded-3xl bg-primary-fixed/80 border border-primary/20 shadow-md flex items-center justify-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5 text-on-secondary-fixed" />
        </div>
        <span className="text-label-lg font-bold text-primary">
          Control en tres preguntas
        </span>
      </motion.div>

      <div className="space-y-4 text-left w-full max-w-xs pt-4">
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-lowest shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-label-md font-bold text-on-surface">1. ¿Cuánto dinero tengo?</h3>
            <p className="text-body-sm text-on-surface-variant">Visión clara de tu saldo en USD y VES.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-lowest shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-label-md font-bold text-on-surface">2. ¿En qué gasto?</h3>
            <p className="text-body-sm text-on-surface-variant">Categorización instantánea en pocos segundos.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-lowest shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-on-secondary-container shrink-0 mt-0.5" />
          <div>
            <h3 className="text-label-md font-bold text-on-surface">3. ¿Cómo van mis metas?</h3>
            <p className="text-body-sm text-on-surface-variant">Metas de ahorro y seguimiento de deudas.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
