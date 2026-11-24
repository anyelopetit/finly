import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDataStore } from '@/store/dataStore'
import { useCurrencyStore } from '@/store'
import { ProfileForm } from '../components/ProfileForm'
import { PreferencesSection } from '../components/PreferencesSection'
import { DemoDataSection } from '../components/DemoDataSection'
import type { Profile } from '@/types'

export default function ProfilePage() {
  const { profile, updateProfile, resetToDemoData, clearAllData } = useDataStore()
  const { exchangeRate, setManualRate } = useCurrencyStore()
  const [savedNotice, setSavedNotice] = useState(false)

  const handleSave = (updates: Partial<Profile>, newRate: number) => {
    updateProfile(updates)
    if (newRate > 0) {
      setManualRate(newRate)
    }
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  const handleResetDemo = () => {
    resetToDemoData()
    alert('¡Datos de demostración restaurados!')
  }

  const handleClearAll = () => {
    if (window.confirm('¿Deseas limpiar todos los movimientos para empezar vacío?')) {
      clearAllData()
    }
  }

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 pt-1 max-w-md mx-auto">
      {/* Header */}
      <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">
        Ajustes y Perfil
      </h1>

      {savedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary-container/40 border border-secondary text-secondary p-3 rounded-2xl text-label-md font-bold text-center"
        >
          ✓ Cambios guardados correctamente
        </motion.div>
      )}

      {/* Profile Form */}
      <ProfileForm
        profile={profile}
        exchangeRate={exchangeRate}
        onSave={handleSave}
      />

      {/* Preferences Section */}
      <PreferencesSection />

      {/* Development / Demo Data Management */}
      <DemoDataSection
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
      />

      {/* Footer Info */}
      <div className="text-center text-body-sm text-on-surface-variant py-4 space-y-1">
        <p className="font-semibold">Finly MVP · v1.0.0</p>
        <p>Almacenamiento local activo · Listo para conectar Supabase</p>
      </div>
    </div>
  )
}
