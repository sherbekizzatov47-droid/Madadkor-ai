/**
 * Madadkor AI - Yuqori tezlikdagi Multi-Key Groq Pool va Gemini AI Engine
 * 10+ Groq kalitlarini Round-Robin / Load-Balancing rejimida chaqiradi va 0.3s tezlikni ta'minlaydi.
 */

export const SYSTEM_PROMPT = `
Sen Madadkor AI — O'zbekiston fuqarolariga huquqiy ma'lumot, amaliy yo'l-yo'riq va umumiy maslahat beruvchi aqlli sun'iy intellektsan.

ASOSIY QOIDALAR:
1. Foydalanuvchining savoli yoki gapini diqqat bilan tushun va aynan uning savoliga to'g'ridan-to'g'ri, lo'nda va tez javob ber. Hech qanday "dumka"siz darhol amaliy maslahatga o't.
2. Foydalanuvchi oddiy suhbat qilsa, salomlashsa, norozilik bildirsa yoki erkin gapirsa — unga tabiiy, samimiy va jonli o'zbek tilida erkin javob ber. Har qanday gapni majburlab qonun moddalariga tiqishtirma.
3. Foydalanuvchi huquqiy muammo (oylik, aliment, jarima, YTH, ijara, shartnoma, meros, firibgarlik va h.k.) haqida so'rasa, O'zbekiston qonunchiligiga (LexUZ, tegishli kodekslar) tayangan holda quyidagi chiroyli formatda javob ber:

⚖️ Muammo tahlili
Qisqa va aniq tahlil.

📚 Huquqiy asos
Faqat O'zbekiston qonunlari va kodekslaridan rasmiy moddalar (LexUZ asosida).

💡 Nima qilish kerak
1. Birinchi amaliy qadam.
2. Ikkinchi amaliy qadam.
3. Uchinchi amaliy qadam.

🏢 Qayerga murojaat qilish mumkin
Vakolatli tashkilot(lar) va ishonch telefonlari.

🌐 Rasmiy kanal
Rasmiy veb-sayt yoki portal (masalan: my.gov.uz, my.sud.uz, lex.uz).

4. Javob tili: Ravon, samimiy, ixcham va professional o'zbek tili.
`.trim()

let groqKeyIndex = 0

/**
 * Barcha mavjud Groq kalitlarini yig'ish (Multi-key pool)
 */
export function extractGroqKeys(env = {}) {
  const rawKeys = []

  // 1. GROQ_API_KEYS (vergul yoki yangi qatorda ajratilgan)
  if (env.GROQ_API_KEYS) {
    rawKeys.push(...String(env.GROQ_API_KEYS).split(/[\n,;]+/))
  }

  // 2. GROQ_API_KEY
  if (env.GROQ_API_KEY) {
    rawKeys.push(...String(env.GROQ_API_KEY).split(/[\n,;]+/))
  }

  // 3. GROQ_API_KEY_1, GROQ_API_KEY_2 ... GROQ_API_KEY_20
  for (let i = 1; i <= 25; i++) {
    if (env[`GROQ_API_KEY_${i}`]) {
      rawKeys.push(env[`GROQ_API_KEY_${i}`])
    }
  }

  // 4. Custom frontend passed keys
  if (env.apiKey && env.apiKey.includes('gsk_')) {
    rawKeys.push(...String(env.apiKey).split(/[\n,;]+/))
  }

  // Tozalash va duplikatlarni olib tashlash
  const validKeys = Array.from(
    new Set(
      rawKeys
        .map((k) => String(k || '').trim())
        .filter((k) => k.startsWith('gsk_'))
    )
  )

  return validKeys
}

/**
 * Groq orqali o'ta tezkor (0.3s) javob olish (Multi-key Round-Robin & Failover)
 */
