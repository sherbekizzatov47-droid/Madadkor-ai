import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Check, CheckCircle2, Circle, ClipboardList, Clock3, ExternalLink,
  FileDown, FileSearch, FileText, Gavel, Mic, RotateCcw, Send, Siren, Sparkles, Tag, X
} from 'lucide-react'
import { printAsPdf, downloadWord } from '../lib/documentExport.js'

const NOISE = [
  /mening ishlarim(?:ga)?\s+(?:keys|case)[^.!?;]*(?:ariza|hujjat)[^.!?;]*/ig,
  /ariza(?:ni)?\s+(?:qilib ber|tayyorlab ber|ochib ko['’]?r|och)\b/ig,
  /suhbatni\s+(?:yakunla|tugat|to['’]?xtat)\b/ig,
  /chatni\s+(?:yakunla|tugat|yop)\b/ig,
  /telefonni\s+o['’]?chir\b/ig,
  /boshlaymiz(?:\s+endi)?\b/ig,
]

function cleanCaseText(value) {
  let text = String(value ?? '').replace(/\s+/g, ' ').trim()
  NOISE.forEach((rule) => { text = text.replace(rule, ' ') })
  return text.replace(/\s+/g, ' ').replace(/[|•]+/g, ' ').trim()
}

function detectUrgency(item) {
  const source = [item?.title, item?.summary, ...(item?.keyFacts || [])].join(' ')
  return Boolean(item?.urgent) || /bugun|hozir|zudlik|tahdid|zo['’]ravon|politsiya|ushlab|qamoq|sudim|sud bor|hayotga xavf|jarohat/i.test(source)
}

function officialLinks(category) {
  const c = String(category || '').toLowerCase()
  const links = [['LexUZ', 'https://lex.uz/'], ['my.gov.uz', 'https://my.gov.uz/uz']]
  if (c.includes('sud') || c.includes('jinoyat') || c.includes('ma’muriy') || c.includes('ma`muriy')) links.push(['MySudUz', 'https://my.sud.uz/'])
  return links
}

export default function CaseDetail({ item, onClose, onBuildDocument }) {
  const [completed, setCompleted] = useState([])
  const actionKey = item?.id ? `madadkor_case_actions_${item.id}` : ''
  const steps = useMemo(() => Array.isArray(item?.nextSteps) && item.nextSteps.length ? item.nextSteps.slice(0, 3) : [
    'Mavjud hujjat va dalillarni saqlash',
    'Muammo bo‘yicha tegishli rasmiy murojaat yo‘lini aniqlash',
    'Kerakli hujjat loyihasini tayyorlash',
  ], [item?.nextSteps])

  useEffect(() => {
    try { setCompleted(JSON.parse(localStorage.getItem(actionKey) || '[]')) } catch { setCompleted([]) }
  }, [actionKey])

  const toggleStep = (index) => {
    setCompleted((current) => {
      const next = current.includes(index) ? current.filter((x) => x !== index) : [...current, index]
      if (actionKey) localStorage.setItem(actionKey, JSON.stringify(next))
      return next
    })
  }

  const resetSteps = () => {
    setCompleted([])
    if (actionKey) localStorage.removeItem(actionKey)
  }

  if (!item) return null

  const urgency = detectUrgency(item)
  const doneCount = completed.filter((index) => index >= 0 && index < steps.length).length
  const progress = Math.round((doneCount / steps.length) * 100)
  const facts = Array.isArray(item.keyFacts) ? item.keyFacts.map(cleanCaseText).filter(Boolean) : []
  const data = item.structuredData || {}
  const clientRows = [
    ['F.I.Sh.', data.fullName],
    ['Telefon', data.phone],
    ['Ish joyi', data.workplace],
    ['Lavozim', data.position],
    ['To‘lanmagan davr', data.unpaidPeriod],
    ['Mehnat shartnomasi', data.hasContract ? 'Mavjud' : null],
    ['Yozma murojaat', data.writtenRequest ? 'Qilingan' : null],
    ['Talab', data.demand],
  ].filter(([, value]) => value)

  const links = officialLinks(item.category)

  return (
    <div className="fixed inset-0 z-[78] flex items-center justify-center bg-[#02050a]/90 px-4 py-5 backdrop-blur-xl" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,.07),transparent_28%),#071017] shadow-[0_30px_100px_rgba(0,0,0,.55)]">
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#071017]/85 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="section-kicker"><ClipboardList className="h-3.5 w-3.5"/> HUQUQIY ISH</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h3 className="truncate text-2xl font-black tracking-tight text-white sm:text-3xl">{cleanCaseText(item.title) || 'Huquqiy ish'}</h3>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-200">{item.status || 'Yangi'}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{item.caseNumber || 'CASE'} • {item.createdAt || ''}</p>
            </div>
            <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"><X className="h-5 w-5"/></button>
          </div>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Yo‘nalish', item.category || 'Boshqa', Tag, 'text-emerald-300'],
              ['Holat', item.status || 'Yangi', Clock3, 'text-sky-300'],
              ['Muhimlik', item.priority || 'Oddiy', Siren, 'text-amber-300'],
              ['Suhbat', `${Array.isArray(item.transcript) ? item.transcript.length : 0} ta xabar`, Mic, 'text-violet-300'],
            ].map(([label, value, Icon, tone]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.035]">
                <Icon className={`h-4 w-4 ${tone}`} />
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-bold text-white">{cleanCaseText(value)}</p>
              </div>
            ))}
          </div>

          {urgency && (
            <div className="relative overflow-hidden rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-5">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-red-400/10 blur-2xl" />
              <div className="relative flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-200"><Siren className="h-4 w-4"/></div>
                <div>
                  <p className="text-sm font-black text-red-100">Shoshilinch holat</p>
                  <p className="mt-1 text-xs leading-6 text-red-100/70">Bu ish shoshilinch bo‘lishi mumkin. Avvalo xavfsizlikni ta’minlang va tegishli vakolatli xizmat yoki malakali yuristga zudlik bilan murojaat qiling.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <section className="rounded-[26px] border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(45,212,191,.07),rgba(255,255,255,.025))] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200"><Sparkles className="h-4 w-4"/> Hozir nima qilaman?</div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">CASE bo‘yicha eng muhim navbatdagi yo‘l.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[10px] font-bold text-slate-400">{progress}%</span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {steps.map((step, index) => {
                  const done = completed.includes(index)
                  return (
                    <button key={`${index}-${step}`} onClick={() => toggleStep(index)} className={`group rounded-2xl border p-4 text-left transition ${done ? 'border-emerald-300/20 bg-emerald-300/[0.06]' : 'border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.03]'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-300">0{index + 1}</span>
                        {done ? <CheckCircle2 className="h-4 w-4 text-emerald-300"/> : <Circle className="h-4 w-4 text-slate-600 transition group-hover:text-slate-400"/>}
                      </div>
                      <p className={`mt-3 text-sm font-semibold leading-5 ${done ? 'text-slate-500 line-through' : 'text-white'}`}>{step}</p>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-sky-300 transition-all duration-500" style={{ width: `${progress}%` }}/></div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500"><span>{doneCount} / {steps.length} qadam bajarildi</span><button onClick={resetSteps} className="inline-flex items-center gap-1.5 hover:text-slate-300"><RotateCcw className="h-3 w-3"/> Qayta</button></div>
            </section>

            <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300"><ClipboardList className="h-4 w-4 text-violet-300"/> AI xulosasi</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{cleanCaseText(item.summary) || 'Suhbat asosida xulosa hali tayyorlanmagan.'}</p>
            </section>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-sky-200"><Tag className="h-4 w-4"/> Mijoz ma’lumotlari</div>
              {clientRows.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {clientRows.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{label}</p><p className="mt-1.5 text-sm leading-5 text-slate-200">{cleanCaseText(value)}</p></div>)}
                </div>
              ) : <p className="mt-4 text-sm text-slate-500">Mijoz ma’lumotlari hali to‘liq yig‘ilmagan.</p>}
            </section>

            <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-violet-200"><ClipboardList className="h-4 w-4"/> Muhim faktlar</div><span className="text-[10px] text-slate-500">{facts.length} ta</span></div>
              {facts.length ? <ul className="mt-4 space-y-2.5">{facts.map((fact, index) => <li key={`${index}-${fact}`} className="flex gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm leading-5 text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300"/>{fact}</li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Faktlar ajratilmagan.</p>}
            </section>
          </div>

          <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-sky-200"><ExternalLink className="h-4 w-4"/> Sizga mos rasmiy xizmatlar</div><p className="mt-1 text-xs text-slate-500">Original manbaga o‘tish uchun rasmiy havolalar.</p></div><Gavel className="h-4 w-4 text-slate-600"/></div>
            <div className="mt-4 flex flex-wrap gap-2">{links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.04]"><span>{label}</span><ExternalLink className="h-3.5 w-3.5 text-emerald-300"/></a>)}</div>
          </section>

          {item.applicationText && (
            <section className="rounded-[26px] border border-emerald-300/15 bg-emerald-300/[0.035] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200"><FileText className="h-4 w-4"/> Tayyor hujjat</div><p className="mt-1 text-xs text-slate-500">Hujjat CASE ichida saqlangan.</p></div><Check className="h-4 w-4 text-emerald-300"/></div>
              <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => printAsPdf(item.applicationText, `${item.caseNumber || 'Madadkor'} — Hujjat`)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-slate-950"><FileDown className="h-4 w-4"/> PDF</button><button onClick={() => downloadWord(item.applicationText, `${(item.caseNumber || 'madadkor-hujjat').toLowerCase()}.doc`)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-200"><FileText className="h-4 w-4"/> Word</button></div>
            </section>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 pt-5">
            <button onClick={() => window.dispatchEvent(new CustomEvent('madadkor:analyze-document'))} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04]"><FileSearch className="h-4 w-4"/> Hujjatni tahlil qilish</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('madadkor:start-call', { detail: { message: 'Mavjud CASE bo‘yicha yetishmayotgan ma’lumotlarni bittadan so‘rab, suhbatni davom ettir.' } }))} className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/[0.05] px-4 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-300/[0.08]"><Mic className="h-4 w-4"/> Suhbatni davom ettirish</button>
            <button onClick={() => onBuildDocument(item)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-black text-slate-950"><FileText className="h-4 w-4"/> Ariza tayyorlash</button>
            <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04]">Yopish</button>
          </div>
        </div>
      </div>
    </div>
  )
}
