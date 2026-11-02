import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function devJobsApiPlugin() {
  return {
    name: 'dev-jobs-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/jobs') || req.url.startsWith('/api/jobs?'))) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost:5173')
            const query = parsedUrl.searchParams.get('query') || ''
            const city = parsedUrl.searchParams.get('city') || ''
            const days = Number(parsedUrl.searchParams.get('days') || 30)
            const source = parsedUrl.searchParams.get('source') || 'all'

            const { searchJobOffers } = await import('../api/services/jobScraperService.js')
            const jobs = await searchJobOffers({ query, city, days, source })

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              success: true,
              count: jobs.length,
              query,
              city,
              days,
              jobs
            }))
            return
          } catch (err) {
            console.error('[Vite devJobsApiPlugin] Erreur scraping:', err)
            next()
          }
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), devJobsApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

