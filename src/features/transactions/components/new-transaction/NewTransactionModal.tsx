import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  CalendarDays,
  Check,
  ChevronDown,
  Pencil,
  Wallet,
  X,
} from 'lucide-react'
import type { Currency, TransactionType } from '@/types'
import { useCurrencyStore, useUIStore } from '@/store'
import { useDataStore } from '@/store/dataStore'
import { cn } from '@/lib/utils'
import {
  DEFAULT_ACCOUNTS,
  getLastAccountId,
  rememberLastAccountId,
  type Account,
} from '@/lib/accounts'
import {
  MAX_AMOUNT,
  applyPercent,
  convertAmount,
  evaluateExpression,
  formatRate,
  isOperatorish,
  parseRawAmount,
  roundMoney,
  roundToMicro,
  sanitizeEntry,
  toEntryValue,
  type Operator,
} from '@/lib/money'
import { AmountDisplay } from './AmountDisplay'
import { Keypad } from './Keypad'
import { DetailsSection } from './DetailsSection'
import { AccountPanel } from './AccountPanel'
import { DatePanel, isDateToday, isDateYesterday } from './DatePanel'
import { RateEditor } from './RateEditor'

const EASE = [0.32, 0.72, 0, 1] as const

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
  )

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)')
    const onChange = () => setIsDesktop(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

export function NewTransactionModal() {
  const isOpen = useUIStore((state) => state.isAddTransactionOpen)
  const close = useUIStore((state) => state.closeAddTransaction)

  return (
    <AnimatePresence>
      {isOpen && <MovementSheet key="movement-sheet" onClose={close} />}
    </AnimatePresence>
  )
}

function MovementSheet({ onClose }: { onClose: () => void }) {
  const reducedMotion = useReducedMotion() ?? false
  const isDesktop = useIsDesktop()

  const { categories, addTransaction } = useDataStore()
  const setLastCreatedTransactionId = useUIStore((state) => state.setLastCreatedTransactionId)
  const {
    activeCurrency,
    exchangeRate,
    effectiveDate,
    source,
    isStale,
    isLoadingRates,
    syncRates,
  } = useCurrencyStore()

  const [type, setType] = useState<TransactionType>('expense')
  const [currency, setCurrency] = useState<Currency>(() => activeCurrency)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [entry, setEntry] = useState('')
  const [tokens, setTokens] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [time, setTime] = useState<string | null>(null)
  const [panel, setPanel] = useState<'account' | 'date' | 'rate' | null>(null)
  const [customRate, setCustomRate] = useState<number | null>(null)
  const [accountId, setAccountId] = useState(getLastAccountId)
  const [amountError, setAmountError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [saved, setSaved] = useState(false)

  const sheetRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const amountRef = useRef<HTMLButtonElement>(null)
  const keypadRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const rate = customRate ?? (exchangeRate > 0 ? exchangeRate : 1)
  const otherCurrency: Currency = currency === 'USD' ? 'VES' : 'USD'
  const amountValue = parseRawAmount(entry)
  const equivalent = convertAmount(amountValue, currency, otherCurrency, rate)
  const availableCategories = useMemo(
    () => categories.filter((category) => category.group === type),
    [categories, type]
  )
  const selectedAccount =
    DEFAULT_ACCOUNTS.find((account) => account.id === accountId) ?? DEFAULT_ACCOUNTS[0]

  useEffect(() => {
    void syncRates()
  }, [syncRates])

  // Lock page scroll and keep focus inside the sheet.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    sheetRef.current?.focus({ preventScroll: true })

    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !sheetRef.current) return
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onTab)
    return () => window.removeEventListener('keydown', onTab)
  }, [])

  const activateAmount = () => {
    setEditing(true)
    setPanel(null)
    setAmountError('')
  }

  const pressDigit = (digit: string) => {
    setAmountError('')
    setEntry((previous) => {
      const base = previous === '0' ? '' : previous
      return sanitizeEntry(`${base}${digit}`) || '0'
    })
  }

  const pressDecimal = () => {
    setAmountError('')
    setEntry((previous) => {
      if (previous.includes('.')) return previous
      return previous ? `${previous}.` : '0.'
    })
  }

  const pressOperator = (operator: Operator) => {
    setAmountError('')
    setEditing(true)
    if (entry) {
      setTokens([...tokens, entry, operator])
      setEntry('')
      return
    }
    if (tokens.length === 0) return
    const last = tokens[tokens.length - 1]
    if (isOperatorish(last)) {
      setTokens([...tokens.slice(0, -1), operator])
    } else {
      setTokens([...tokens, operator])
    }
  }

  const pressBackspace = () => {
    setAmountError('')
    if (entry) {
      setEntry(entry.slice(0, -1))
      return
    }
    if (tokens.length === 0) return
    const last = tokens[tokens.length - 1]
    if (isOperatorish(last)) {
      setTokens(tokens.slice(0, -1))
    } else {
      setEntry(last)
      setTokens(tokens.slice(0, -1))
    }
  }

  const pressPercent = () => {
    setAmountError('')
    if (entry) {
      setEntry(applyPercent(entry))
      return
    }
    if (tokens.length === 0) return
    const last = tokens[tokens.length - 1]
    if (!isOperatorish(last)) {
      setEntry(applyPercent(last))
      setTokens(tokens.slice(0, -1))
    }
  }

  const resolveExpression = (): { value: number } | { error: string } => {
    if (tokens.length === 0) return { value: parseRawAmount(entry) }
    const all = entry ? [...tokens, entry] : [...tokens]
    const cleaned = all.length && isOperatorish(all[all.length - 1]) ? all.slice(0, -1) : all
    return evaluateExpression(cleaned)
  }

  const pressEquals = () => {
    const result = resolveExpression()
    if ('error' in result) {
      setAmountError(result.error)
      return
    }
    const rounded = roundMoney(result.value)
    if (rounded <= 0) {
      setAmountError('El resultado debe ser mayor a 0')
      return
    }
    if (rounded > MAX_AMOUNT) {
      setAmountError('El monto supera el límite permitido')
      return
    }
    setEntry(toEntryValue(rounded))
    setTokens([])
    setAmountError('')
    if (reducedMotion) {
      setEditing(false)
    } else {
      window.setTimeout(() => setEditing(false), 170)
    }
  }

  const changeCurrency = (next: Currency) => {
    if (next === currency) return
    const result = resolveExpression()
    if ('error' in result) {
      setAmountError(result.error)
      return
    }
    setDirection(next === 'VES' ? 1 : -1)
    setEntry(result.value > 0 ? toEntryValue(convertAmount(result.value, currency, next, rate)) : '')
    setTokens([])
    setCurrency(next)
    setAmountError('')
  }

  const changeType = (next: TransactionType) => {
    if (next === type) return
    setType(next)
    setCategoryError('')
    if (categoryId) {
      const category = categories.find((item) => item.id === categoryId)
      if (category?.group !== next) setCategoryId('')
    }
  }

  const handleBackdrop = () => {
    if (saved) return
    if (panel) {
      setPanel(null)
      return
    }
    if (editing) {
      setEditing(false)
      return
    }
    onClose()
  }

  const closeSheet = () => {
    if (saved) return
    onClose()
  }

  const handleSave = () => {
    if (saved) return

    const result = resolveExpression()
    if ('error' in result) {
      setAmountError(result.error)
      setEditing(true)
      setPanel(null)
      return
    }
    const value = roundMoney(result.value)
    if (!value || value <= 0) {
      setAmountError('Ingresa un monto mayor a 0')
      setEditing(true)
      setPanel(null)
      requestAnimationFrame(() =>
        amountRef.current?.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
      )
      return
    }
    if (value > MAX_AMOUNT) {
      setAmountError('El monto supera el límite permitido')
      return
    }
    if (!categoryId) {
      setEditing(false)
      setPanel(null)
      setDetailsOpen(true)
      setCategoryError('Elige una categoría para guardar')
      window.setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          block: 'center',
          behavior: reducedMotion ? 'auto' : 'smooth',
        })
      }, reducedMotion ? 0 : 90)
      return
    }

    const equivalentValue = roundMoney(convertAmount(value, currency, otherCurrency, rate))
    const transaction = addTransaction({
      type,
      amount: value,
      currency,
      category_id: categoryId,
      description: description.trim() || undefined,
      date,
      time: time || null,
      account_id: accountId,
      exchange_rate: roundToMicro(rate),
      exchange_rate_source: customRate ? 'MANUAL' : source,
      exchange_rate_date: effectiveDate,
      equivalent_amount: equivalentValue,
    })

    setLastCreatedTransactionId(transaction.id)
    setTokens([])
    setEntry(toEntryValue(value))
    setSaved(true)
    setEditing(false)
    window.setTimeout(onClose, reducedMotion ? 120 : 560)
  }

  // Physical keyboard: full calculator entry on desktop.
  const keyHandlerRef = useRef<(event: KeyboardEvent) => void>(() => {})
  keyHandlerRef.current = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return
    const target = event.target as HTMLElement | null
    const isTypingField =
      target instanceof HTMLElement &&
      Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))

    if (event.key === 'Escape') {
      event.preventDefault()
      if (panel) setPanel(null)
      else if (editing) setEditing(false)
      else onClose()
      return
    }
    if (isTypingField) return
    if (saved) return

    if (/^\d$/.test(event.key)) {
      event.preventDefault()
      setEditing(true)
      setPanel(null)
      pressDigit(event.key)
      return
    }
    if (event.key === ',' || event.key === '.') {
      event.preventDefault()
      setEditing(true)
      setPanel(null)
      pressDecimal()
      return
    }
    if (event.key === '+') {
      event.preventDefault()
      pressOperator('+')
      return
    }
    if (event.key === '-') {
      event.preventDefault()
      pressOperator('-')
      return
    }
    if (event.key === '*' || event.key.toLowerCase() === 'x') {
      event.preventDefault()
      pressOperator('*')
      return
    }
    if (event.key === '/') {
      event.preventDefault()
      pressOperator('/')
      return
    }
    if (event.key === '%') {
      event.preventDefault()
      pressPercent()
      return
    }
    if (event.key === 'Backspace') {
      event.preventDefault()
      pressBackspace()
      return
    }
    if (event.key === 'Enter') {
      const onButton =
        target instanceof HTMLElement &&
        Boolean(target.closest('button, a, [role="button"]'))
      if (onButton) return
      event.preventDefault()
      if (editing) pressEquals()
      else if (!panel) handleSave()
    }
  }

  useEffect(() => {
    const listener = (event: KeyboardEvent) => keyHandlerRef.current(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  const revealKeypad = () => {
    const body = bodyRef.current
    const keypad = keypadRef.current
    if (!body || !keypad) return
    const bodyRect = body.getBoundingClientRect()
    const keypadRect = keypad.getBoundingClientRect()
    const overflow = keypadRect.bottom - bodyRect.bottom + 10
    if (overflow > 0) {
      body.scrollBy({ top: overflow, behavior: reducedMotion ? 'auto' : 'smooth' })
    }
  }

  const dateLabel = useMemo(() => {
    const base = isDateToday(date)
      ? 'Hoy'
      : isDateYesterday(date)
        ? 'Ayer'
        : format(parseISO(date), 'd MMM', { locale: es })
    return time ? `${base} · ${time}` : base
  }, [date, time])

  const sheetTransition = reducedMotion
    ? { duration: 0 }
    : isDesktop
      ? { duration: 0.28, ease: EASE }
      : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.9 }

  const expandTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: EASE }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.22 }}
        onClick={handleBackdrop}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[3px] sm:bg-ink/35"
      />

      <motion.div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movement-title"
        initial={isDesktop ? { opacity: 0, scale: 0.97, y: 12 } : { y: '100%' }}
        animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
        exit={isDesktop ? { opacity: 0, scale: 0.985, y: 10 } : { y: '100%' }}
        transition={sheetTransition}
        className="relative z-10 flex w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-sheet outline-none sm:max-w-[472px] sm:rounded-[30px]"
        style={{ maxHeight: isDesktop ? 'min(94vh, 900px)' : 'min(92dvh, 900px)' }}
      >
        <div className="pt-2.5 sm:hidden">
          <div className="sheet-grabber mx-auto" />
        </div>

        <header className="flex shrink-0 items-center justify-between px-5 pb-1 pt-2 sm:pt-4">
          <h2
            id="movement-title"
            className="text-[19px] font-semibold tracking-[-0.025em] text-ink"
          >
            Nuevo movimiento
          </h2>
          <motion.button
            type="button"
            onClick={closeSheet}
            aria-label="Cerrar"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
            className="grid h-9 w-9 place-items-center rounded-full bg-mist text-muted transition-colors hover:bg-[#ECEAF8] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lav/60"
          >
            <X className="h-[17px] w-[17px]" strokeWidth={2.2} />
          </motion.button>
        </header>

        <div
          ref={bodyRef}
          onPointerDown={(event) => {
            if (!editing) return
            const target = event.target as Node
            if (keypadRef.current?.contains(target) || amountRef.current?.contains(target)) return
            setEditing(false)
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-1"
        >
          {/* Gasto / Ingreso */}
          <div
            className="relative grid grid-cols-2 rounded-full bg-surface-container-low p-1"
            role="tablist"
            aria-label="Tipo de movimiento"
          >
            {(
              [
                ['expense', 'Gasto'],
                ['income', 'Ingreso'],
              ] as const
            ).map(([value, label]) => {
              const active = type === value
              const isExpense = value === 'expense'
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeType(value)}
                  className={cn(
                    'relative z-10 h-9 rounded-full text-[13px] font-bold tracking-[-0.01em] transition-colors duration-150',
                    active
                      ? isExpense
                        ? 'text-error'
                        : 'text-secondary'
                      : 'text-on-surface-variant/80 hover:text-on-surface'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="movement-type-pill"
                      className={cn(
                        'absolute inset-0 rounded-full border shadow-xs',
                        isExpense
                          ? 'border-error/20 bg-error-container/60'
                          : 'border-secondary/20 bg-secondary-container/40'
                      )}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 460, damping: 36 }
                      }
                    />
                  )}
                  <span className="relative">{label}</span>
                </button>
              )
            })}
          </div>

          <AmountDisplay
            currency={currency}
            entry={entry}
            tokens={tokens}
            equivalent={equivalent}
            editing={editing}
            direction={direction}
            reducedMotion={reducedMotion}
            onActivate={activateAmount}
            onCurrencyChange={changeCurrency}
            amountRef={amountRef}
          />

          <AnimatePresence initial={false}>
            {amountError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.16 }}
                className="overflow-hidden pb-0.5 text-center text-[11.5px] font-medium text-danger"
              >
                {amountError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* BCV rate — secondary, editable only for this movement */}
          <div className="mt-1.5 flex h-5 items-center justify-center">
            <button
              type="button"
              onClick={() => setPanel(panel === 'rate' ? null : 'rate')}
              aria-expanded={panel === 'rate'}
              title={`Fuente: ${customRate ? 'tasa editada' : isStale ? 'última tasa guardada' : 'BCV'} · ${effectiveDate}`}
              className={cn(
                'group inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-medium text-muted transition-colors hover:bg-mist/80 hover:text-ink/70',
                panel === 'rate' && 'bg-mist/80 text-ink/70'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isLoadingRates
                    ? 'animate-pulse bg-accent-deep'
                    : isStale
                      ? 'bg-lav'
                      : 'bg-accent-deep'
                )}
              />
              <span>{customRate || source === 'MANUAL' ? 'Tasa' : 'BCV'}:</span>
              <span>
                1 USD = <span className="tnum text-ink/60">{formatRate(rate)}</span> VES
              </span>
              <Pencil className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-80" />
            </button>
          </div>

          <AnimatePresence initial={false} mode="wait">
            {panel === 'rate' && (
              <motion.div
                key="rate"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={expandTransition}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <RateEditor
                    rate={rate}
                    effectiveDate={effectiveDate}
                    isStale={isStale}
                    isCustom={customRate !== null}
                    onApply={(nextRate) => setCustomRate(nextRate)}
                    onReset={() => setCustomRate(null)}
                    onClose={() => setPanel(null)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account, date and optional details collapse into "focus mode" while
              the calculator is open, so the amount + keypad always fit together. */}
          <AnimatePresence initial={false}>
            {!editing && (
              <motion.div
                key="secondary-controls"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={expandTransition}
                className="overflow-hidden"
              >
          {/* Account + date */}
          <div className="mt-3.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setPanel(panel === 'account' ? null : 'account')
                setEditing(false)
              }}
              aria-expanded={panel === 'account'}
              className={cn(
                'flex h-9 min-w-0 items-center gap-1.5 rounded-full pl-2.5 pr-2 text-[12.5px] font-medium text-ink/75 transition-colors hover:bg-mist',
                panel === 'account' && 'bg-mist'
              )}
            >
              <Wallet className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={2} />
              <span className="max-w-[150px] truncate">{selectedAccount.name}</span>
              <ChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 text-muted transition-transform duration-200',
                  panel === 'account' && 'rotate-180'
                )}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setPanel(panel === 'date' ? null : 'date')
                setEditing(false)
              }}
              aria-expanded={panel === 'date'}
              className={cn(
                'flex h-9 max-w-[170px] items-center gap-1.5 rounded-full pl-2.5 pr-2 text-[12.5px] font-medium text-ink/75 transition-colors hover:bg-mist',
                panel === 'date' && 'bg-mist'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={2} />
              <span className="truncate">{dateLabel}</span>
              <ChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 text-muted transition-transform duration-200',
                  panel === 'date' && 'rotate-180'
                )}
              />
            </button>
          </div>

          <AnimatePresence initial={false} mode="wait">
            {panel === 'account' && (
              <motion.div
                key="account"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={expandTransition}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <AccountPanel
                    accounts={DEFAULT_ACCOUNTS}
                    selectedId={accountId}
                    onSelect={(account: Account) => {
                      setAccountId(account.id)
                      rememberLastAccountId(account.id)
                      setPanel(null)
                    }}
                    onClose={() => setPanel(null)}
                  />
                </div>
              </motion.div>
            )}

            {panel === 'date' && (
              <motion.div
                key="date"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={expandTransition}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <DatePanel
                    date={date}
                    time={time}
                    onDate={setDate}
                    onTime={setTime}
                    onClose={() => setPanel(null)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progressive disclosure */}
          <div className="mt-1 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setDetailsOpen((open) => !open)
                setEditing(false)
              }}
              aria-expanded={detailsOpen}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lav/60"
            >
              {detailsOpen ? 'Ocultar detalles' : 'Agregar detalles'}
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-250',
                  detailsOpen && 'rotate-180'
                )}
                strokeWidth={2}
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {detailsOpen && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={expandTransition}
                className="overflow-hidden"
              >
                <div ref={detailsRef}>
                  <DetailsSection
                    categories={availableCategories}
                    selectedId={categoryId}
                    onSelect={(id) => {
                      setCategoryId(id)
                      setCategoryError('')
                    }}
                    description={description}
                    onDescription={setDescription}
                    error={categoryError}
                    reducedMotion={reducedMotion}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {editing && (
              <motion.div
                key="keypad"
                ref={keypadRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={expandTransition}
                onAnimationComplete={() => {
                  if (editing) revealKeypad()
                }}
                className="overflow-hidden"
              >
                <Keypad
                  onDigit={pressDigit}
                  onDecimal={pressDecimal}
                  onOperator={pressOperator}
                  onPercent={pressPercent}
                  onBackspace={pressBackspace}
                  onEquals={pressEquals}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-2" />
        </div>

        <footer
          className="shrink-0 bg-white px-5 pt-2"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saved}
            whileTap={saved ? undefined : { scale: 0.988 }}
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
            className={cn(
              'relative flex h-[56px] w-full items-center justify-center gap-2 overflow-hidden rounded-[20px]',
              'bg-secondary-fixed text-[15px] font-bold tracking-[-0.01em] text-on-secondary-fixed',
              'shadow-fab glow-lime',
              'transition-colors duration-200 hover:bg-[#D2FF62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2',
              saved && 'pointer-events-none'
            )}
          >
            <AnimatePresence initial={false} mode="wait">
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-[18px] w-[18px]" strokeWidth={2.6} />
                  {type === 'expense' ? 'Gasto guardado' : 'Ingreso guardado'}
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }}
                >
                  {type === 'expense' ? 'Guardar gasto' : 'Guardar ingreso'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <span className="sr-only" aria-live="polite">
            {saved ? 'Movimiento guardado' : amountError || categoryError}
          </span>
        </footer>
      </motion.div>
    </div>
  )
}
