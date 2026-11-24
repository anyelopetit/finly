import { motion, AnimatePresence } from 'framer-motion'
import type { Currency } from '@/types'
import { cn } from '@/lib/utils'
import { formatMoney, splitAmount } from '@/lib/money'

const CURRENCIES: Currency[] = ['USD', 'VES']

interface AmountDisplayProps {
  currency: Currency
  entry: string
  tokens: string[]
  equivalent: number
  editing: boolean
  direction: 1 | -1
  reducedMotion: boolean
  onActivate: () => void
  onCurrencyChange: (currency: Currency) => void
  amountRef: React.RefObject<HTMLButtonElement>
}

const prettyToken = (token: string, index: number) => {
  if (index % 2 === 0) {
    const parts = splitAmount(token)
    return `${parts.integer},${parts.fraction || '00'}`
  }
  return token === '*' ? '×' : token === '/' ? '÷' : token === '-' ? '−' : token
}

export function AmountDisplay({
  currency,
  entry,
  tokens,
  equivalent,
  editing,
  direction,
  reducedMotion,
  onActivate,
  onCurrencyChange,
  amountRef,
}: AmountDisplayProps) {
  const parts = splitAmount(entry)
  const empty = entry === ''
  const characters = `${parts.integer},${parts.fraction}`.length
  const fontSize =
    characters <= 7 ? 68 : characters <= 9 ? 58 : characters <= 11 ? 50 : characters <= 13 ? 43 : 37
  const other: Currency = currency === 'USD' ? 'VES' : 'USD'
  const swap = reducedMotion
    ? { duration: 0 }
    : { duration: 0.19, ease: [0.32, 0.72, 0, 1] as const }

  return (
    <div className="pt-5">
      {/* Currency — a single tap switches it */}
      <div
        className="relative mx-auto grid w-[112px] grid-cols-2 rounded-full bg-mist p-1"
        role="group"
        aria-label="Moneda del movimiento"
      >
        {CURRENCIES.map((option) => {
          const active = option === currency
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onCurrencyChange(option)}
              className={cn(
                'relative z-10 rounded-full py-1 text-[11px] font-semibold tracking-[0.08em] transition-colors duration-150',
                active ? 'text-ink' : 'text-muted hover:text-ink/70'
              )}
            >
              {active && (
                <motion.span
                  layoutId="movement-currency-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-key"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 520, damping: 38 }
                  }
                />
              )}
              <span className="relative">{option}</span>
            </button>
          )
        })}
      </div>

      {/* Live expression (kept in flow to avoid jumps) */}
      <div className="mt-2 flex h-[18px] items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {tokens.length > 0 && (
            <motion.p
              key={tokens.join(' ')}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: reducedMotion ? 0 : 0.14 }}
              className="truncate px-4 text-[12px] font-medium text-muted tnum"
            >
              {tokens.map((token, index) => (
                <span key={`${token}-${index}`}>
                  {index > 0 ? ' ' : ''}
                  {prettyToken(token, index)}
                </span>
              ))}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* The financial display */}
      <button
        ref={amountRef}
        type="button"
        onClick={onActivate}
        aria-label={`Monto ${parts.integer},${parts.fraction} ${currency}. Toca para editar`}
        className="no-select relative mx-auto mt-1 block w-full max-w-full rounded-2xl px-1 py-0.5 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lav/60"
      >
        <motion.span
          key={currency}
          initial={{ opacity: 0.35, y: direction * 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            'tnum inline-flex items-baseline justify-center pb-1 font-semibold leading-[1.06] tracking-[-0.045em]',
            empty ? 'text-ink/35' : 'text-ink'
          )}
          style={{ fontSize: `${fontSize}px` }}
        >
          <span>{parts.integer}</span>
          <span className={empty ? 'text-ink/20' : 'text-muted/70'}> ,</span>
          <span
            className={cn(
              empty
                ? 'text-ink/20'
                : parts.hasFraction || editing
                  ? 'text-ink'
                  : 'text-muted/55'
            )}
          >
            {parts.fraction}
          </span>
          {(editing || empty) && <span className="caret-blink ml-0.5" aria-hidden />}
        </motion.span>
      </button>

      {/* Conversion — moves in the same direction as the currency */}
      <div className="mt-2 flex h-[24px] items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.p
            key={currency}
            custom={direction}
            initial={{ opacity: 0, y: direction * 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -10 }}
            transition={swap}
            className="flex items-baseline gap-1.5 whitespace-nowrap text-[16px] font-medium text-muted tnum"
          >
            <span className="text-[13px] text-muted/70">≈</span>
            <span className="text-[10px] font-semibold tracking-[0.12em] text-muted/70">
              {other}
            </span>
            <span className={cn('tracking-[-0.01em]', equivalent <= 0 && 'opacity-45')}>
              {formatMoney(equivalent)}
            </span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
