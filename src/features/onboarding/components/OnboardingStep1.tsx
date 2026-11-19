import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'

export function OnboardingStep1() {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center space-y-8"
    >
      {/* Continuous Breathing / Floating Lime Orb with layoutId */}
      <motion.div
        layoutId="hero-orb"
        className="relative w-36 h-36 rounded-full bg-secondary-fixed shadow-[0_0_50px_rgba(190,245,50,0.6)] flex items-center justify-center cursor-pointer"
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            '0 0 35px rgba(190,245,50,0.5)',
            '0 0 70px rgba(190,245,50,0.8)',
            '0 0 35px rgba(190,245,50,0.5)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Wallet className="w-14 h-14 text-on-secondary-fixed stroke-[2]" />
      </motion.div>

      <div className="space-y-3 max-w-xs">
        <h1 className="text-headline-lg font-extrabold text-on-surface tracking-tight leading-tight">
          Entiende tu dinero. <br />
          <span className="text-primary">Mejora tu futuro.</span>
        </h1>
        <p className="text-body-md text-on-surface-variant leading-relaxed">
          Finanzas personales simples, visuales y sin complicaciones para tu día a día.
        </p>
      </div>
    </motion.div>
  )
}
