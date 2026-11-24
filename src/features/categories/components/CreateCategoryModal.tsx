import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Tag,
  ShoppingBag,
  Utensils,
  Car,
  HeartPulse,
  Home,
  Film,
  BookOpen,
  Briefcase,
  Laptop,
  Plane,
  Coffee,
  Dumbbell,
  Gift,
  DollarSign,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Gamepad2,
  Dog,
  Baby,
  Music,
  Smartphone,
  Sparkles,
  Smile,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { useDataStore } from '@/store'
import type { Category, CreateCategoryInput, TransactionType } from '@/types'
import { cn } from '@/lib/utils'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType?: TransactionType
  onCategoryCreated?: (category: Category) => void
}

const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Utensils', icon: Utensils },
  { name: 'Car', icon: Car },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'Home', icon: Home },
  { name: 'Film', icon: Film },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Laptop', icon: Laptop },
  { name: 'Plane', icon: Plane },
  { name: 'Coffee', icon: Coffee },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Gift', icon: Gift },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'PiggyBank', icon: PiggyBank },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Dog', icon: Dog },
  { name: 'Baby', icon: Baby },
  { name: 'Music', icon: Music },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Tag', icon: Tag },
  { name: 'Shield', icon: Shield },
  { name: 'Smile', icon: Smile },
]

const PALETTE_COLORS = [
  '#5D39AE', // Finly Purple
  '#4D6700', // Lime Accent
  '#006688', // Cyan Blue
  '#BA1A1A', // Coral Red
  '#007A33', // Emerald Green
  '#F0B90B', // Crypto Gold
  '#FF5A00', // Energetic Orange
  '#7414CA', // Electric Violet
]

export function CreateCategoryModal({
  isOpen,
  onClose,
  defaultType = 'expense',
  onCategoryCreated,
}: CreateCategoryModalProps) {
  const { addCategory } = useDataStore()

  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>(defaultType)
  const [selectedIconName, setSelectedIconName] = useState('Tag')
  const [selectedColor, setSelectedColor] = useState('#5D39AE')
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [currentSubInput, setCurrentSubInput] = useState('')

  const handleAddSubcategory = () => {
    const trimmed = currentSubInput.trim()
    if (trimmed && !subcategories.includes(trimmed)) {
      setSubcategories([...subcategories, trimmed])
      setCurrentSubInput('')
    }
  }

  const handleRemoveSubcategory = (sub: string) => {
    setSubcategories(subcategories.filter((s) => s !== sub))
  }

  const handleReset = () => {
    setName('')
    setType(defaultType)
    setSelectedIconName('Tag')
    setSelectedColor('#5D39AE')
    setSubcategories([])
    setCurrentSubInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newCat = addCategory({
      name: name.trim(),
      type,
      icon: selectedIconName,
      color: selectedColor,
      subcategories: subcategories.length ? subcategories : undefined,
    })

    handleReset()
    if (onCategoryCreated) {
      onCategoryCreated(newCat)
    }
    onClose()
  }

  const SelectedIconComp =
    AVAILABLE_ICONS.find((i) => i.name === selectedIconName)?.icon || Tag

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-[28px] shadow-2xl z-10 overflow-hidden border border-hairline"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-container-low/30">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl grid place-items-center text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                >
                  <SelectedIconComp className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-title-lg font-bold text-on-surface">Nueva Categoría</h2>
                  <p className="text-body-sm text-on-surface-variant">Personaliza iconos, colores y subcategorías</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Tipo de movimiento
                </label>
                <div className="flex rounded-xl bg-surface-container-low p-1 border border-hairline">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-label-sm font-bold transition-all',
                      type === 'expense'
                        ? 'bg-error-container/60 text-error shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    )}
                  >
                    Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-label-sm font-bold transition-all',
                      type === 'income'
                        ? 'bg-secondary-fixed text-on-secondary-fixed shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    )}
                  >
                    Ingreso
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-label-sm font-semibold text-on-surface mb-1">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Mascotas, Freelance, Gym"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-hairline text-body-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Color distintivo
                </label>
                <div className="flex gap-2.5 items-center">
                  {PALETTE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={cn(
                        'w-7 h-7 rounded-full transition-transform',
                        selectedColor === c
                          ? 'scale-125 ring-2 ring-primary ring-offset-2'
                          : 'hover:scale-110 opacity-80 hover:opacity-100'
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Icono representativo
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-surface-container-low rounded-2xl border border-hairline">
                  {AVAILABLE_ICONS.map(({ name: iconName, icon: IconComponent }) => {
                    const isSelected = selectedIconName === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setSelectedIconName(iconName)}
                        className={cn(
                          'p-2.5 rounded-xl flex items-center justify-center transition-all',
                          isSelected
                            ? 'bg-primary text-white shadow-sm scale-105'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                        )}
                        title={iconName}
                      >
                        <IconComponent className="h-5 w-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subcategories / Tags */}
              <div>
                <label className="block text-label-sm font-semibold text-on-surface mb-1">
                  Subcategorías o etiquetas (opcional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSubInput}
                    onChange={(e) => setCurrentSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSubcategory()
                      }
                    }}
                    placeholder="Ej. Comida, Veterinario, Snack"
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low border border-hairline text-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-3.5 py-2 rounded-xl bg-surface-container font-bold text-label-sm text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface border border-hairline"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(sub)}
                          className="hover:text-error transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-label-md font-bold shadow-md hover:bg-primary/90 disabled:opacity-40 transition-all"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
