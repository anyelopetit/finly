import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock3, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

interface DatePanelProps {
  date: string
  time: string | null
  onDate: (isoDate: string) => void
  onTime: (time: string | null) => void
  onClose: () => void
}

export function DatePanel({ date, time, onDate, onTime, onClose }: DatePanelProps) {
  const selected = useMemo(() => parseISO(date), [date])
  const [view, setView] = useState(() => startOfMonth(selected))
  const [timeEnabled, setTimeEnabled] = useState(Boolean(time))

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(view, { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(view), { weekStartsOn: 1 }),
      }),
    [view]
  )

  const toggleTime = () => {
    if (timeEnabled) {
      setTimeEnabled(false)
      onTime(null)
    } else {
      setTimeEnabled(true)
      onTime(format(new Date(), 'HH:mm'))
    }
  }

  return (
    <div className="rounded-[20px] border border-hairline bg-white p-3 shadow-pop">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => setView((current) => subMonths(current, 1))}
          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-[13px] font-semibold capitalize tracking-[-0.01em] text-ink">
          {format(view, "MMMM 'de' yyyy", { locale: es })}
        </p>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => setView((current) => addMonths(current, 1))}
          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted/70"
          >
            {day}
          </span>
        ))}
        {days.map((day) => {
          const isSelected = isSameDay(day, selected)
          const today = isToday(day)
          const outside = !isSameMonth(day, view)
          return (
            <button
              key={day.toISOString()}
              type="button"
              aria-label={format(day, "d 'de' MMMM 'de' yyyy", { locale: es })}
              aria-current={isSelected ? 'date' : undefined}
              onClick={() => {
                onDate(format(day, 'yyyy-MM-dd'))
                if (!isSameMonth(day, view)) setView(startOfMonth(day))
              }}
              className={cn(
                'relative mx-auto grid h-9 w-9 place-items-center rounded-full text-[12.5px] font-medium transition-colors duration-100',
                isSelected && 'bg-primary font-bold text-white shadow-sm',
                !isSelected && outside && 'text-on-surface-variant/40 hover:bg-surface-container-low',
                !isSelected && !outside && 'text-on-surface hover:bg-surface-container-low',
                !isSelected && today && 'font-bold text-primary'
              )}
            >
              {format(day, 'd')}
              {today && !isSelected && (
                <span className="absolute bottom-[3px] h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center gap-1.5 border-t border-outline-variant/30 pt-2.5">
        <button
          type="button"
          onClick={() => {
            const today = new Date()
            onDate(format(today, 'yyyy-MM-dd'))
            setView(startOfMonth(today))
          }}
          className="rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
        >
          Hoy
        </button>
        <button
          type="button"
          onClick={() => {
            const yesterday = subDays(new Date(), 1)
            onDate(format(yesterday, 'yyyy-MM-dd'))
            setView(startOfMonth(yesterday))
          }}
          className="rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
        >
          Ayer
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {timeEnabled ? (
            <div className="flex items-center gap-1 rounded-full bg-surface-container-low pl-2 pr-1">
              <Clock3 className="h-3 w-3 text-on-surface-variant" />
              <input
                type="time"
                value={time ?? ''}
                onChange={(event) => onTime(event.target.value || null)}
                aria-label="Hora del movimiento"
                className="w-[72px] bg-transparent py-1 text-[11.5px] font-medium text-on-surface outline-none tnum"
              />
              <button
                type="button"
                onClick={toggleTime}
                aria-label="Quitar hora"
                className="grid h-5 w-5 place-items-center rounded-full text-on-surface-variant hover:bg-white hover:text-on-surface"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleTime}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            >
              <Clock3 className="h-3 w-3" />
              Añadir hora
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-secondary-fixed text-on-secondary-fixed px-3.5 py-1.5 text-[11px] font-bold shadow-sm hover:bg-[#D2FF62]"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  )
}

export const isDateToday = (date: string) => isToday(parseISO(date))
export const isDateYesterday = (date: string) => isYesterday(parseISO(date))
