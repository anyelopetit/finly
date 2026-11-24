// ============================================================
// Finly — exact money math for the movement sheet
// Keeps every operation on integer micro-units so the huge
// display never shows floating point noise (0.1 + 0.2).
// ============================================================

export const MAX_AMOUNT = 999_999_999.99

const MICRO = 1_000_000n
const CENT = 100n

export type Operator = '+' | '-' | '*' | '/'

const OPERATOR_LABEL: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
}

export const operatorLabel = (op: string) => OPERATOR_LABEL[op as Operator] ?? op

export const isOperatorish = (token: string): boolean =>
  token === '+' || token === '-' || token === '*' || token === '/'

const divRound = (a: bigint, b: bigint): bigint => {
  if (b === 0n) throw new Error('DIVISION_BY_ZERO')
  const q = a / b
  const r = a % b
  if (r === 0n) return q
  const negative = a < 0n !== b < 0n
  const absR = r < 0n ? -r : r
  const absB = b < 0n ? -b : b
  if (absR * 2n >= absB) return negative ? q - 1n : q + 1n
  return q
}

const decimalToMicro = (raw: string): bigint | null => {
  const value = raw.trim().replace(',', '.')
  if (!value || !/^\d*(\.\d*)?$/.test(value) || value === '.') return null
  const [int = '', frac = ''] = value.split('.')
  const padded = (frac + '000000').slice(0, 6)
  return BigInt((int || '0') + padded)
}

export const roundMoney = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export const roundToMicro = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000
}

export const toEntryValue = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return value === 0 ? '0' : ''
  const fixed = value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
  return fixed || '0'
}

export const toMicro = (raw: string): bigint | null => decimalToMicro(raw)

export const parseRawAmount = (raw: string): number => {
  if (!raw) return 0
  const micro = decimalToMicro(raw)
  if (micro === null) return 0
  return Number(micro) / 1_000_000
}

export const sanitizeEntry = (raw: string): string => {
  if (!raw) return ''
  const cleaned = raw.replace(',', '.').replace(/[^\d.]/g, '')
  const [intRaw = '', ...rest] = cleaned.split('.')
  const int = intRaw.replace(/^0+(?=\d)/, '').slice(0, 9)
  if (rest.length === 0) return int
  const frac = rest.join('').slice(0, 2)
  return `${int || '0'}.${frac}`
}

const groupInteger = (digits: string): string =>
  new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 }).format(
    Number(digits || '0')
  )

export interface AmountParts {
  integer: string
  fraction: string
  hasFraction: boolean
}

export const splitAmount = (raw: string): AmountParts => {
  const [intRaw = '', fracRaw] = raw.split('.')
  return {
    integer: groupInteger(intRaw.replace(/^0+(?=\d)/, '')),
    fraction: fracRaw ?? '00',
    hasFraction: fracRaw !== undefined,
  }
}

export const formatMoney = (value: number, digits = 2): string =>
  new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0)

export const formatMoneyRaw = (raw: string): string => {
  if (!raw) return '0,00'
  const parts = splitAmount(raw)
  return `${parts.integer},${parts.fraction.padEnd(2, '0').slice(0, 2)}`
}

export const formatRate = (value: number): string =>
  new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(Number.isFinite(value) ? value : 0)

/** Accepts "919,8227", "919.8227" and "1.000,50". */
export const parseRateInput = (input: string): number | null => {
  let value = input.trim().replace(/\s/g, '')
  if (!value) return null
  const hasComma = value.includes(',')
  const hasDot = value.includes('.')
  if (hasComma && hasDot) {
    const decimalSep = value.lastIndexOf(',') > value.lastIndexOf('.') ? ',' : '.'
    const thousandSep = decimalSep === ',' ? '.' : ','
    value = value.split(thousandSep).join('').replace(decimalSep, '.')
  } else if (hasComma) {
    value = value.replace(',', '.')
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export const convertAmount = (
  amount: number,
  from: 'USD' | 'VES',
  to: 'USD' | 'VES',
  rate: number
): number => {
  if (from === to) return amount
  if (!rate || rate <= 0) return 0
  return from === 'USD' ? roundToMicro(amount * rate) : roundToMicro(amount / rate)
}

export type Evaluation = { value: number; error?: never } | { value?: never; error: string }

/**
 * Evaluates a calculator expression in a single pass with standard
 * multiplication/division precedence. Money is rounded once, at the end.
 */
export function evaluateExpression(tokens: string[]): Evaluation {
  const cleaned = tokens.filter((token) => token !== '')
  if (cleaned.length === 0) return { error: 'Ingresa un monto' }

  const operands: bigint[] = []
  const operators: Operator[] = []

  for (let i = 0; i < cleaned.length; i++) {
    const token = cleaned[i]
    if (i % 2 === 0) {
      const micro = decimalToMicro(token)
      if (micro === null) return { error: 'Expresión no válida' }
      operands.push(micro)
    } else {
      if (!['+', '-', '*', '/'].includes(token)) return { error: 'Expresión no válida' }
      operators.push(token as Operator)
    }
  }

  if (operands.length !== operators.length + 1) return { error: 'Expresión incompleta' }

  // First pass: × and ÷
  for (let i = 0; i < operators.length; ) {
    const op = operators[i]
    if (op === '*' || op === '/') {
      const left = operands[i]
      const right = operands[i + 1]
      if (op === '/' && right === 0n) return { error: 'No se puede dividir entre 0' }
      let result: bigint
      try {
        result = op === '*' ? divRound(left * right, MICRO) : divRound(left * MICRO, right)
      } catch {
        return { error: 'No se puede dividir entre 0' }
      }
      operands.splice(i, 2, result)
      operators.splice(i, 1)
    } else {
      i++
    }
  }

  // Second pass: + and −
  let result = operands[0]
  for (let i = 0; i < operators.length; i++) {
    result = operators[i] === '+' ? result + operands[i + 1] : result - operands[i + 1]
  }

  const value = Number(result) / 1_000_000
  if (!Number.isFinite(value)) return { error: 'El monto no es válido' }
  if (value <= 0) return { error: 'El resultado debe ser mayor a 0' }
  if (value > MAX_AMOUNT) return { error: 'El monto supera el límite permitido' }

  // Round to cents only at the very end.
  return { value: Number(divRound(result, 10_000n)) / 100 }
}

export const applyPercent = (raw: string): string => {
  const micro = decimalToMicro(raw)
  if (micro === null) return raw
  const result = divRound(micro, 100n)
  return toEntryValue(Number(result) / 1_000_000)
}

export const centsOf = (value: number): bigint => BigInt(Math.round(roundMoney(value) * 100))

export const formatEquivalent = (value: number): string => formatMoney(value)
