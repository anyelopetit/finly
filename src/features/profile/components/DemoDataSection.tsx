import { Button } from '@/components/ui/Button'

interface DemoDataSectionProps {
  onResetDemo: () => void
  onClearAll: () => void
}

export function DemoDataSection({ onResetDemo, onClearAll }: DemoDataSectionProps) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-3">
      <h3 className="text-label-lg font-bold text-on-surface">Datos de Desarrollo</h3>
      <p className="text-body-sm text-on-surface-variant">
        Puedes reiniciar los datos de demostración o empezar desde cero en tu navegador:
      </p>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          variant="outline"
          fullWidth
          onClick={onResetDemo}
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Restaurar Datos Demo (Ana)
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={onClearAll}
          className="text-error border-error/20 hover:bg-error-container/20"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          Limpiar Todos los Datos (Empezar Vacío)
        </Button>
      </div>
    </div>
  )
}
