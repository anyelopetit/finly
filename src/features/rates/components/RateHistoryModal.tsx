import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrencyStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { X, RefreshCw, TrendingUp, TrendingDown, Calendar, ShieldCheck, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface RateHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RateHistoryModal({ isOpen, onClose }: RateHistoryModalProps) {
  const {
    exchangeRate,
    effectiveDate,
    source,
    isStale,
    isLoadingRates,
    lastSyncAt,
    ratesHistory,
    syncRates,
    setManualRate,
  } = useCurrencyStore()

  const [isEditingManual, setIsEditingManual] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)

  const handleSync = async () => {
    setSyncFeedback(null)
    try {
      await syncRates(true)
      setSyncFeedback('Tasa sincronizada correctamente')
      setTimeout(() => setSyncFeedback(null), 3000)
    } catch {
      setSyncFeedback('No se pudo conectar con el servidor. Se mantiene la última tasa vigente.')
      setTimeout(() => setSyncFeedback(null), 4000)
    }
  }

  const handleApplyManual = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(manualInput)
    if (!isNaN(val) && val > 0) {
      setManualRate(val)
      setIsEditingManual(false)
      setManualInput('')
    }
  }

  // Filter USD rates for chronological display
  const usdRates = ratesHistory
    .filter((r) => r.currency === 'USD')
    .sort((a, b) => b.effective_date.localeCompare(a.effective_date))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface-container-lowest shadow-2xl rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto z-10 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Tasa Oficial BCV
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Tipo de cambio de referencia del Banco Central de Venezuela
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Spotlight Rate Card */}
            <div className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-label-sm uppercase font-extrabold tracking-wider text-on-surface-variant flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isStale ? 'bg-amber-500' : 'bg-secondary animate-pulse'
                    }`}
                  />
                  {source === 'MANUAL' ? 'Tasa Personalizada' : 'Tasa Vigente BCV'}
                </span>
                <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Fecha valor:{' '}
                  {effectiveDate
                    ? format(parseISO(effectiveDate), "d 'de' MMM, yyyy", { locale: es })
                    : 'Hoy'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-display font-black text-on-surface tracking-tight">
                    {exchangeRate.toLocaleString('es-VE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </h3>
                  <span className="text-label-sm text-on-surface-variant font-medium">
                    Bolívares (VES) por 1 Dólar (USD)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={isLoadingRates}
                  className="px-3 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container active:scale-95 text-primary font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin text-primary' : ''}`}
                  />
                  {isLoadingRates ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>

              {syncFeedback && (
                <div className="text-xs font-semibold px-3 py-2 rounded-xl bg-surface-container-lowest text-primary border border-outline-variant/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              {lastSyncAt && (
                <div className="text-[11px] text-on-surface-variant/80 text-right">
                  Última sincronización: {format(parseISO(lastSyncAt), 'HH:mm:ss')}
                </div>
              )}
            </div>

            {/* Quick manual rate override */}
            <div className="p-3 rounded-2xl bg-surface-container-low/50 border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-semibold">
                  ¿Compraste o vendiste a una tasa distinta?
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingManual(!isEditingManual)}
                  className="text-xs font-bold text-primary underline cursor-pointer"
                >
                  {isEditingManual ? 'Cancelar' : 'Fijar tasa manual'}
                </button>
              </div>

              {isEditingManual && (
                <form onSubmit={handleApplyManual} className="flex gap-2 pt-1">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Ej. 925.00"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    Guardar
                  </Button>
                </form>
              )}
            </div>

            {/* Historical Rates Timeline */}
            <div className="space-y-3">
              <h4 className="text-label-md font-bold text-on-surface">
                Historial de Actualizaciones por Fecha Valor
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {usdRates.map((record, idx) => {
                  const nextRecord = usdRates[idx + 1]
                  const diff = nextRecord ? record.price - nextRecord.price : 0
                  const diffPct = nextRecord ? (diff / nextRecord.price) * 100 : 0
                  const isPositive = diff > 0
                  const isNegative = diff < 0

                  return (
                    <div
                      key={record.id}
                      className="p-3 rounded-2xl bg-surface-container-low/70 flex items-center justify-between border border-outline-variant/20"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-label-md font-bold text-on-surface">
                            {record.price.toLocaleString('es-VE', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 4,
                            })}{' '}
                            Bs.
                          </span>
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-surface-container-highest text-primary">
                            {record.source}
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant">
                          Fecha valor:{' '}
                          {format(parseISO(record.effective_date), "d 'de' MMMM, yyyy", {
                            locale: es,
                          })}
                        </p>
                      </div>

                      {nextRecord && (
                        <div
                          className={`text-right flex items-center gap-1 text-label-sm font-bold ${
                            isPositive
                              ? 'text-secondary'
                              : isNegative
                              ? 'text-error'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {isPositive && <TrendingUp className="w-3.5 h-3.5 text-secondary" />}
                          {isNegative && <TrendingDown className="w-3.5 h-3.5 text-error" />}
                          <span>
                            {isPositive ? '+' : ''}
                            {diffPct.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <Button variant="secondary" fullWidth onClick={onClose}>
              Entendido
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
