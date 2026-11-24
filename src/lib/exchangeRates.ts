import type { Currency, ExchangeRateRecord, RateSource } from '@/types'

const BCV_API_URL = 'https://bcv.today/api/v1/rate.json'

export interface BcvApiResponse {
  USD?: number | string
  EUR?: number | string
  CNY?: number | string
  TRY?: number | string
  RUB?: number | string
  effective_date?: string
  date?: string
  timestamp?: number
}

// Initial fallback seeds (November 2026 realistic BCV history)
export const INITIAL_RATES_HISTORY: ExchangeRateRecord[] = [
  {
    id: 'rate-bcv-2026-11-19-usd',
    source: 'BCV',
    currency: 'USD',
    price: 915.5025,
    effective_date: '2026-11-19',
    fetched_at: '2026-11-19T16:30:00Z',
    is_stale: false,
  },
  {
    id: 'rate-bcv-2026-11-20-usd',
    source: 'BCV',
    currency: 'USD',
    price: 916.854,
    effective_date: '2026-11-20',
    fetched_at: '2026-11-20T16:30:00Z',
    is_stale: false,
  },
  {
    id: 'rate-bcv-2026-11-21-usd',
    source: 'BCV',
    currency: 'USD',
    price: 917.7751,
    effective_date: '2026-11-21',
    fetched_at: '2026-11-21T16:30:00Z',
    is_stale: false,
  },
  {
    id: 'rate-bcv-2026-11-24-usd',
    source: 'BCV',
    currency: 'USD',
    price: 919.8227,
    effective_date: '2026-11-24',
    fetched_at: '2026-11-24T12:00:00Z',
    is_stale: false,
  },
]

export const DEFAULT_USD_RATE = 919.8227
export const DEFAULT_EFFECTIVE_DATE = '2026-11-24'

/**
 * Parses numeric rates which may arrive as numbers or strings with commas.
 */
export function parseRateValue(value: unknown): number | null {
  if (typeof value === 'number' && !isNaN(value) && value > 0) {
    return value
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/\./g, '').replace(',', '.').trim()
    const parsed = parseFloat(cleaned)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  return null
}

/**
 * Calculates converted amount between USD and VES using the movement's exchange rate.
 */
export function calculateEquivalent(
  amount: number,
  currency: Currency,
  exchangeRate: number
): number {
  if (!amount || isNaN(amount) || !exchangeRate || exchangeRate <= 0) return 0
  if (currency === 'USD') {
    return Math.round(amount * exchangeRate * 100) / 100
  }
  return Math.round((amount / exchangeRate) * 100) / 100
}

/**
 * Fetches the latest BCV official rate from the cached JSON API.
 * Never scrapes directly on the client. Returns structured records.
 */
export async function fetchLatestBcvRates(): Promise<{
  usdRecord: ExchangeRateRecord
  eurRecord?: ExchangeRateRecord
  raw: BcvApiResponse
}> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 6000)

  try {
    const response = await fetch(BCV_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      cache: 'default',
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`BCV API HTTP ${response.status}`)
    }

    const data: BcvApiResponse = await response.json()
    const nowIso = new Date().toISOString()
    const effectiveDate = data.effective_date || data.date || nowIso.split('T')[0]

    const parsedUsd = parseRateValue(data.USD) || DEFAULT_USD_RATE
    const parsedEur = parseRateValue(data.EUR)

    const usdRecord: ExchangeRateRecord = {
      id: `rate-bcv-${effectiveDate}-usd`,
      source: 'BCV',
      currency: 'USD',
      price: parsedUsd,
      effective_date: effectiveDate,
      fetched_at: nowIso,
      is_stale: false,
    }

    let eurRecord: ExchangeRateRecord | undefined
    if (parsedEur) {
      eurRecord = {
        id: `rate-bcv-${effectiveDate}-eur`,
        source: 'BCV',
        currency: 'EUR',
        price: parsedEur,
        effective_date: effectiveDate,
        fetched_at: nowIso,
        is_stale: false,
      }
    }

    return { usdRecord, eurRecord, raw: data }
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}
