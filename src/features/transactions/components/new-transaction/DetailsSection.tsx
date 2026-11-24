import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Category } from '@/types'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { cn } from '@/lib/utils'

const SHORT_LABELS: Record<string, string> = {
  Alimentación: 'Comida',
  Vivienda: 'Hogar',
  Entretenimiento: 'Ocio',
  Educación: 'Estudio',
  'Comida a domicilio': 'Delivery',
  Cafeterías: 'Café',
  'Otros gastos': 'Otros',
  'Otros ingresos': 'Otros',
}

const titleOf = (category: Category) => SHORT_LABELS[category.name] ?? category.name

interface DetailsSectionProps {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
  description: string
  onDescription: (value: string) => void
  error?: string
  reducedMotion: boolean
}

export function DetailsSection({
  categories,
  selectedId,
  onSelect,
  description,
  onDescription,
  error,
  reducedMotion,
}: DetailsSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 104)}px`
  }, [description])

  return (
    <div className="pt-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Categoría
        </span>
        {!selectedId && (
          <span className="text-[11px] font-medium text-muted/70">Requerida</span>
        )}
      </div>

      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1.5 [scrollbar-width:none]"
        role="listbox"
        aria-label="Categoría del movimiento"
      >
        {categories.map((category) => {
          const selected = category.id === selectedId
          return (
            <motion.button
              key={category.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(category.id)}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 520, damping: 38 }}
              className={cn(
                'flex h-9 shrink-0 items-center gap-1.5 rounded-full border pl-1.5 pr-3 text-[12.5px] font-medium transition-colors duration-150',
                selected
                  ? 'border-accent bg-accent text-ink'
                  : 'border-hairline bg-white text-ink/70 hover:border-lav/60 hover:bg-lav-tint'
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 place-items-center rounded-full',
                  selected ? 'bg-ink/10 text-ink' : 'bg-mist text-muted'
                )}
              >
                <CategoryIcon
                  name={category.icon || category.name}
                  className="h-[13px] w-[13px]"
                  strokeWidth={2.1}
                />
              </span>
              {titleOf(category)}
            </motion.button>
          )
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: reducedMotion ? 0 : -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-[11.5px] font-medium text-danger"
        >
          {error}
        </motion.p>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        maxLength={140}
        value={description}
        onChange={(event) => onDescription(event.target.value)}
        placeholder="¿En qué consistió este movimiento?"
        aria-label="Descripción del movimiento"
        className={cn(
          'mt-3 w-full resize-none rounded-[16px] border border-transparent bg-mist/70 px-4 py-3',
          'min-h-[46px] text-[14.5px] leading-[22px] text-ink outline-none transition-colors',
          'placeholder:text-muted/70 focus:border-lav/50 focus:bg-lav-tint'
        )}
      />
    </div>
  )
}
