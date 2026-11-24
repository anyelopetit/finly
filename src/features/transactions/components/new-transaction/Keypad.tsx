import { motion } from 'framer-motion'
import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Operator } from '@/lib/money'

interface KeypadProps {
  onDigit: (digit: string) => void
  onDecimal: () => void
  onOperator: (operator: Operator) => void
  onPercent: () => void
  onBackspace: () => void
  onEquals: () => void
}

interface KeyProps {
  children: React.ReactNode
  label: string
  onClick: () => void
  tone?: 'digit' | 'operator' | 'utility' | 'equals'
  className?: string
}

function Key({ children, label, onClick, tone = 'digit', className }: KeyProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.955 }}
      transition={{ type: 'spring', stiffness: 650, damping: 40 }}
      className={cn(
        'flex h-[46px] select-none touch-manipulation items-center justify-center rounded-[13px] text-[20px] font-medium leading-none outline-none',
        'transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-lav/70',
        '[-webkit-tap-highlight-color:transparent]',
        tone === 'digit' && 'bg-white text-on-surface shadow-key hover:bg-surface-container-low',
        tone === 'operator' && 'bg-primary-fixed/40 text-primary font-bold hover:bg-primary-fixed/70',
        tone === 'utility' && 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
        tone === 'equals' &&
          'bg-secondary-fixed text-on-secondary-fixed font-bold shadow-fab glow-lime hover:bg-[#D2FF62]',
        className
      )}
    >
      {children}
    </motion.button>
  )
}

export function Keypad({
  onDigit,
  onDecimal,
  onOperator,
  onPercent,
  onBackspace,
  onEquals,
}: KeypadProps) {
  return (
    <div
      className="mt-2.5 grid grid-cols-4 grid-rows-5 gap-[5px] rounded-[20px] bg-[#F7F6FF] p-1.5"
      role="group"
      aria-label="Teclado numérico"
    >
      <Key tone="utility" label="Borrar último dígito" onClick={onBackspace}>
        <Delete className="h-[19px] w-[19px]" strokeWidth={1.9} />
      </Key>
      <Key tone="utility" label="Porcentaje" onClick={onPercent}>
        <span className="text-[17px] font-medium">%</span>
      </Key>
      <Key tone="operator" label="Dividir" onClick={() => onOperator('/')}>
        ÷
      </Key>
      <Key tone="operator" label="Multiplicar" onClick={() => onOperator('*')}>
        ×
      </Key>

      <Key label="7" onClick={() => onDigit('7')}>
        7
      </Key>
      <Key label="8" onClick={() => onDigit('8')}>
        8
      </Key>
      <Key label="9" onClick={() => onDigit('9')}>
        9
      </Key>
      <Key tone="operator" label="Restar" onClick={() => onOperator('-')}>
        −
      </Key>

      <Key label="4" onClick={() => onDigit('4')}>
        4
      </Key>
      <Key label="5" onClick={() => onDigit('5')}>
        5
      </Key>
      <Key label="6" onClick={() => onDigit('6')}>
        6
      </Key>
      <Key tone="operator" label="Sumar" onClick={() => onOperator('+')}>
        +
      </Key>

      <Key label="1" onClick={() => onDigit('1')}>
        1
      </Key>
      <Key label="2" onClick={() => onDigit('2')}>
        2
      </Key>
      <Key label="3" onClick={() => onDigit('3')}>
        3
      </Key>
      <Key
        tone="equals"
        label="Calcular resultado"
        onClick={onEquals}
        className="col-start-4 row-span-2 row-start-4 h-full text-[25px] font-semibold"
      >
        =
      </Key>

      <Key label="0" onClick={() => onDigit('0')} className="col-span-2">
        0
      </Key>
      <Key label="Separador decimal" onClick={onDecimal}>
        ,
      </Key>
    </div>
  )
}
