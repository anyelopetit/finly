import { Button } from '@/components/ui/Button'
import { RotateCcw, Trash2 } from 'lucide-react'

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
          <RotateCcw className="w-4.5 h-4.5 mr-1" />
          Restaurar Datos Demo (Ana)
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={onClearAll}
          className="text-error border-error/20 hover:bg-error-container/20"
        >
          <Trash2 className="w-4.5 h-4.5 mr-1" />
          Limpiar Todos los Datos (Empezar Vacío)
        </Button>
      </div>
    </div>
  )
}
