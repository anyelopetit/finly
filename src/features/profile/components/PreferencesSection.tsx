import { usePrivacyStore, useCurrencyStore } from '@/store'
import type { Currency } from '@/types'

export function PreferencesSection() {
  const { isHidden, toggle: togglePrivacy } = usePrivacyStore()
  const { activeCurrency, setActiveCurrency } = useCurrencyStore()

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="text-label-lg font-bold text-on-surface">Preferencias de Uso</h3>

      <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
        <div>
          <p className="text-label-md font-bold text-on-surface">Modo Privacidad</p>
          <p className="text-body-sm text-on-surface-variant">
            Oculta montos confidenciales con puntos
          </p>
        </div>
        <button
          onClick={togglePrivacy}
          className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
            isHidden ? 'bg-primary' : 'bg-surface-container-high'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              isHidden ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-label-md font-bold text-on-surface">Moneda Predeterminada</p>
          <p className="text-body-sm text-on-surface-variant">Alterna en cualquier momento</p>
        </div>
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-full">
          {(['USD', 'VES'] as const).map((c: Currency) => (
            <button
              key={c}
              onClick={() => setActiveCurrency(c)}
              className={`px-3 py-1 rounded-full text-label-sm font-bold cursor-pointer ${
                activeCurrency === c
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
