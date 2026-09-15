import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleChatMessage } from './src/lib/legalAiEngine.js'

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''

        if (url === '/api/health' && req.method === 'GET') {
          const env = { ...process.env, ...loadEnv(server.config.mode, process.cwd(), '') }
          const hasValidKey = Boolean(
            (env.OPENAI_API_KEY && env.OPENAI_API_KEY.startsWith('sk-')) ||
            env.GEMINI_API_KEY ||
            env.GROQ_API_KEY ||
            env.OPENROUTER_API_KEY ||
            env.DEEPSEEK_API_KEY
          )

          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              ok: true,
              hasApiKey: hasValidKey,
              keyWarning: env.OPENAI_API_KEY?.startsWith('VF.')
                ? 'OPENAI_API_KEY ga Voiceflow kaliti yozilgan. Haqiqiy AI uchun OpenAI (sk-...) yoki bepul Gemini / Groq kaliti kerak.'
                : null,
              status: 'running',
            })
          )
          return
        }

        if (url === '/api/chat' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const data = body ? JSON.parse(body) : {}
              const message = String(data.message || '').trim()
              const messages = Array.isArray(data.messages) ? data.messages : []
              const customApiKey = data.apiKey || req.headers['x-api-key'] || ''
              const env = {
                ...process.env,
                ...loadEnv(server.config.mode, process.cwd(), ''),
                ...(customApiKey ? { apiKey: customApiKey } : {}),
              }

              const result = await handleChatMessage({
                message,
                messages,
                env,
              })

              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  answer: result.answer,
                  model: result.model || 'madadkor-local',
                  provider: result.provider || 'Madadkor AI',
                })
              )
            } catch (err) {
              console.error('[Vite Dev API] Xatolik:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message || 'Xatolik yuz berdi' }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
  server: {
    port: 5173,
  },
})
