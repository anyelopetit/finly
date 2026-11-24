import { fetchBcvRate } from '../functions/_lib/bcv.js'

const TTL = 15 * 60 * 1000
let cache = { at: 0, payload: null }

const send = (res, status, body, headers = {}) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Origin', '*')
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  res.end(JSON.stringify(body))
}

/**
 * Local mirror of the Cloudflare Pages Function so `npm run dev` also reads
 * the BCV rate server-side (no scraping or CORS issues from the browser).
 */
export function bcvRateDevPlugin() {
  return {
    name: 'finly-bcv-rate',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/bcv-rate')) return next()
        if (req.method && req.method !== 'GET') {
          return send(res, 405, { error: 'METHOD_NOT_ALLOWED' })
        }

        const isFresh = cache.payload && Date.now() - cache.at < TTL
        if (isFresh) {
          return send(res, 200, cache.payload, { 'X-Finly-Rate': 'cached' })
        }

        try {
          const payload = await fetchBcvRate()
          cache = { at: Date.now(), payload }
          return send(res, 200, payload, { 'X-Finly-Rate': 'fresh' })
        } catch (error) {
          if (cache.payload) {
            return send(res, 200, cache.payload, { 'X-Finly-Rate': 'stale' })
          }
          console.warn('[BCV] unavailable:', error instanceof Error ? error.message : error)
          return send(
            res,
            502,
            { error: 'BCV_UNAVAILABLE', message: 'No se pudo obtener la tasa BCV' },
            { 'Retry-After': '120' }
          )
        }
      })
    },
  }
}
