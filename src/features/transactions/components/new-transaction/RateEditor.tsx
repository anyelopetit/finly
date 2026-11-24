import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { formatRate, parseRateInput } from '@/lib/money'

interface RateEditorProps {
  rate: number
  effectiveDate: string
  isStale: boolean
  isCustom: boolean
  onApply: (rate: number) => void
  onReset: () => void
  onClose: () => void
}

const formatEffectiveDate = (isoDate: string) => {
  try {
    return format(parseISO(isoDate), "d 'de' MMMM", { locale: es })
  } catch {
    return 'hoy'
  }
}

export function RateEditor({
  rate,
  effectiveDate,
  isStale,
  isCustom,
  onApply,
  onReset,
  onClose,
}: RateEditorProps) {
  const [draft, setDraft] = useState(() => formatRate(rate))
  const parsed = parseRateInput(draft)
  const valid = parsed !== null && parsed > 0

  const apply = () => {
    if (!valid) return
    onApply(parsed)
    onClose()
  }

  return (
    <div className="rounded-[20px] border border-hairline bg-white p-3 shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
            Tasa del movimiento
          </p>
          <p className="mt-0.5 text-[11.5px] text-muted">
            {isCustom
              ? 'Editada solo para este movimiento'
              : `${isStale ? 'Última tasa guardada' : 'BCV'} · ${formatEffectiveDate(effectiveDate)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={!isCustom}
          className={cn(
            'rounded-full px-2 py-1 text-[11px] font-medium transition-colors',
            isCustom
              ? 'text-ink/70 hover:bg-mist'
              : 'cursor-default text-muted/35'
          )}
        >
          Restablecer
        </button>
      </div>

      <div
        className={cn(
          'mt-2.5 flex items-center gap-2 rounded-[14px] border bg-mist/60 px-3 py-2.5 transition-colors',
          valid ? 'border-transparent' : 'border-danger/40'
        )}
      >
        <span className="shrink-0 text-[12px] font-medium text-muted">1 USD =</span>
        <input
          autoFocus
          inputMode="decimal"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              apply()
            }
          }}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Tasa BCV: bolívares por dólar"
          className="w-full min-w-0 bg-transparent text-[19px] font-semibold tracking-[-0.01em] text-ink outline-none tnum"
        />
        <span className="shrink-0 text-[12px] font-medium text-muted">VES</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[10.5px] leading-4 text-muted/80">
          No modifica la tasa global de Finly.
        </p>
        <button
          type="button"
          onClick={apply}
          disabled={!valid}
          className={cn(
            'shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-all',
            valid
              ? 'bg-ink text-white hover:bg-ink/90 active:scale-95'
              : 'cursor-not-allowed bg-mist text-muted/50'
          )}
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}
