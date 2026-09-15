import { useEffect, useMemo, useState } from 'react'
import DocumentBuilder from './DocumentBuilder.jsx'
import CaseDetail from './CaseDetail.jsx'
import {
  ArrowRight,
  FileSearch,
  FileText,
  FolderOpen,
  Gavel,
  Headphones,
  MessageCircle,
  Plus,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'

const MODES = [
  {
    icon: Sparkles,
    title: 'Muammomni aniqlash',
    desc: 'Vaziyatingizni oddiy tilda ayting. Madadkor kerakli savollarni o‘zi beradi.',
    action: 'AI bilan boshlash',
  },
  {
    icon: FileSearch,
    title: 'Hujjatni tahlil qilish',
    desc: 'Shartnoma, ariza yoki boshqa hujjat bo‘yicha nimaga e’tibor berish kerakligini aniqlash.',
    action: 'Hujjat haqida so‘rash',
  },
  {
    icon: FileText,
    title: 'Hujjat tayyorlash',
    desc: 'Ariza, shikoyat yoki murojaat uchun kerakli ma’lumotlarni yig‘ib, matn tayyorlash.',
    action: 'Hujjat tayyorlash',
  },
  {
    icon: Gavel,
    title: 'Keyingi qadamlar',
    desc: 'Muammo bo‘yicha nima qilish, qayerga murojaat qilish va qanday hujjat kerakligini aniqlash.',
    action: 'Yo‘l-yo‘riq olish',
  },
  {
    icon: Headphones,
    title: 'AI Call-center',
    desc: 'Gapirib tushuntiring. AI suhbatni olib boradi va zarur ma’lumotlarni yig‘adi.',
    action: 'Qo‘ng‘iroq qilish',
  },
  {
    icon: Users,
    title: 'Yuristga topshirish',
    desc: 'Murakkab vaziyatlarda yig‘ilgan ma’lumotlarni yurist ko‘rib chiqishi uchun tayyorlash.',
    action: 'Case tayyorlash',
  },
]

const CATEGORIES = ['Mehnat', 'Oila va aliment', 'Ajrashish', 'Qarz va shartnoma', 'Iste’molchi huquqi', 'Uy-joy va ijara', 'Meros', 'Jinoyat / ma’muriy', 'Ijtimoiy yordam', 'Davlat xizmatlari', 'Yo‘l harakati', 'Boshqa']

function readCases() {
  try {
    return JSON.parse(localStorage.getItem('madadkor_cases') || '[]')
  } catch {
    return []
  }
}

export default function MadadkorCenter() {
  const [cases, setCases] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState('Ariza')
  const [caseView, setCaseView] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Barchasi')
  const [categoryFilter, setCategoryFilter] = useState('Barchasi')

  useEffect(() => {
    const sync = () => setCases(readCases())
    sync()
    window.addEventListener('madadkor:cases-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('madadkor:cases-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    const openDoc = (event) => {
      const type = event.detail?.type || 'Ariza'
      setSelectedDocumentType(type)
      const latest = readCases()[0]
      if (latest) setSelectedCase(latest)
      else setShowModal(true)
    }
    window.addEventListener('madadkor:document-type', openDoc)
    const analyze = () => document.querySelector('#analyzer-entry')?.scrollIntoView({behavior:'smooth', block:'center'})
    window.addEventListener('madadkor:analyze-document', analyze)
    return () => {
      window.removeEventListener('madadkor:document-type', openDoc)
      window.removeEventListener('madadkor:analyze-document', analyze)
    }
  }, [])

  const startChat = (mode) => {
    if (mode === 'Hujjatni tahlil qilish') { window.dispatchEvent(new CustomEvent('madadkor:analyze-document')); return }
    if (mode === 'Hujjat tayyorlash') {
      if (cases.length > 0) {
        setSelectedCase(cases[0])
      } else {
        setShowModal(true)
      }
      return
    }

    const prompts = {
      'Muammomni aniqlash': 'Mening huquqiy muammomni savollar berib aniqlab ber.',
      'Hujjatni tahlil qilish': 'Men huquqiy hujjat bo‘yicha yordam olmoqchiman.',
      'Keyingi qadamlar': 'Muammom bo‘yicha keyingi qadamlarni aniqlab ber.',
      'Case tayyorlash': 'Mening holatim bo‘yicha yuristga topshirish uchun case tayyorlashga yordam ber.',
    }
    window.dispatchEvent(new CustomEvent('madadkor:start-call', { detail: { message: prompts[mode] || 'Menga huquqiy masalam bo‘yicha yordam ber.' } }))
  }


  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cases.filter((item) => {
      const matchesQuery = !q || [item.title, item.caseNumber, item.summary, item.category].filter(Boolean).join(' ').toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'Barchasi' || (item.status || 'Yangi') === statusFilter
      const matchesCategory = categoryFilter === 'Barchasi' || (item.category || 'Boshqa') === categoryFilter
      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [cases, query, statusFilter, categoryFilter])

  const deleteCase = (id) => {
    if (!window.confirm('Shu CASEni o‘chirmoqchimisiz?')) return
    const next = cases.filter((item) => item.id !== id)
    setCases(next)
    localStorage.setItem('madadkor_cases', JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('madadkor:cases-updated'))
    if (caseView?.id === id) setCaseView(null)
  }

  const createCase = (event) => {
    event.preventDefault()
    if (!title.trim()) return

    const newCase = {
      id: Date.now(),
      title: title.trim(),
      category,
      status: 'Yangi',
      createdAt: new Date().toLocaleDateString('uz-UZ'),
    }
    const next = [newCase, ...cases]
    setCases(next)
    localStorage.setItem('madadkor_cases', JSON.stringify(next))
    setTitle('')
    setCategory(CATEGORIES[0])
    setShowModal(false)
  }

  return (
    <section id="madadkor-center" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-glow/20 bg-emerald-glow/5 px-3 py-1 text-xs font-semibold text-emerald-glow">
              <ShieldAlert className="h-3.5 w-3.5" />
              Madadkor markazi
            </div>
            <h3 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Bitta chat emas. <span className="text-gradient">Muammodan yechimgacha.</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              Madadkor muammoni eshitadi, savollar beradi, case yaratishga yordam beradi va keyingi qadamlarni tartiblaydi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
          >
            <Plus className="h-4 w-4 text-emerald-glow" />
            Yangi case yaratish
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((mode, index) => {
            const Icon = mode.icon
            const isCall = mode.title === 'AI Call-center'
            return (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
                className="glass-card group flex min-h-[220px] flex-col p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-glow/15 to-violet-glow/15 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 text-emerald-glow" />
                  </div>
                  {isCall && <span className="rounded-full bg-emerald-glow/10 px-2 py-1 text-[10px] font-bold text-emerald-glow">24/7</span>}
                </div>
                <h4 className="mt-5 font-display text-lg font-bold text-white">{mode.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{mode.desc}</p>
                <button
                  type="button"
                  onClick={() => (isCall ? document.querySelector('[aria-label="Ovozli qo‘ng‘iroq"]')?.click() : startChat(mode.title))}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-emerald-glow transition group-hover:text-white"
                >
                  {mode.action}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-glow/10">
                <FolderOpen className="h-5 w-5 text-violet-glow" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-white">Mening ishlarim</h4>
                <p className="text-xs text-slate-500">Case'laringiz shu qurilmada saqlanadi</p>
              </div>
            </div>

            {cases.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="text-sm text-slate-400">Hozircha case yo‘q.</p>
                <button type="button" onClick={() => setShowModal(true)} className="mt-3 text-sm font-semibold text-emerald-glow">
                  Birinchi case'ni yaratish →
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="CASE qidirish..." className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-glow/50" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#111923] px-3 py-2.5 text-xs text-white outline-none">
                    {['Barchasi', 'Yangi', 'Jarayonda', 'Yakunlangan'].map((x) => <option key={x}>{x}</option>)}
                  </select>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#111923] px-3 py-2.5 text-xs text-white outline-none">
                    {['Barchasi', ...CATEGORIES].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">{filteredCases.length} ta ko‘rsatildi / {cases.length} ta jami</p>
                  <button type="button" onClick={() => { if (window.confirm("Shu qurilmadagi barcha CASE'larni o‘chirasizmi?")) { localStorage.removeItem('madadkor_cases'); setCases([]); window.dispatchEvent(new CustomEvent('madadkor:cases-updated')) } }} className="text-[11px] font-semibold text-rose-300/80 hover:text-rose-200">Hammasini tozalash</button>
                </div>
                {filteredCases.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
                    <p className="text-sm text-slate-400">Bu filtr bo‘yicha CASE topilmadi.</p>
                  </div>
                ) : filteredCases.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{item.caseNumber ? `${item.caseNumber} • ` : ''}{item.category || 'Boshqa'} • {item.createdAt}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-glow/10 px-2 py-1 text-[10px] font-semibold text-emerald-glow">{item.status || 'Yangi'}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setCaseView(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-white/5">CASEni ochish</button>
                      <button type="button" onClick={() => setSelectedCase(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-glow/20 bg-emerald-glow/5 px-3 py-2 text-[11px] font-semibold text-emerald-glow hover:bg-emerald-glow/10">
                        <FileText className="h-3.5 w-3.5" /> Ariza
                      </button>
                      <button type="button" onClick={() => deleteCase(item.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/10 px-3 py-2 text-[11px] font-semibold text-rose-300/80 hover:bg-rose-400/5">O‘chirish</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card overflow-hidden p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-glow/10">
                <MessageCircle className="h-5 w-5 text-emerald-glow" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-white">Qanday boshlaymiz?</h4>
                <p className="text-xs text-slate-500">Huquqiy terminlarni bilishingiz shart emas</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                'Muammoingizni oddiy tilda ayting',
                'Madadkor kerakli savollarni beradi',
                'Javoblar asosida case shakllanadi',
                'Keyingi qadamlar va hujjatlar aniqlanadi',
              ].map((text, index) => (
                <div key={text} className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-[11px] font-bold text-emerald-glow">{index + 1}</span>
                  <span className="text-slate-300">{text}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => startChat('Muammomni aniqlash')} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-glow px-4 py-3 text-sm font-bold text-slate-950 shadow-glow-emerald transition hover:scale-[1.01]">
              <Sparkles className="h-4 w-4" />
              Muammomni aniqlashni boshlash
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <form onSubmit={createCase} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1018] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-glow/10">
                <FolderOpen className="h-5 w-5 text-emerald-glow" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-white">Yangi case</h4>
                <p className="text-xs text-slate-500">Muammoingizni keyin davom ettirish uchun saqlang</p>
              </div>
            </div>

            <label className="mt-6 block text-xs font-semibold text-slate-300">Muammo nomi</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus placeholder="Masalan: Maoshim berilmayapti" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-glow/50" />

            <label className="mt-4 block text-xs font-semibold text-slate-300">Yo‘nalish</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111923] px-4 py-3 text-sm text-white outline-none focus:border-emerald-glow/50">
              {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Bekor qilish</button>
              <button type="submit" disabled={!title.trim()} className="flex-1 rounded-xl bg-emerald-glow px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">Saqlash</button>
            </div>
          </form>
        </div>
      )}

      {caseView && (
        <CaseDetail
          item={caseView}
          onClose={() => setCaseView(null)}
          onBuildDocument={(item) => { setCaseView(null); setSelectedCase(item) }}
        />
      )}

      {selectedCase && (
        <DocumentBuilder item={{...selectedCase, _documentType: selectedDocumentType}} onClose={() => setSelectedCase(null)} />
      )}
    </section>
  )
}
