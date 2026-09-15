import { useMemo, useState } from 'react'
import { FileDown, FileText, Copy, Download, Save, Send, X } from 'lucide-react'
import SubmissionGuide from './SubmissionGuide.jsx'
import { downloadWord, printAsPdf } from '../lib/documentExport.js'

const NOISE = [
  /mening ishlarim(?:ga)?\s+(?:keys|case)[^.!?;]*(?:ariza|hujjat)[^.!?;]*/ig,
  /suhbatni\s+(?:yakunla|tugat|to['’]?xtat)\b/ig,
  /chatni\s+(?:yakunla|tugat|yop)\b/ig,
  /boshlaymiz(?:\s+endi)?\b/ig,
]

function cleanText(value) {
  let text = String(value ?? '').replace(/\s+/g, ' ').trim()
  NOISE.forEach((pattern) => {
    text = text.replace(pattern, ' ')
  })
  return text.replace(/\s+/g, ' ').trim()
}

function cleanDetails(value) {
  return cleanText(value)
    .replace(/(?:\s*;\s*)+/g, '; ')
    .replace(/\.{2,}/g, '.')
}

function firstMatch(text, pattern) {
  const match = String(text || '').match(pattern)
  return match?.[1]?.trim() || ''
}

function getUserText(item) {
  return Array.isArray(item?.transcript)
    ? item.transcript
        .filter((entry) => entry?.role === 'user')
        .map((entry) => entry?.text || '')
        .join(' ')
    : ''
}

function initialForm(item) {
  const user = getUserText(item)
  const structured = item?.structuredData || {}
  const seed = item?.application || {}

  const fullName =
    seed.fullName ||
    structured.fullName ||
    firstMatch(
      user,
      /\b(?:mening\s+)?ismim\s*(?:bu|—|-)?\s*([^,.;!?]+?)(?=\s+(?:ishxonam|telefonim|raqamim|lavozimim)|[,.!?]|$)/i,
    )

  const phone =
    seed.phone ||
    structured.phone ||
    firstMatch(
      user,
      /(?:\+?998[\s-]?)?(\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2})/i,
    )

  const workplace =
    seed.workplace ||
    structured.workplace ||
    firstMatch(
      user,
      /\b(?:ishxonam|ish\s+joyim|tashkilotim)\s*(?:nomi|joyi)?\s*[:\-]?\s*([^.!?]+?)(?=\s+(?:iyun|iyul|avgust|sentabr|oktabr|noyabr|dekabr|oyligim|maoshim|lavozimim|telefonim|raqamim|mehnat|shartnoma|bor|yo‘q|yoq)|[.!?]|$)/i,
    )

  const position =
    seed.position ||
    structured.position ||
    firstMatch(
      user,
      /\blavozimim\s*(?:bu|—|-)?\s*([^,.!?]+?)(?=\s+(?:oyligim|maoshim|ishxonam|ish\s+joyim|mehnat|shartnoma)|[,.!?]|$)/i,
    )

  return {
    to: seed.to || 'Tegishli tashkilot rahbariga',
    fullName,
    phone,
    workplace,
    position,
    subject: seed.subject || '',
    details: cleanDetails(seed.details || item?.summary || ''),
    attachments: seed.attachments || '',
  }
}

const TYPE_META = {
  Ariza: ['ARIZA', 'rasmiy murojaat'],
  Shikoyat: ['SHIKOYAT', 'huquq buzilishi bo‘yicha shikoyat'],
  Talabnoma: ['TALABNOMA', 'talabni rasmiylashtirish'],
  'Tushuntirish xati': ['TUSHUNTIRISH XATI', 'holatni rasmiy bayon qilish'],
  'Sudga da’vo loyihasi': ['SUDGA DA’VO LOYIHASI', 'sudga murojaat loyihasi'],
  'Apellyatsiya / shikoyat': ['APELLYATSIYA / SHIKOYAT', 'sud hujjati bo‘yicha e’tiroz loyihasi'],
  'Ish beruvchiga talabnoma': ['ISH BERUVCHIGA TALABNOMA', 'mehnat bo‘yicha yozma talab'],
}

function buildDoc(data, type) {
  const [heading, kind] = TYPE_META[type] || TYPE_META.Ariza
  const today = new Date().toLocaleDateString('uz-UZ')

  const to = cleanText(data.to) || 'Tegishli tashkilot rahbariga'
  const fullName = cleanText(data.fullName) || '________________'
  const phone = cleanText(data.phone) || '________________'
  const workplace = cleanText(data.workplace) || '________________'
  const position = cleanText(data.position) || '________________'
  const subject = cleanText(data.subject) || cleanText(data.caseTitle) || kind
  const details = cleanDetails(data.details) || '________________'
  const attachments = cleanText(data.attachments) || 'Mavjud hujjatlar nusxalari.'

  return `${heading}

Kimga: ${to}
Kimdan: ${fullName}
Telefon: ${phone}

Mavzu: ${subject}

Men, ${fullName}, ${workplace} tashkilotida ${position} lavozimida faoliyat yuritaman.

Holat tafsilotlari:
${details}

Shu munosabat bilan, holatni ko‘rib chiqishingizni hamda qonunchilikka muvofiq tegishli choralarni ko‘rishingizni so‘rayman.

Ilova:
${attachments}

Sana: ${today}
Imzo: ____________________
`
}

export default function DocumentBuilder({ item, onClose, onSaved }) {
  const type = item?._documentType || 'Ariza'
  const [form, setForm] = useState(() => initialForm(item))
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const text = useMemo(
    () => buildDoc({ ...form, caseTitle: item?.title }, type),
    [form, type, item?.title],
  )

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const saveToCase = () => {
    try {
      const cases = JSON.parse(localStorage.getItem('madadkor_cases') || '[]')
      const next = cases.map((currentCase) =>
        currentCase.caseNumber === item?.caseNumber
          ? {
              ...currentCase,
              application: form,
              applicationType: type,
              applicationText: text,
              applicationUpdatedAt: new Date().toISOString(),
            }
          : currentCase,
      )

      localStorage.setItem('madadkor_cases', JSON.stringify(next))
      window.dispatchEvent(new CustomEvent('madadkor:cases-updated'))
      setSaved(true)
      onSaved?.({
        ...item,
        application: form,
        applicationType: type,
        applicationText: text,
      })
      setTimeout(() => setSaved(false), 1600)
    } catch {
      // localStorage unavailable
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = `${(item?.caseNumber || 'madadkor-hujjat').toLowerCase()}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const fields = [
    ['to', 'Kimga', 'Tegishli tashkilot rahbariga'],
    ['fullName', 'F.I.Sh.', 'Ism-familiya'],
    ['phone', 'Telefon', '+998 90 000 00 00'],
    ['workplace', 'Tashkilot / ish joyi', 'Masalan: ABC MCHJ'],
    ['position', 'Lavozim', 'Masalan: sotuvchi'],
    ['subject', 'Mavzu', 'Hujjat mavzusi'],
  ]

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[30px] border border-white/10 bg-[#081018] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="section-kicker">
              <FileText className="h-3.5 w-3.5" />
              HUJJAT STUDIYASI
            </div>
            <h3 className="mt-3 text-2xl font-bold text-white">{type}</h3>
            <p className="mt-1 text-xs text-slate-500">
              CASE: {item?.caseNumber || '—'} {item?.category ? `• ${item.category}` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"
          >
            <X />
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {fields.map(([key, label, placeholder]) => (
            <label key={key} className="text-xs text-slate-300">
              <span className="mb-1.5 block font-semibold">{label}</span>
              <input
                value={form[key] || ''}
                onChange={(event) => update(key, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-glow/50"
              />
            </label>
          ))}
        </div>

        <label className="mt-4 block text-xs text-slate-300">
          <span className="mb-1.5 block font-semibold">Holat tafsilotlari</span>
          <textarea
            value={form.details || ''}
            onChange={(event) => update('details', event.target.value)}
            rows={7}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm leading-6 text-white outline-none focus:border-emerald-glow/50"
          />
        </label>

        <label className="mt-4 block text-xs text-slate-300">
          <span className="mb-1.5 block font-semibold">Ilovalar</span>
          <input
            value={form.attachments || ''}
            onChange={(event) => update('attachments', event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none"
          />
        </label>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <div className="mb-2 text-xs font-semibold text-slate-300">Ko‘rib chiqish</div>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-6 text-slate-300">
            {text}
          </pre>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={saveToCase}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-glow/20 bg-emerald-glow/5 px-4 py-3 text-xs font-semibold text-emerald-glow"
          >
            <Save className="h-4 w-4" />
            {saved ? 'CASEga saqlandi' : 'CASEga saqlash'}
          </button>

          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-glow/20 bg-violet-glow/5 px-4 py-3 text-xs font-semibold text-violet-200"
          >
            <Send className="h-4 w-4" />
            Qayerga yuborish?
          </button>

          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-white"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Nusxalandi' : 'Nusxalash'}
          </button>

          <button
            type="button"
            onClick={downloadText}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-slate-200"
          >
            <Download className="h-4 w-4" />
            TXT
          </button>

          <button
            type="button"
            onClick={() =>
              downloadWord(
                text,
                `${(item?.caseNumber || 'madadkor-hujjat').toLowerCase()}.doc`,
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/5 px-4 py-3 text-xs font-semibold text-sky-200"
          >
            <FileText className="h-4 w-4" />
            Word
          </button>

          <button
            type="button"
            onClick={() => printAsPdf(text, `${item?.caseNumber || 'Madadkor AI'} — ${type}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-glow px-4 py-3 text-xs font-bold text-slate-950"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {showGuide && (
        <SubmissionGuide
          item={item}
          onClose={() => setShowGuide(false)}
        />
      )}
    </div>
  )
}
