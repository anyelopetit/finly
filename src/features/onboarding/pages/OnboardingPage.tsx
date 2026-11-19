import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '@/store/dataStore'
import { useCurrencyStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { OnboardingStep1 } from '../components/OnboardingStep1'
import { OnboardingStep2 } from '../components/OnboardingStep2'
import { OnboardingStep3 } from '../components/OnboardingStep3'
import type { Currency } from '@/types'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useDataStore()
  const { activeCurrency, setActiveCurrency } = useCurrencyStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [userName, setUserName] = useState(profile.display_name || 'Ana')
  const [initialBalance, setInitialBalance] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(activeCurrency)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Alimentación',
    'Transporte',
    'Servicios',
  ])

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleFinish = () => {
    const balanceNum = parseFloat(initialBalance) || 0
    updateProfile({
      display_name: userName.trim() || 'Ana',
      primary_currency: selectedCurrency,
      initial_balance_usd: selectedCurrency === 'USD' ? balanceNum : 0,
      initial_balance_ves: selectedCurrency === 'VES' ? balanceNum : 0,
    })
    setActiveCurrency(selectedCurrency)
    localStorage.setItem('finly_onboarding_completed', 'true')
    navigate('/')
  }

  return (
    <div className="relative min-h-screen bg-surface flex flex-col justify-between p-6 max-w-md mx-auto overflow-hidden">
      {/* Top Brand & Skip */}
      <div className="flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-headline-sm font-bold text-on-surface">Finly</span>
        </div>
        {step < 3 && (
          <button
            onClick={() => setStep(3)}
            className="text-label-md text-on-surface-variant hover:text-on-surface font-semibold cursor-pointer"
          >
            Saltar
          </button>
        )}
      </div>

      {/* Center Interactive Content with Shared Morphing Elements */}
      <div className="my-auto py-8 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {step === 1 && <OnboardingStep1 key="step-1" />}
          {step === 2 && <OnboardingStep2 key="step-2" />}
          {step === 3 && (
            <OnboardingStep3
              key="step-3"
              userName={userName}
              setUserName={setUserName}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              initialBalance={initialBalance}
              setInitialBalance={setInitialBalance}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Button & Step Dots */}
      <div className="space-y-4 z-10 pb-4">
        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/60'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        {step < 3 ? (
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={() => setStep((s) => (s + 1) as 2 | 3)}
          >
            Continuar
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Button>
        ) : (
          <motion.div layoutId="cta-button">
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handleFinish}
              className="shadow-fab glow-lime"
            >
              Comenzar con Finly
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
