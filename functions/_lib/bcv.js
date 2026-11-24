// ============================================================
// BCV rate — server-side only
// Fetching and parsing happen on the edge (Cloudflare Pages
// Function) or in the Vite dev middleware. The browser only
// receives a small, cached JSON payload.
// ============================================================

const BCV_URL = 'https://www.bcv.org.ve/'
const BCV_JSON_URL = 'https://bcv.today/api/v1/rate.json'
const DOLAR_API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'
const TIMEOUT_MS = 8000
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 Finly/0.1'

const MONTHS = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  setiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
}

async function fetchText(url, accept = 'text/html') {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': UA,
        Accept: accept,
        'Accept-Language': 'es-VE,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

/** Parses "36,5432" / "36.543,21" / "36.5432" without guessing wrongly. */
export function parseRate(raw) {
  if (typeof raw === 'number') return Number.isFinite(raw) && raw > 0 ? raw : null
  if (typeof raw !== 'string') return null
  let value = raw.replace(/\s/g, '').replace(/[^\d.,]/g, '')
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

function parseSpanishDate(text) {
  if (!text) return null
  const cleaned = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const match = cleaned.match(
    /(\d{1,2})\s*(?:de\s*)?([a-záéíóú]+)\s*(?:de\s*)?(\d{4})/i
  )
  if (!match) return null
  const day = match[1].padStart(2, '0')
  const month = MONTHS[match[2].toLowerCase()]
  const year = match[3]
  return month ? `${year}-${month}-${day}` : null
}

function parseBcvHtml(html) {
  const anchor = html.search(/id=["']dolar["']/i)
  if (anchor === -1) return null
  const slice = html.slice(anchor, anchor + 4000)
  const strong = slice.match(/<strong[^>]*>\s*([\d.,]+)\s*<\/strong>/i)
  const rate = strong ? parseRate(strong[1]) : null
  if (!rate) return null

  const dateMatch = html.match(/Fecha\s+Valor[\s\S]{0,220}?(\d{1,2}\s+[A-Za-zÁÉÍÓÚáéíóú]+\s+\d{4})/i)
  return {
    USD: rate,
    effective_date: parseSpanishDate(dateMatch?.[1]) || new Date().toISOString().slice(0, 10),
    provider: 'bcv.org.ve',
    source: 'BCV',
  }
}

async function fromBcvHtml() {
  const html = await fetchText(BCV_URL)
  const parsed = parseBcvHtml(html)
  if (!parsed) throw new Error('BCV rate not found in HTML')
  return parsed
}

async function fromBcvJson() {
  const body = await fetchText(BCV_JSON_URL, 'application/json')
  const data = JSON.parse(body)
  const usd = parseRate(data.USD ?? data.usd ?? data.rate)
  if (!usd) throw new Error('BCV JSON has no USD rate')
  const eur = parseRate(data.EUR ?? data.eur)
  return {
    USD: usd,
    EUR: eur ?? undefined,
    effective_date: data.effective_date || data.date || new Date().toISOString().slice(0, 10),
    provider: 'bcv.today',
    source: 'BCV',
  }
}

async function fromDolarApi() {
  const body = await fetchText(DOLAR_API_URL, 'application/json')
  const data = JSON.parse(body)
  const usd = parseRate(data.promedio ?? data.price ?? data.rate)
  if (!usd) throw new Error('DolarAPI has no USD rate')
  return {
    USD: usd,
    effective_date:
      (data.fechaActualizacion || data.fecha_actualizacion || '').slice(0, 10) ||
      new Date().toISOString().slice(0, 10),
    provider: 'dolarapi.com',
    source: 'BCV',
  }
}

/**
 * Tries the official BCV page first, then cached JSON mirrors.
 * Never throws without a message; callers decide the HTTP status.
 */
export async function fetchBcvRate() {
  const errors = []
  for (const attempt of [fromBcvHtml, fromBcvJson, fromDolarApi]) {
    try {
      const data = await attempt()
      return {
        ...data,
        fetched_at: new Date().toISOString(),
        precision: String(data.USD).split('.')[1]?.length ?? 0,
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }
  const error = new Error(`No se pudo obtener la tasa BCV: ${errors.join(' · ')}`)
  error.details = errors
  throw error
}
