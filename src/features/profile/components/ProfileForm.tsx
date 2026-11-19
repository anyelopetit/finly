import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Profile } from '@/types'

interface ProfileFormProps {
  profile: Profile
  exchangeRate: number
  onSave: (updates: Partial<Profile>, newRate: number) => void
}

export function ProfileForm({ profile, exchangeRate, onSave }: ProfileFormProps) {
  const [name, setName] = useState(profile.display_name)
  const [initUsd, setInitUsd] = useState(profile.initial_balance_usd.toString())
  const [initVes, setInitVes] = useState(profile.initial_balance_ves.toString())
  const [rateInput, setRateInput] = useState(exchangeRate.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(
      {
        display_name: name,
        initial_balance_usd: parseFloat(initUsd) || 0,
        initial_balance_ves: parseFloat(initVes) || 0,
      },
      parseFloat(rateInput) || exchangeRate
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
          {profile.display_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">
            {profile.display_name}
          </h2>
          <p className="text-body-sm text-on-surface-variant">{profile.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <Input
          label="Tu nombre o apodo"
          leftIcon="person"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Saldo inicial USD"
            type="number"
            step="0.01"
            value={initUsd}
            onChange={(e) => setInitUsd(e.target.value)}
          />
          <Input
            label="Saldo inicial VES"
            type="number"
            step="0.01"
            value={initVes}
            onChange={(e) => setInitVes(e.target.value)}
          />
        </div>

        <Input
          label="Tasa de cambio (1 USD = X VES)"
          leftIcon="currency_exchange"
          type="number"
          step="0.01"
          value={rateInput}
          onChange={(e) => setRateInput(e.target.value)}
          hint="Permite estimar equivalencias de saldo entre ambas monedas"
        />

        <Button type="submit" variant="primary" fullWidth className="mt-2">
          Guardar Configuración
        </Button>
      </form>
    </div>
  )
}
