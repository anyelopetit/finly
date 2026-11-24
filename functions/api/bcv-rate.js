import { fetchBcvRate } from '../_lib/bcv.js'

const CACHE_KEY = 'https://finly.internal/api/bcv-rate/v1'
const FRESH_SECONDS = 900 // 15 min
const STALE_SECONDS = 60 * 60 * 24 // 24 h fallback

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  })

export async function onRequestGet({ env }) {
  const cache = typeof caches !== 'undefined' ? caches.default : null
  const request = new Request(CACHE_KEY)

  const cached = cache ? await cache.match(request) : null
  if (cached) {
    const age = Number(cached.headers.get('X-Finly-Cached-At') || 0)
    const isFresh = Date.now() - age < FRESH_SECONDS * 1000
    if (isFresh) {
      return new Response(cached.body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': `public, max-age=${FRESH_SECONDS}, s-maxage=${FRESH_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
          'X-Finly-Rate': 'cached',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  }

  try {
    const override = env?.BCV_RATE_OVERRIDE ? Number(env.BCV_RATE_OVERRIDE) : null
    const payload =
      override && Number.isFinite(override) && override > 0
        ? {
            USD: override,
            effective_date: new Date().toISOString().slice(0, 10),
            provider: 'override',
            source: 'BCV',
            fetched_at: new Date().toISOString(),
            precision: 2,
          }
        : await fetchBcvRate()

    const response = new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': `public, max-age=${FRESH_SECONDS}, s-maxage=${FRESH_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
        'X-Finly-Cached-At': String(Date.now()),
        'X-Finly-Rate': 'fresh',
        'Access-Control-Allow-Origin': '*',
      },
    })

    if (cache) {
      const toCache = response.clone()
      const stamped = new Response(toCache.body, {
        status: 200,
        headers: {
          ...Object.fromEntries(toCache.headers),
          'Cache-Control': `public, max-age=${STALE_SECONDS}`,
        },
      })
      await cache.put(request, stamped)
    }

    return response
  } catch (error) {
    // Serve the last good value rather than breaking the movement sheet.
    if (cached) {
      const body = await cached.text()
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'X-Finly-Rate': 'stale',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    return json(
      {
        error: 'BCV_UNAVAILABLE',
        message: error instanceof Error ? error.message : 'No se pudo obtener la tasa BCV',
      },
      502,
      { 'Cache-Control': 'no-store', 'Retry-After': '120' }
    )
  }
}
