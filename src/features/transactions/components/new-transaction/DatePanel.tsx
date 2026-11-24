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
                isSelected && 'bg-ink font-semibold text-white',
                !isSelected && outside && 'text-muted/35 hover:bg-mist/70',
                !isSelected && !outside && 'text-ink/80 hover:bg-mist',
                !isSelected && today && 'font-semibold text-ink'
              )}
            >
              {format(day, 'd')}
              {today && !isSelected && (
                <span className="absolute bottom-[3px] h-1 w-1 rounded-full bg-accent-deep" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center gap-1.5 border-t border-hairline/80 pt-2.5">
        <button
          type="button"
          onClick={() => {
            const today = new Date()
            onDate(format(today, 'yyyy-MM-dd'))
            setView(startOfMonth(today))
          }}
          className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:bg-lav-soft"
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
          className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-ink/70 hover:bg-lav-soft"
        >
          Ayer
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {timeEnabled ? (
            <div className="flex items-center gap-1 rounded-full bg-mist pl-2 pr-1">
              <Clock3 className="h-3 w-3 text-muted" />
              <input
                type="time"
                value={time ?? ''}
                onChange={(event) => onTime(event.target.value || null)}
                aria-label="Hora del movimiento"
                className="w-[72px] bg-transparent py-1 text-[11.5px] font-medium text-ink outline-none tnum"
              />
              <button
                type="button"
                onClick={toggleTime}
                aria-label="Quitar hora"
                className="grid h-5 w-5 place-items-center rounded-full text-muted hover:bg-white hover:text-ink"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleTime}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-muted hover:bg-mist hover:text-ink"
            >
              <Clock3 className="h-3 w-3" />
              Añadir hora
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-ink/90"
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
