import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
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
  onOpenCreateCategory?: () => void
  selectedSubcategory?: string | null
  onSelectSubcategory?: (sub: string | null) => void
}

export function DetailsSection({
  categories,
  selectedId,
  onSelect,
  description,
  onDescription,
  error,
  reducedMotion,
  onOpenCreateCategory,
  selectedSubcategory,
  onSelectSubcategory,
}: DetailsSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 104)}px`
  }, [description])

  const activeCategory = categories.find((c) => c.id === selectedId)
  const subcategories = activeCategory?.subcategories || []

  return (
    <div className="pt-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Categoría
        </span>
        <div className="flex items-center gap-2">
          {!selectedId && (
            <span className="text-[11px] font-medium text-muted/70">Requerida</span>
          )}
          {onOpenCreateCategory && (
            <button
              type="button"
              onClick={onOpenCreateCategory}
              className="inline-flex items-center gap-1 text-[11.5px] font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span>Nueva</span>
            </button>
          )}
        </div>
      </div>

      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1.5 [scrollbar-width:none]"
        role="listbox"
        aria-label="Categoría del movimiento"
      >
        {/* New Category Quick Button */}
        {onOpenCreateCategory && (
          <button
            type="button"
            onClick={onOpenCreateCategory}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full border border-dashed border-primary/50 bg-primary-fixed/20 px-3 text-[12px] font-bold text-primary hover:bg-primary-fixed/40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Crear</span>
          </button>
        )}

        {categories.map((category) => {
          const selected = category.id === selectedId
          return (
            <motion.button
              key={category.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onSelect(category.id)
                if (onSelectSubcategory) {
                  onSelectSubcategory(null)
                }
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 520, damping: 38 }}
              className={cn(
                'flex h-9 shrink-0 items-center gap-1.5 rounded-full border pl-1.5 pr-3 text-[12.5px] font-medium transition-colors duration-150',
                selected
                  ? 'border-primary bg-primary-fixed/40 text-primary font-bold shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-low'
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 place-items-center rounded-full',
                  selected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
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

      {/* Subcategories Row if available */}
      <AnimatePresence>
        {subcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted mb-1.5">
              <span>Subcategoría (opcional)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {subcategories.map((sub) => {
                const isSelected = selectedSubcategory === sub
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      if (onSelectSubcategory) {
                        onSelectSubcategory(isSelected ? null : sub)
                      }
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-hairline hover:bg-surface-container'
                    )}
                  >
                    {sub}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
