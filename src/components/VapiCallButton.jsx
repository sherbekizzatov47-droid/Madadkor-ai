import { useEffect, useRef, useState } from 'react'
import { Mic, PhoneOff, Loader2, AlertCircle, Phone, Volume2, MessageSquare, X } from 'lucide-react'
import { getVapi } from '../lib/vapi.js'

const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || '000a3a1d-f32b-4f0c-954c-02b6bf9298fa'
const CALL_CENTER_NUMBER = import.meta.env.VITE_CALL_CENTER_NUMBER || ''

const END_CALL_MESSAGE = 'Mayli, suhbatimizni yakunlayman. Yaxshi kun tilayman.'

const MADADKOR_GENERAL_SYSTEM = `
Siz Madadkor AI yordamchisisiz. Foydalanuvchi bilan tabiiy, insoniy va hurmatli o‘zbek tilida suhbatlashing.

UMUMIY SUHBAT REJIMI
- Foydalanuvchi oddiy suhbat qilsa, oddiy suhbat qiling. Har bir gapni CASEga aylantirmang.
- Foydalanuvchining kundalik savollariga qisqa, tabiiy va samimiy javob bering.
- O‘zingizni inson yoki real yurist deb tanishtirmang.
- Bir javobda keraksiz uzun ro‘yxat bermang.

HUQUQIY REJIM
- Foydalanuvchi huquqiy muammo aytsa, avval muammoni qisqa tasdiqlang va kerak bo‘lsa muhim ma’lumotlarni bittadan so‘rang.
- Foydalanuvchi ariza, shikoyat yoki CASE ochishni so‘rasa, Smart Interview oqimiga o‘ting.
- Aytilmagan ma’lumotni o‘ylab topmang.

YO‘L HARAKATI REJIMI
- Foydalanuvchi yo‘l harakati, yo‘l belgisi, svetofor, YTH, haydovchi yoki piyoda huquqlari haqida so‘rasa, Yo‘l harakati rejimiga o‘ting.
- O‘zbekiston bo‘yicha javoblarda amaldagi Yo‘l harakati qoidalariga tayaning. Asosiy huquqiy baza — O‘zbekiston Respublikasi Vazirlar Mahkamasining 2022-yil 12-apreldagi 172-son qarori bilan tasdiqlangan Yo‘l harakati qoidalari.
- Aniq band, jarima miqdori, muddat yoki javobgarlikni ishonch bilan tekshirmasdan o‘ylab topmang. Ishonch bo‘lmasa, rasmiy LexUZ yoki vakolatli organ ma’lumotini tekshirishni tavsiya qiling.
- YTH yoki xavfli vaziyatda avvalo xavfsizlikni ta’minlash va tegishli vakolatli xizmatlarga murojaat qilishni tavsiya qiling.
- Savol oddiy bo‘lsa, oddiy tilda tushuntiring; huquqiy jihati kerak bo‘lsa, keyin qo‘shing.

SUHBAT OHANGI
- Tabiiy, iliq va qisqa.
- O‘zbekcha talaffuzga mos, sodda jumlalar.
- Foydalanuvchini bo‘lmang va uning gapini qayta-qayta takrorlamang.
`;
const END_CALL_PHRASES = [
  'Mayli, suhbatimizni yakunlayman',
  'Suhbatimizni yakunlaymiz',
  'Suhbatni yakunlayman',
]

const USER_END_PHRASES = [
  'suhbatni yakunla',
  'suhbatni tugat',
  'suhbatni toxtat',
  'chatni tugat',
  'chatni yop',
  'aloqani uz',
  'telefonni ochir',
  'bo`ldi',
  'boldi',
  'xayr',
]

function safeText(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (typeof value === 'object') {
    const candidate = value.message ?? value.msg ?? value.error ?? value.details ?? value.type
    if (typeof candidate === 'string') return candidate
    if (candidate && candidate !== value) return safeText(candidate)
    try {
      return JSON.stringify(value)
    } catch {
      return 'Noma’lum xatolik yuz berdi.'
    }
  }

  return String(value)
}