export async function queryGroq(message, messages = [], env = {}) {
  const keys = extractGroqKeys(env)
  if (!keys.length) return null

  const model = env.GROQ_MODEL || 'llama-3.3-70b-versatile'

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(Array.isArray(messages)
      ? messages
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
          .slice(-8)
          .map((m) => ({ role: m.role, content: String(m.content || '') }))
      : []),
  ]
  if (!formattedMessages.some((m) => m.role === 'user' && m.content === message)) {
    formattedMessages.push({ role: 'user', content: message })
  }

  // Barcha mavjud kalitlarni navbatma-navbat sinab ko'rish
  const totalKeys = keys.length
  for (let attempt = 0; attempt < totalKeys; attempt++) {
    const activeKey = keys[groqKeyIndex % totalKeys]
    groqKeyIndex = (groqKeyIndex + 1) % totalKeys

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 1500,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content
        if (text && text.trim()) {
          return {
            answer: text.trim(),
            model: `groq/${model}`,
            provider: `Groq LPU Engine (${totalKeys > 1 ? `${totalKeys} ta kalitdan biri` : 'Ultra Fast'})`,
          }
        }
      } else {
        const errText = await res.text()
        console.warn(`[Groq Pool] Kalit xatolik berdi (Key ${activeKey.slice(0, 8)}...):`, res.status, errText.slice(0, 100))
        // 429 yoki limit bo'lsa, keyingi kalitga o'tamiz
      }
    } catch (e) {
      console.warn(`[Groq Pool] Tarmoq xatosi (Key ${activeKey.slice(0, 8)}...):`, e.message)
    }
  }

  return null
}

/**
 * Google AI Studio (Gemini) API — zaxira provayder
 */
export async function queryGemini(message, messages = [], env = {}) {
  const apiKey =
    env.GEMINI_API_KEY ||
    env.GOOGLE_API_KEY ||
    (env.apiKey && !env.apiKey.startsWith('gsk_') ? env.apiKey : '')

  if (!apiKey) return null

  const candidateModels = [
    env.GEMINI_MODEL || 'gemini-3.5-flash',
    'gemini-3.7-flash',
    'gemini-flash-latest',
  ]

  const contents = []
  if (Array.isArray(messages) && messages.length > 0) {
    for (const m of messages.slice(-8)) {
      if (!m || !m.content) continue
      contents.push({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(m.content) }],
      })
    }
  }

  const last = contents[contents.length - 1]
  if (!last || last.role !== 'user' || last.parts[0].text !== message) {
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    })
  }

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const body = {
        contents,
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
        },
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text && text.trim()) {
          return {
            answer: text.trim(),
            model: `gemini/${model}`,
            provider: 'Google Gemini AI',
          }
        }
      }
    } catch (e) {
      console.warn(`[Gemini] Xato (${model}):`, e.message)
    }
  }

  return null
}

/**
 * Fallback lokal javoblar
 */
export function generateLocalFallback(message = '') {
  return {
    answer: `Assalomu alaykum! Men Madadkor AI yordamchisiman. Sizga qanday huquqiy yoki amaliy masala bo‘yicha yordam kerak? Marhamat, savolingizni bering.`,
    model: 'madadkor-local',
    provider: 'Madadkor AI',
  }
}

/**
 * Asosiy suhbat ishlovchisi — Avval Groq (0.3s ultra-fast pool), keyin Gemini
 */
export async function handleChatMessage({ message = '', messages = [], env = {} }) {
  const cleanMessage = String(message).trim()
  if (!cleanMessage) {
    throw new Error('Savol yozilmadi.')
  }

  // 1. Groq Multi-Key Pool (Juda tezkor 0.3s, dumka yo'q)
  const groqResult = await queryGroq(cleanMessage, messages, env)
  if (groqResult && groqResult.answer) {
    return groqResult
  }

  // 2. Google Gemini AI (Zaxira)
  const geminiResult = await queryGemini(cleanMessage, messages, env)
  if (geminiResult && geminiResult.answer) {
    return geminiResult
  }

  // 3. Lokal fallback
  return generateLocalFallback(cleanMessage)
}
