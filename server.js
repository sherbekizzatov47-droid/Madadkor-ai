import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { handleChatMessage } from './src/lib/legalAiEngine.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({ origin: true }))
app.use(express.json({ limit: '2mb' }))

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'JSON so‘rov noto‘g‘ri.' })
  }
  next(err)
})

app.get('/api/health', (_req, res) => {
  const hasValidKey = Boolean(
    (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) ||
    process.env.GEMINI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.DEEPSEEK_API_KEY
  )

  res.json({
    ok: true,
    hasApiKey: hasValidKey,
    keyWarning: process.env.OPENAI_API_KEY?.startsWith('VF.')
      ? 'OPENAI_API_KEY ga Voiceflow kaliti yozilgan. Haqiqiy AI uchun OpenAI (sk-...) yoki bepul Gemini / Groq kaliti kerak.'
      : null,
    activeEngine: hasValidKey ? 'Tashqi Jonli AI (LLM)' : 'Madadkor Legal Engine',
  })
})

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim()
    if (!message) {
      return res.status(400).json({ error: 'Savol yozilmadi.' })
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
    const customApiKey = req.body?.apiKey || req.headers['x-api-key'] || ''

    const result = await handleChatMessage({
      message,
      messages,
      env: {
        ...process.env,
        ...(customApiKey ? { apiKey: customApiKey } : {}),
      },
    })

    res.json({
      answer: result.answer,
      model: result.model || 'madadkor-local',
      provider: result.provider || 'Madadkor AI',
    })
  } catch (error) {
    console.error('[Madadkor Server] Chat xatosi:', error)
    res.status(500).json({
      error: error?.message || 'AI bilan bog‘lanishda xatolik yuz berdi.',
    })
  }
})

app.listen(port, () => {
  console.log(`Madadkor AI server ishlayapti: http://localhost:${port}`)
})