function normalizeText(value) {
  return safeText(value)
    .toLocaleLowerCase('uz-UZ')
    .replace(/[‘’`]/g, "'")
    .replace(/[!?.,:;()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function shouldEndCall(text) {
  const normalized = normalizeText(text)
  if (!normalized) return false
  return USER_END_PHRASES.some((phrase) => normalized.includes(phrase))
}

function describeVapiError(err) {
  const status = err?.error?.status ?? err?.status ?? err?.response?.status
  if (status === 401 || status === 403) return 'Ulanish rad etildi. Vapi Public Key yoki Assistant ID ni tekshiring.'
  if (status === 404) return 'Assistant topilmadi. Vapi Dashboard dagi Assistant ID ni tekshiring.'

  const type = safeText(err?.type ?? err?.error?.type)
  const message = safeText(err?.error?.message ?? err?.error?.msg ?? err?.message ?? err?.error)

  if (type === 'daily-error' && /eject|stale|ended|session/i.test(message)) {
    return 'Ovozli sessiya uzildi. Qayta qo‘ng‘iroq qilib ko‘ring.'
  }

  return message || 'Ovozli suhbatni boshlab bo‘lmadi.'
}

function extractTranscript(message) {
  const rawText = message?.transcript ?? message?.text ?? message?.payload?.transcript
  const text = safeText(rawText).trim()
  if (!text) return null

  const role = message?.role === 'user' || message?.speaker === 'user' ? 'user' : 'assistant'
  const transcriptType = message?.transcriptType ?? message?.payload?.transcriptType ?? 'final'

  return {
    role,
    text,
    partial: transcriptType !== 'final',
  }
}

function extractMessageText(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === 'string') return part
        if (part?.type === 'text') return safeText(part.text ?? part.value)
        return safeText(part?.text ?? part?.content ?? part?.value)
      })
      .filter(Boolean)
      .join(' ')
  }
  return safeText(value?.text ?? value?.content ?? value?.value ?? value)
}

function extractConversationHistory(messages) {
  if (!Array.isArray(messages)) return []

  const result = []
  for (const item of messages) {
    const role = item?.role
    if (role !== 'user' && role !== 'assistant') continue

    const raw = item?.content ?? item?.message?.content ?? item?.message ?? item?.text ?? item?.transcript
    const text = extractMessageText(raw).trim()
    if (!text) continue

    const normalized = normalizeText(text)
    const exists = result.some((entry) => entry.role === role && normalizeText(entry.text) === normalized)
    if (exists) continue
    result.push({ role, text, partial: false })
  }

  return result.slice(-80)
}

function mergeTranscript(current, incoming) {
  const next = Array.isArray(current) ? [...current] : []
  for (const item of Array.isArray(incoming) ? incoming : []) {
    if (!item?.text) continue

    const last = next[next.length - 1]
    if (item.partial) {
      if (last?.role === item.role && last.partial) {
        next[next.length - 1] = item
      } else {
        next.push(item)
      }
      continue
    }

    if (last?.role === item.role && last.partial) {
      next[next.length - 1] = item
      continue
    }

    const duplicate = next.some((entry) => entry.role === item.role && !entry.partial && normalizeText(entry.text) === normalizeText(item.text))
    if (!duplicate) next.push(item)
  }
  return next.slice(-80)
}


const NOISE_PATTERNS = [
  /okay[,\s]+sneaking ahead/i,
  /but your ear/i,
  /your ear/i,
  /going down better or leaving better/i,
  /core\.?$/i,
  /madadkor\s*ai\.?\s*chatni\s*yakunla/i,
]

function cleanCandidateText(value) {
  const text = safeText(value)
    .replace(/\s+/g, ' ')
    .replace(/\.{2,}/g, '.')
    .trim()

  if (!text) return ''
  let cleaned = text
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ')
  }
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length < 3) return cleaned

  const latinWords = words.filter((word) => /[A-Za-z]/.test(word)).length
  const uzWords = words.filter((word) => /(men|siz|menga|ish|oylik|maosh|shartnoma|muammo|murojaat|ber|ol|kerak|xohlay|qanday|nima|bor|yo'q|yo‘q)/i.test(word)).length

  if (latinWords > 7 && uzWords === 0 && NOISE_PATTERNS.some((pattern) => pattern.test(text))) return ''
  return cleaned
}

function bestUserText(messages) {
  const candidates = messages
    .filter((m) => m?.role === 'user')
    .map((m) => cleanCandidateText(m.text))
    .filter((text) => text.length >= 8)

  if (!candidates.length) return ''
  return candidates
    .sort((a, b) => b.length - a.length)[0]
}


function detectCategory(text) {
  const t = normalizeText(text)
  if (/(oylik|ishxona|ish beruvchi|mehnat|ishdan bo'shat|maosh|mehnat shartnoma|lavozim|ishdan haydash)/.test(t)) return 'Mehnat'
  if (/(aliment|nikoh|ajrash|farzand|erim|xotinim|nikohdan)/.test(t)) return 'Oila'
  if (/(uy|ijara|xonadon|kvartira|qo\'shni|uy-joy)/.test(t)) return 'Uy-joy'
  if (/(sotib|do\'kon|mahsulot|kafolat|iste\'mol|qaytar)/.test(t)) return 'Iste’molchi'
  if (/(qarz|pulim|shartnoma|kelishuv|zarar|mulk|meros)/.test(t)) return 'Fuqarolik'
  return 'Boshqa'
}

const CONTROL_PHRASES = [
  'mening ishlarimga ariza qilib ber',
  'mening ishlarimga ariza qilib',
  'mening ishlarim keysga solib ber',
  'mening ishlarim keys bo‘limiga ariza qilib o‘tkaz',
  'mening ishlarim keys bo\'limiga ariza qilib o\'tkaz',
  'ishlarimga ariza qilib ber',
  'keysga solib ber',
  'ariza qilib ber',
  'ariza qilib o‘tkaz',
  'ariza qilib o\'tkaz',
  'ariza tayyorlab ber',
  'ariza ochib ko‘r',
  'ariza ochib ko\'r',
  'ariza och',
  'hujjat tayyorla',
  'hujjatni tayyorla',
  'chatni yakunla',
  'suhbatni yakunla',
  'suhbatni tugat',
  'suhbatni toxtat',
  'suhbatni to‘xtat',
  'chatni tugat',
  'telefonni ochir',
  'aloqani uz',
  'keyin nima qilamiz',
  'boshlaymiz endi',
  'boshlaymiz',
]

function stripControlText(value) {
  let text = cleanCandidateText(value)
  if (!text) return ''

  for (const phrase of CONTROL_PHRASES) {
    text = text.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), ' ')
  }

  text = text
    .replace(/\b(mening\s+ishlarim\s+(?:keys|case)(?:ga|ga\s+bo'limiga)?[^.?!,;]*?(?:ariza|hujjat)[^.?!,;]*)/ig, ' ')
    .replace(/\b(ariza\s+och(?:ib)?\s+ko['’]?r?)\b/ig, ' ')
    .replace(/\b(keys|case)\s+bo['’]?limiga\s+(?:o['’]?tkaz|solib\s+ber)\b/ig, ' ')
    .replace(/\b(suhbatni|chatni)\s+(?:yakunla|tugat|toxtat|to['’]?xtat|yop)\b/ig, ' ')
    .replace(/\b(telefonni|aloqani)\s+(?:ochir|uz)\b/ig, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  text = text.replace(/(^|\s)(ber|berchi|chiqargin|chiqarib ber)(?=\s|$)/ig, ' ')
  return text.replace(/\s+/g, ' ').trim()
}

function getUserMessages(messages) {
  return messages.filter((m) => m?.role === 'user')
    .map((m) => stripControlText(m.text))
    .filter((text) => text.length >= 4)
}

function getUserText(messages) {
  return getUserMessages(messages).join(' ')
}

function firstMatch(text, regex) {
  const match = text.match(regex)
  return match?.[1]?.trim() || ''
}

function extractUnpaidMonths(text) {
  const normalized = normalizeText(text)
  const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
  const found = months.filter((month) => new RegExp(`\\b${month}\\b`, 'i').test(normalized))
  if (found.length >= 1 && /(oylik|maosh|ish haqi|berilmay|bermay|to'lanmay|berilmadi|bermagan)/i.test(normalized)) {
    return `To‘lanmagan davr: ${found.join(' va ')}.`
  }
  return ''
}

function cleanField(value) {
  return stripControlText(value)
    .replace(/\s+/g, ' ')
    .replace(/[.;,]+$/g, '')
    .trim()
}

function extractPhone(text) {
  const raw = stripControlText(text)

  // Prefer the text immediately after "telefonim" / "raqamim" so dates or
  // workplace numbers do not get mistaken for a phone number. This also
  // handles STT output such as "95 120 54 20" or "9 5 1 2 0 5 4 2 0".
  const labeled = raw.match(/(?:telefonim|telefon(?:\s+raqamim)?|raqamim)\s*[:\-]?\s*([^.!?;]+)/i)
  const labeledText = labeled?.[1] || raw
  const digits = (labeledText.match(/\d/g) || []).join('')

  if (digits.length >= 12 && digits.includes('998')) {
    const idx = digits.indexOf('998')
    const candidate = digits.slice(idx, idx + 12)
    if (/^9989\d{8}$/.test(candidate)) return `+${candidate}`
  }

  if (digits.length >= 9) {
    // Prefer a valid Uzbek mobile pattern from the first 9-digit sequence.
    for (let i = 0; i <= digits.length - 9; i += 1) {
      const candidate = digits.slice(i, i + 9)
      if (/^9\d{8}$/.test(candidate)) return `+998${candidate}`
    }
  }

  // Fallback for a compact or punctuated number.
  const fallback = raw.match(/(?:\+?998[\s-]*)?(9[0-9])[\s-]*(\d{3})[\s-]*(\d{2})[\s-]*(\d{2})/)
  if (fallback) return `+998${fallback[1]}${fallback[2]}${fallback[3]}${fallback[4]}`
  return ''
}

function extractStructuredDetails(text) {
  const raw = stripControlText(text)
  const normalized = normalizeText(raw)

  // Keep these patterns intentionally simple and tolerant of natural speech.
  const fullName = cleanField(firstMatch(raw, /\b(?:mening\s+)?ismim\s*(?:bu|—|-)?\s*([^,.;!?]+?)(?=\s+(?:ishxonam|ish\s+joyim|telefonim|raqamim|lavozimim|ishlayman|ishlaydi|ishxonada)|[,.!?]|$)/i))
  const phone = extractPhone(raw)
  const workplace = cleanField(firstMatch(raw, /\b(?:ishxonam(?:ning\s+joyi)?|ish\s+joyim|tashkilot(?:im)?)\s*(?:nomi|joyi)?\s*[:\-]?\s*([^.!?]+?)(?=\s+(?:\d{1,2}[-\s]?(?:iyun|iyul|avgust|sentabr|oktabr|noyabr|dekabr)|iyun|iyul|avgust|sentabr|oktabr|noyabr|dekabr|oylar?ida|oylar?idagi|oyida|oylik|oyligim|maoshim|ish\s+haqi|lavozimim|telefonim|raqamim|mehnat|shartnoma|bor|menda)|[.!?]|$)/i))
  const position = cleanField(firstMatch(raw, /\blavozimim\s*(?:bu|—|-)?\s*([^,.!?]+?)(?=\s+(?:oyligim|maoshim|telefonim|raqamim|ishxonam|ish\s+joyim|mehnat|shartnoma)|[,.!?]|$)/i))

  const unpaidPeriod = extractUnpaidMonths(raw)
  const hasContract = /(mehnat\s+shartnoma|shartnomam\s+bor|shartnoma\s+bor)/i.test(normalized)
  const salaryIssue = /(oylik|maosh|ish\s+haqi).*(berilmay|bermay|to'lanmay|berilmadi|bermagan)|berilmay.*(oylik|maosh|ish\s+haqi)/i.test(normalized)
  const writtenRequest = /(yozma\s+murojaat|yozma\s+talab|ariza\s+yozdim|murojaat\s+qildim)/i.test(normalized)

  let demand = ''
  if (/\b2\s+hissa\b|ikki\s+hissa/i.test(normalized)) demand = 'Foydalanuvchi ish haqini ikki hissa miqdorda undirishni so‘ragan.'
  else if (/(oylik|maosh|ish\s+haqi).*(undir|olib|ber|to'la|to‘la|qaytar)/i.test(normalized)) demand = 'Foydalanuvchi to‘lanmagan ish haqini undirishni so‘ragan.'

  const facts = []
  if (fullName) facts.push(`F.I.Sh.: ${fullName}`)
  if (phone) facts.push(`Telefon: ${phone}`)
  if (workplace) facts.push(`Ish joyi: ${workplace}`)
  if (position) facts.push(`Lavozim: ${position}`)
  if (unpaidPeriod) facts.push(unpaidPeriod)
  if (hasContract) facts.push('Mehnat shartnomasi mavjud')
  if (salaryIssue) facts.push('Ish haqi bo‘yicha to‘lov muammosi mavjud')
  if (writtenRequest) facts.push('Ish beruvchiga yozma murojaat qilingan')
  if (demand) facts.push(demand)

  return { fullName, phone, workplace, position, unpaidPeriod, hasContract, salaryIssue, writtenRequest, demand, facts }
}

function buildSmartCase(messages) {
  const userText = getUserText(messages)
  const normalized = normalizeText(userText)
  const category = detectCategory(userText)
  const structured = extractStructuredDetails(userText)

  let title = 'Huquqiy masala'
  if (category === 'Mehnat') {
    if (structured.salaryIssue || /(oylik|maosh|ish haqi)/i.test(normalized)) title = 'Ish haqi to‘lanishi bo‘yicha muammo'
    else if (/(bo'shat|ishdan haydash)/i.test(normalized)) title = 'Ishdan bo‘shatish bo‘yicha masala'
    else if (/ta['’]?til/i.test(normalized)) title = 'Mehnat ta’tili bo‘yicha masala'
    else title = 'Mehnat huquqi bo‘yicha masala'
  } else if (category === 'Oila') title = 'Oila huquqi bo‘yicha masala'
  else if (category === 'Uy-joy') title = 'Uy-joy masalasi'
  else if (category === 'Iste’molchi') title = 'Iste’molchi huquqi bo‘yicha masala'
  else if (category === 'Fuqarolik') title = 'Fuqarolik-huquqiy masala'
  else {
    const candidate = cleanCandidateText(bestUserText(messages))
    if (candidate) title = candidate.length > 64 ? `${candidate.slice(0, 61)}...` : candidate
  }

  const facts = structured.facts
  let priority = 'Oddiy'
  if (/(sud chaqiruvi|bugun|ertaga|muddat tug|hibs|zo'ravon|tahdid|hayotga xavf)/i.test(normalized)) priority = 'Muhim'
  else if (/(to'lanmayapti|ishdan bo'shat|shartnoma|murojaat)/i.test(normalized)) priority = 'E’tiborli'

  const nextSteps = []
  if (category === 'Mehnat' && structured.salaryIssue) {
    if (structured.unpaidPeriod) nextSteps.push('Ish haqi to‘lanmagan davr va summani aniq yozib olish')
    nextSteps.push('Mehnat shartnomasi va to‘lovga oid dalillarni saqlash')
    if (structured.writtenRequest) nextSteps.push('Murojaat nusxasi va javobini saqlash')
    else nextSteps.push('Ish beruvchiga yozma murojaat tayyorlash')
  } else {
    nextSteps.push('Mavjud hujjat va dalillarni saqlash')
    nextSteps.push('Muammo bo‘yicha tegishli rasmiy murojaat yo‘lini aniqlash')
  }

  const summaryParts = [`Muammo: ${title}.`]
  if (facts.length) summaryParts.push(`Muhim faktlar: ${facts.join('; ')}.`)
  summaryParts.push(`Tavsiya etilgan keyingi qadamlar: ${nextSteps.join('; ')}.`)

  const details = [
    structured.unpaidPeriod,
    structured.hasContract ? 'Mehnat shartnomasi mavjud.' : '',
    structured.salaryIssue ? 'Ish haqi bo‘yicha to‘lov muammosi mavjud.' : '',
    structured.writtenRequest ? 'Ish beruvchiga yozma murojaat qilingan.' : '',
    structured.workplace ? `Ish joyi: ${structured.workplace}.` : '',
    structured.position ? `Lavozim: ${structured.position}.` : '',
    structured.demand,
  ].filter(Boolean).join(' ')

  const applicationSeed = {
    fullName: structured.fullName,
    phone: structured.phone,
    workplace: structured.workplace,
    position: structured.position,
    subject: structured.unpaidPeriod && structured.salaryIssue ? structured.unpaidPeriod.replace(/^To‘lanmagan davr:\s*/i, 'Ish haqi to‘lanmagan davr: ') : title,
    caseTitle: title,
    details: details || `${title}.`,
    userFactsText: details || title,
    attachments: '',
    demand: structured.demand,
  }

  return {
    title,
    category,
    priority,
    summary: summaryParts.join(' '),
    keyFacts: facts,
    nextSteps,
    applicationSeed,
    structuredData: {
      fullName: structured.fullName,
      phone: structured.phone,
      workplace: structured.workplace,
      position: structured.position,
      unpaidPeriod: structured.unpaidPeriod,
      hasContract: structured.hasContract,
      salaryIssue: structured.salaryIssue,
      writtenRequest: structured.writtenRequest,
      demand: structured.demand,
    },
  }
}

function createCaseFromCall(messages) {
  if (!Array.isArray(messages) || messages.length < 2) return null
  const smart = buildSmartCase(messages)
  const item = {
    id: Date.now(),
    caseNumber: `MAD-${String(Date.now()).slice(-6)}`,
    title: smart.title,
    category: smart.category,
    status: 'Yangi',
    priority: smart.priority,
    createdAt: new Date().toLocaleDateString('uz-UZ'),
    summary: smart.summary,
    keyFacts: smart.keyFacts,
    nextSteps: smart.nextSteps,
    transcript: messages.map(({ role, text }) => ({ role, text })),
    source: 'voice-call',
    application: smart.applicationSeed,
    applicationSeed: smart.applicationSeed,
    structuredData: smart.structuredData,
  }

  let cases = []
  try {
    cases = JSON.parse(localStorage.getItem('madadkor_cases') || '[]')
    if (!Array.isArray(cases)) cases = []
  } catch {
    cases = []
  }
  const next = [item, ...cases].slice(0, 50)
  localStorage.setItem('madadkor_cases', JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('madadkor:cases-updated', { detail: item }))
  window.dispatchEvent(new CustomEvent('madadkor:case-created', { detail: item }))
  return item
}

export default function VapiCallButton() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [transcript, setTranscript] = useState([])
  const transcriptRef = useRef([])
  const [showPanel, setShowPanel] = useState(false)
  const [lastCase, setLastCase] = useState(null)

  const vapiRef = useRef(null)
  const startingRef = useRef(false)
  const callActiveRef = useRef(false)
  const endingRef = useRef(false)
  const endFallbackTimerRef = useRef(null)
  const handleClickRef = useRef(null)

  useEffect(() => {
    const vapi = getVapi()
    if (!vapi) return undefined
    vapiRef.current = vapi

    const onExternalStart = (event) => {
      if (event?.detail?.message) {
        // The current Vapi assistant starts from its own first message.
        // Keep external button clicks simple and reliable.
      }
      handleClickRef.current?.()
    }

    const onCallStart = () => {
      startingRef.current = false
      callActiveRef.current = true
      endingRef.current = false
      if (endFallbackTimerRef.current) clearTimeout(endFallbackTimerRef.current)
      endFallbackTimerRef.current = null
      setErrorMessage('')
      transcriptRef.current = []
      setTranscript([])
      setStatus('active')
      setShowPanel(true)
    }

    const onCallEnd = () => {
      if (endFallbackTimerRef.current) clearTimeout(endFallbackTimerRef.current)
      endFallbackTimerRef.current = null
      startingRef.current = false
      callActiveRef.current = false
      endingRef.current = false
      setStatus('idle')

      const clean = transcriptRef.current.filter((item) => item?.text && !item.partial)
      setTranscript(clean)
      const created = createCaseFromCall(clean)
      if (created) {
        setLastCase(created)
        window.setTimeout(() => {
          setShowPanel(true)
        }, 0)
      }
    }

    const onMessage = (message) => {
      if (!message) return

      // Keep the committed history as the authoritative transcript when available.
      if (message.type === 'conversation-update' && Array.isArray(message.messages)) {
        const history = extractConversationHistory(message.messages)
        if (history.length) {
          transcriptRef.current = mergeTranscript(transcriptRef.current, history)
          setTranscript(transcriptRef.current)
        }
        return
      }

      const item = extractTranscript(message)
      if (!item) return

      transcriptRef.current = mergeTranscript(transcriptRef.current, [item])
      setTranscript(transcriptRef.current)

      if (item.role === 'user' && !item.partial && shouldEndCall(item.text) && !endingRef.current) {
        endingRef.current = true
        if (endFallbackTimerRef.current) clearTimeout(endFallbackTimerRef.current)
        endFallbackTimerRef.current = window.setTimeout(() => {
          if (callActiveRef.current) {
            try {
              const result = vapi.stop?.()
              if (result?.catch) result.catch(() => {})
            } catch {
              // ignore
            }
          }
        }, 3500)
      }
    }

    const onError = (err) => {
      console.error('[Vapi] error:', err)
      if (endFallbackTimerRef.current) clearTimeout(endFallbackTimerRef.current)
      endFallbackTimerRef.current = null
      startingRef.current = false
      callActiveRef.current = false
      endingRef.current = false
      setErrorMessage(describeVapiError(err))
      setStatus('error')
    }

    window.addEventListener('madadkor:start-call', onExternalStart)
    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('error', onError)

    return () => {
      window.removeEventListener('madadkor:start-call', onExternalStart)
      vapi.off?.('call-start', onCallStart)
      vapi.off?.('call-end', onCallEnd)
      vapi.off?.('message', onMessage)
      vapi.off?.('error', onError)
      if (endFallbackTimerRef.current) clearTimeout(endFallbackTimerRef.current)
      endFallbackTimerRef.current = null
    }
  }, [])

  const handleClick = async () => {
    const vapi = vapiRef.current
    if (!vapi) {
      setErrorMessage('Vapi SDK yuklanmadi. Sahifani yangilang.')
      setStatus('error')
      setShowPanel(true)
      return
    }

    if (status === 'active' || callActiveRef.current) {
      try {
        await vapi.stop()
      } catch (err) {
        console.error('[Vapi] stop() failed:', err)
      } finally {
        if (endFallbackTimerRef.current) clearTimeout(endFallbackTimerRef.current)
        endFallbackTimerRef.current = null
        callActiveRef.current = false
        startingRef.current = false
        endingRef.current = false
        setStatus('idle')
      }
      return
    }

    if (startingRef.current) return
    startingRef.current = true

    setErrorMessage('')
    transcriptRef.current = []
    setTranscript([])
    setStatus('connecting')
    setShowPanel(true)

    try {
      await vapi.start(VAPI_ASSISTANT_ID, {
        endCallMessage: END_CALL_MESSAGE,
        endCallPhrases: END_CALL_PHRASES,
      })

      try {
        vapi.addMessage?.({
          role: 'system',
          content: MADADKOR_GENERAL_SYSTEM,
        })
      } catch (contextError) {
        console.warn('[Madadkor] General context injection failed:', contextError)
      }
    } catch (err) {
      console.error('[Vapi] start() failed:', err)
      startingRef.current = false
      callActiveRef.current = false
      setErrorMessage(describeVapiError(err))
      setStatus('error')
    }
  }

  handleClickRef.current = handleClick

  const isBusy = status === 'connecting' || status === 'active'

  return (
    <>
      {showPanel && (
        <div className="fixed bottom-28 left-6 z-40 w-[min(360px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-white/10 bg-base-900/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className={`h-2.5 w-2.5 rounded-full ${status === 'active' ? 'bg-emerald-400' : status === 'connecting' ? 'bg-amber-400 animate-pulse' : status === 'error' ? 'bg-red-400' : 'bg-slate-500'}`} />
                Madadkor Call-center
              </div>
              <p className="mt-0.5 text-xs text-slate-400">O‘zbek tilida ovozli yordam</p>
              {lastCase && status === 'idle' && <p className="mt-1 text-[10px] font-semibold text-emerald-300">{lastCase.caseNumber} saqlandi • {lastCase.category}</p>}
            </div>
            <button onClick={() => setShowPanel(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Yopish">
              <X className="h-4 w-4" />
            </button>
          </div>

          {errorMessage ? (
            <div className="m-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs leading-relaxed text-red-200">
              <AlertCircle className="mr-1 inline h-4 w-4" />{safeText(errorMessage)}
            </div>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto p-3">
              {transcript.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center text-xs leading-relaxed text-slate-400">
                  <Volume2 className="mx-auto mb-2 h-5 w-5 text-emerald-300" />
                  {status === 'connecting' ? 'Madadkor ulanmoqda...' : status === 'active' ? 'Gapiring, Madadkor sizni tinglayapti.' : 'Gapirishni boshlang. Madadkor vaziyatingizni tinglaydi.'}
                </div>
              ) : transcript.map((item, index) => (
                <div key={`${index}-${item.role}-${item.text}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${item.role === 'user' ? 'bg-violet-500/20 text-violet-100' : 'bg-white/[0.05] text-slate-200'} ${item.partial ? 'opacity-70' : ''}`}>
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.role === 'user' ? 'Siz' : 'Madadkor'}</span>
                    {safeText(item.text)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {lastCase && status === 'idle' && (
            <div className="mx-3 mb-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
              <div className="font-semibold">CASE {lastCase.caseNumber}</div>
              <div className="mt-1 text-[11px] text-emerald-200/80">Suhbat saqlandi. “Mening ishlarim” bo‘limidan ko‘rishingiz mumkin.</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
            <div className="rounded-xl bg-white/[0.04] p-2.5 text-center">
              <MessageSquare className="mx-auto mb-1 h-4 w-4 text-violet-300" />
              <span className="text-[10px] text-slate-400">AI suhbat</span>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-2.5 text-center">
              <Phone className="mx-auto mb-1 h-4 w-4 text-emerald-300" />
              <span className="text-[10px] text-slate-400">{CALL_CENTER_NUMBER || 'Raqam ulanmoqda'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
        <button
          onClick={handleClick}
          aria-label={isBusy ? 'Suhbatni tugatish' : 'Madadkor bilan gaplashish'}
          title={isBusy ? 'Suhbatni tugatish' : 'Madadkor bilan gaplashish'}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 ${isBusy ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-glow-red' : 'bg-gradient-to-br from-emerald-glow to-violet-glow shadow-glow-violet'}`}
        >
          {isBusy && <span className="absolute inset-0 rounded-full bg-red-500/50 animate-pulse-ring" />}
          <span className="relative z-10 text-slate-950">
            {status === 'connecting' ? <Loader2 className="h-6 w-6 animate-spin" /> : status === 'active' ? <PhoneOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6" />}
          </span>
        </button>
      </div>
    </>
  )
}
