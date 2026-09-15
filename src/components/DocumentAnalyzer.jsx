import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, FileSearch, ShieldAlert, Upload, X } from 'lucide-react'

function analyze(text) {
  const t = String(text || '').toLowerCase()
  return [
    ['Ish haqi', /ish haqi|maosh|oylik/.test(t) ? 'Ish haqi yoki to‘lovga oid band topildi.' : 'Aniq band topilmadi.'],
    ['Ish vaqti', /ish vaqti|ish kuni|soat/.test(t) ? 'Ish vaqti yoki ish kuni haqida band topildi.' : 'Aniq band topilmadi.'],
    ['Ta’til', /ta’til|otpuska/.test(t) ? 'Ta’tilga oid band topildi.' : 'Aniq band topilmadi.'],
    ['Shartnoma muddati', /muddat|amal qilish|shartnoma/.test(t) ? 'Shartnoma muddati yoki amal qilishiga oid iboralar topildi.' : 'Aniq band topilmadi.'],
    ['Bekor qilish', /bekor|tugatish|bo‘shatish|ishdan chiqarish/.test(t) ? 'Shartnomani bekor qilish yoki ishdan bo‘shatishga oid ibora topildi.' : 'Aniq band topilmadi.'],
    ['Jarima / javobgarlik', /jarima|penya|javobgarlik|zarar/.test(t) ? 'Jarima, penya yoki javobgarlik bandi topildi.' : 'Aniq band topilmadi.'],
  ]
}

function detectUrgent(text) {
  return /bugun|hozir|zudlik|tahdid|zo['’]ravon|politsiya|ushlab|qamoq|sud bor|hayotga xavf|jarohat/i.test(String(text || ''))
}

export default function DocumentAnalyzer({ onClose }) {
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const findings = useMemo(() => analyzed && text ? analyze(text) : [], [analyzed, text])
  const urgent = detectUrgent(text)

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setName(file.name)
    setError('')
    setAnalyzed(false)
    if (file.type === 'text/plain' || /\.(txt|md|csv|json|html)$/i.test(file.name)) {
      const reader = new FileReader()
      reader.onload = () => setText(String(reader.result || ''))
      reader.readAsText(file)
    } else {
      setError('Demo rejimida hozircha TXT, MD, CSV, JSON yoki HTML matnlari tahlil qilinadi. PDF/DOCX uchun backend parser bosqichi kerak bo‘ladi.')
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#02050a]/90 px-4 py-6 backdrop-blur-xl" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,.08),transparent_30%),#071017] p-6 shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="section-kicker"><FileSearch className="h-3.5 w-3.5"/> HUJJAT STUDIYASI</div>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">Hujjatdagi muhim bandlarni toping.</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Madadkor matndan ehtimoliy bandlarni ajratadi. Huquqiy xulosa sifatida emas, tekshiruvga yordam beruvchi ko‘rsatma sifatida foydalaning.</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-400 hover:bg-white/[0.06] hover:text-white"><X className="h-5 w-5"/></button>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-4">
            <label className="group flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-emerald-300/30 hover:bg-emerald-300/[0.025]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300 ring-1 ring-emerald-300/10"><Upload className="h-6 w-6"/></div>
              <span className="mt-4 text-sm font-bold text-white">Hujjat yuklash</span>
              <span className="mt-1 text-xs text-slate-500">TXT, MD, CSV, JSON, HTML</span>
              <input type="file" className="hidden" accept=".txt,.md,.csv,.json,.html,text/plain,text/csv,text/html,application/json" onChange={handleFile}/>
            </label>

            {name && <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs text-slate-400">Fayl: <span className="font-bold text-white">{name}</span></div>}
            {error && <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-4 text-xs leading-5 text-amber-100">{error}</div>}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-6 text-slate-400">Aniq bo‘lmagan band “topilmadi” deb ko‘rsatiladi. Tizim qonun moddasini to‘qib chiqarmasligi kerak.</div>

            {urgent && <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-4"><div className="flex gap-3"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-200"/><div><p className="text-xs font-black text-red-100">Shoshilinch signal aniqlandi</p><p className="mt-1 text-xs leading-5 text-red-100/70">Matnda shoshilinch holatga o‘xshash ibora bor. Bu hujjatning o‘zidan kelib chiqadigan yakuniy huquqiy xulosa emas.</p></div></div></div>}
          </div>

          <div>
            <textarea value={text} onChange={(event) => { setText(event.target.value); setAnalyzed(false) }} placeholder="Yoki hujjat matnini shu yerga joylang…" className="min-h-[260px] w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-600 focus:border-emerald-300/40" />
            <div className="mt-3 flex justify-end"><button onClick={() => setAnalyzed(true)} disabled={!text.trim()} className="rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">Tahlilni boshlash</button></div>

            {findings.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {findings.map(([label, description]) => {
                  const found = description.includes('topildi')
                  return <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/15"><div className="flex items-center gap-2">{found ? <CheckCircle2 className="h-4 w-4 text-emerald-300"/> : <AlertCircle className="h-4 w-4 text-slate-500"/>}<span className="text-xs font-bold text-white">{label}</span></div><p className="mt-2 text-xs leading-5 text-slate-400">{description}</p></div>
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
