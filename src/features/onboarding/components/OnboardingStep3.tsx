import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import type { Currency } from '@/types'

interface OnboardingStep3Props {
  userName: string
  setUserName: (val: string) => void
  selectedCurrency: Currency
  setSelectedCurrency: (c: Currency) => void
  initialBalance: string
  setInitialBalance: (val: string) => void
  selectedCategories: string[]
  toggleCategory: (cat: string) => void
}

const CATEGORIES_OPTIONS = [
  { name: 'Alimentación', icon: 'restaurant' },
  { name: 'Transporte', icon: 'directions_car' },
  { name: 'Servicios', icon: 'bolt' },
  { name: 'Vivienda', icon: 'home' },
  { name: 'Entretenimiento', icon: 'sports_esports' },
  { name: 'Salud', icon: 'favorite' },
]

export function OnboardingStep3({
  userName,
  setUserName,
  selectedCurrency,
  setSelectedCurrency,
  initialBalance,
  setInitialBalance,
  selectedCategories,
  toggleCategory,
}: OnboardingStep3Props) {
  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center space-y-5 w-full"
    >
      <div className="space-y-1">
        <h2 className="text-headline-md font-bold text-on-surface">Configuración rápida</h2>
        <p className="text-body-sm text-on-surface-variant">
          Personalicemos Finly para ti en 10 segundos
        </p>
      </div>

      <Input
        label="¿Cómo te llamas?"
        placeholder="Tu nombre"
        leftIcon="user"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <div className="w-full text-left space-y-1.5">
        <label className="text-label-md font-semibold text-on-surface-variant">
          Moneda principal
        </label>
        <div className="flex gap-2">
          {(['USD', 'VES'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCurrency(c)}
              className={`flex-1 py-2.5 rounded-2xl text-label-md font-bold border transition-all cursor-pointer ${
                selectedCurrency === c
                  ? 'border-primary bg-primary-fixed/40 text-primary shadow-sm'
                  : 'border-transparent bg-surface-container-low text-on-surface-variant'
              }`}
            >
              {c === 'USD' ? 'Dólares (USD $)' : 'Bolívares (VES Bs.)'}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Saldo inicial disponible (opcional)"
        type="number"
        placeholder="0.00"
        value={initialBalance}
        onChange={(e) => setInitialBalance(e.target.value)}
        hint="Puedes comenzar desde cero si prefieres"
      />

      <div className="w-full text-left space-y-1.5">
        <label className="text-label-md font-semibold text-on-surface-variant">
          Tus categorías clave
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES_OPTIONS.map((cat) => {
            const isSelected = selectedCategories.includes(cat.name)
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => toggleCategory(cat.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm scale-105'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <CategoryIcon name={cat.icon} className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
