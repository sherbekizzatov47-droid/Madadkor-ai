import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Bot,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Key,
  Loader2,
  MessageCircle,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const starter = {
  role: 'assistant',
  content:
    'Assalomu alaykum! Men **Madadkor AI**. Qanday huquqiy muammo yoki savolingiz bor? Vaziyatingizni yozing — uni tahlil qilib, darhol qonuniy va amaliy yo‘l-yo‘riq beraman.',
  provider: 'Madadkor AI',
}

const suggestions = [
  'Ishxonam 2 oydan beri oylik bermayapti.',
  'Mashinam bilan YTH bo‘ldi, nima qilishim kerak?',
  'Uy egasi ijara shartnomasini bekor qilmoqchi.',
  'Menga qarz bo‘yicha talabnoma kerak.',
]

function renderFormattedMessage(text) {
  if (!text || typeof text !== 'string') return text

  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const elements = []
    let remaining = line
    const regex = /(\*\*.*?\*\*|\[.*?\]\(https?:\/\/[^\s)]+\))/g
    let match
    let lastIndex = 0

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        elements.push(line.substring(lastIndex, match.index))
      }
      const token = match[0]
      if (token.startsWith('**') && token.endsWith('**')) {
        elements.push(
          <strong key={`${lineIdx}-${match.index}`} className="font-semibold text-emerald-200">
            {token.slice(2, -2)}
          </strong>
        )
      } else if (token.startsWith('[')) {
        const linkMatch = token.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/)
        if (linkMatch) {
          elements.push(
            <a
              key={`${lineIdx}-${match.index}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 transition-colors hover:text-emerald-100"
            >
              {linkMatch[1]}
            </a>
          )
        } else {
          elements.push(token)
        }
      }
      lastIndex = match.index + token.length
    }

    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex))
    }

    const isHeader =
      line.startsWith('⚖️') ||
      line.startsWith('📚') ||
      line.startsWith('💡') ||
      line.startsWith('🏢') ||
      line.startsWith('🌐') ||
      line.startsWith('📝')

    return (
      <div
        key={lineIdx}
        className={`${isHeader ? 'mt-3 font-medium text-white' : ''} ${line.trim() === '' ? 'h-2' : ''}`}
      >
        {elements.length > 0 ? elements : line}
      </div>
    )
  })
}

export default function ChatSection() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([starter])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [customKey, setCustomKey] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [serverHealth, setServerHealth] = useState(null)
  const endRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('madadkor_custom_api_key') || ''
    setCustomKey(saved)
    setActiveKey(saved)

    // Xavfsiz health-check
    fetch('/api/health')
      .then((r) => {
        if (r.ok) return r.json()
        return null
      })
      .then((d) => {
        if (d) setServerHealth(d)
      })
      .catch(() => { })
  }, [])
  useEffect(() => {
    const onExternal = (event) => {
      const message = String(event.detail?.message || '').trim()
      if (message) sendMessage(message)
    }
    window.addEventListener('madadkor:chat-message', onExternal)
    return () => window.removeEventListener('madadkor:chat-message', onExternal)
  }, [messages, activeKey])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveApiKey = (key) => {
    const trimmed = String(key || '').trim()
    localStorage.setItem('madadkor_custom_api_key', trimmed)
    setActiveKey(trimmed)
    setCustomKey(trimmed)
    setShowSettings(false)
  }

  async function sendMessage(raw) {
    const message = String(raw || input).trim()
    if (!message || loading) return

    const nextMessages = [...messages, { role: 'user', content: message }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          messages: nextMessages,
          apiKey: activeKey || undefined,
        }),
      })

      const rawRes = await response.text()
      let data = {}
      try {
        data = rawRes ? JSON.parse(rawRes) : {}
      } catch {
        throw new Error(`Server xatoligi (${response.status} ${response.statusText})`)
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `Xatolik yuz berdi (${response.status})`)
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          model: data.model,
          provider: data.provider,
        },
      ])
    } catch (error) {
      console.error('Chat xatosi:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `AI bilan bog‘lanib bo‘lmadi: ${error.message || 'Xatolik yuz berdi.'}`,
          error: true,
          failedMessage: message,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleOpenDoc = (text) => {
    window.dispatchEvent(
      new CustomEvent('madadkor:document-type', { detail: { type: 'Ariza', subject: text } })
    )
    document.querySelector('#madadkor-center')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isLiveAI = Boolean(activeKey || serverHealth?.hasApiKey)

  return (
    <section id="chat-section" className="relative py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="premium-stage overflow-hidden rounded-[32px] border border-white/10 bg-[#071018]/90 shadow-[0_30px_100px_rgba(0,0,0,.35)]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="section-kicker">
                <Sparkles className="h-3.5 w-3.5" /> HAQIQIY AI CHAT
              </div>
              <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">Muammoingizni yozing.</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                AI har qanday savolingizni tushunadi, vaziyatni tahlil qiladi va tezkor amaliy qadamlarni ko‘rsatadi.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${isLiveAI
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                  : 'border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20'
                  }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                {isLiveAI ? 'Jonli AI Faol (Tezkor)' : 'API Kalit Ulash'}
              </button>
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
                <ShieldCheck className="h-4 w-4" /> Rasmiy manba
              </div>
            </div>
          </div>

          <div className="grid min-h-[540px] lg:grid-cols-[1fr_260px]">
            <div className="flex min-h-[540px] flex-col border-b border-white/10 lg:border-b-0 lg:border-r">
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                {messages.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`flex gap-3 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {item.role !== 'user' && (
                      <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`group relative max-w-[88%] rounded-2xl border px-4 py-3.5 text-sm leading-6 ${item.role === 'user'
                        ? 'border-emerald-300/10 bg-emerald-300/10 text-emerald-50'
                        : 'border-white/10 bg-white/[0.035] text-slate-200'
                        } ${item.error ? 'border-rose-400/20 bg-rose-400/5 text-rose-200' : ''}`}
                    >
                      {renderFormattedMessage(item.content)}

                      {item.role !== 'user' && !item.error && index > 0 && (
                        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-slate-400">
                          <span className="text-[10px] text-slate-400">{item.provider || 'Madadkor AI'}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(item.content, index)}
                              className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                              title="Nusxa olish"
                            >
                              {copiedIdx === index ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              <span>{copiedIdx === index ? 'Nusxalandi' : 'Nusxa'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDoc(item.content)}
                              className="inline-flex items-center gap-1 font-medium text-emerald-300 hover:text-emerald-200"
                              title="Hujjat bo'limida ochish"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Ariza tayyorlash</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {item.error && item.failedMessage && (
                        <button
                          type="button"
                          onClick={() => sendMessage(item.failedMessage)}
                          className="mt-2 inline-flex items-center gap-1 rounded-lg border border-rose-300/30 bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-500/30"
                        >
                          <RefreshCw className="h-3 w-3" /> Qayta urinish
                        </button>
                      )}
                    </div>
                    {item.role === 'user' && (
                      <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-violet-300/10 text-violet-200">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-400">
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-emerald-300" />
                      Madadkor AI javob tayyorlamoqda...
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="border-t border-white/10 p-4 sm:p-5">
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2 focus-within:border-emerald-300/30">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    rows={2}
                    placeholder="Savolingizni yoki vaziyatingizni yozing..."
                    className="min-h-[60px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    disabled={loading || !input.trim()}
                    onClick={() => sendMessage()}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-300 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" /> Yuborish
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-slate-600">
                  Madadkor umumiy huquqiy ma’lumot beradi. Muhim qaror oldidan rasmiy manbani tekshirish tavsiya etiladi.
                </p>
              </div>
            </div>

            <aside className="hidden bg-white/[0.015] p-5 lg:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tez boshlash</p>
              <div className="mt-3 space-y-2">
                {suggestions.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => sendMessage(text)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-3 text-left text-xs leading-5 text-slate-300 transition hover:border-emerald-300/20 hover:bg-emerald-300/5 hover:text-white"
                  >
                    {text}
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-emerald-300/10 bg-emerald-300/5 p-4">
                <p className="text-xs font-bold text-white">Qanday ishlaydi?</p>
                <div className="mt-3 space-y-2 text-xs leading-5 text-slate-400">
                  <p>01 — Muammoni tushunadi</p>
                  <p>02 — Rasmiy manbani tekshiradi</p>
                  <p>03 — Amaliy yo‘l-yo‘riq beradi</p>
                  <p>04 — Kerak bo‘lsa CASE va ariza yaratadi</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0B1520] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <Zap className="h-5 w-5 text-amber-300" />
                <span>Tezkor AI API Kalitlarini Sozlash</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-300">
              <p>
                Madadkor AI <strong>0.3 soniyada o‘ta tezkor va limitsiz</strong> javob berishi uchun Groq (10 tagacha kalit) yoki Google Gemini kalitingizni kiriting:
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  Groq (gsk_...) yoki Gemini (AQ... / AIza...) kalitlari:
                </label>
                <textarea
                  rows={3}
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="gsk_kalit1, gsk_kalit2, gsk_kalit3... yoki bitta kalit"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:border-emerald-300/50"
                />
                <p className="text-[10px] text-slate-500">
                  💡 Bir nechta Groq kalitini vergul yoki yangi qator bilan kiritsangiz, tizim ularni avtomatik navbatma-navbat (Round-Robin) aylantirib chaqiradi.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3.5 space-y-2">
                <p className="font-bold text-emerald-200">Bepul API kalit olish:</p>
                <div className="flex flex-col gap-1.5 text-[11px]">
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> 1. Groq Console (Juda tezkor 0.3s, 100% Bepul)
                  </a>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-300 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> 2. Google AI Studio (Gemini — 100% Bepul)
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => saveApiKey('')}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Tozalash
              </button>
              <button
                type="button"
                onClick={() => saveApiKey(customKey)}
                className="rounded-xl bg-emerald-300 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-200"
              >
                Saqlash va faollashtirish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
