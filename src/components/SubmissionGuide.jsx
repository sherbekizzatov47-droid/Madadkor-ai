import { ExternalLink, MapPin, Phone, X } from 'lucide-react'

const DESTINATIONS = [
  {
    id: 'employer',
    title: 'Ish beruvchiga',
    desc: 'Avval arizani ish beruvchining o‘ziga yuborish yoki topshirish mumkin.',
    badge: '1-qadam',
  },
  {
    id: 'labor',
    title: 'Mehnat inspeksiyasi',
    desc: 'Mehnat huquqi bilan bog‘liq masalalarda rasmiy ma’lumot va murojaat yo‘nalishi.',
    badge: 'Mehnat',
    url: 'https://gov.uz/oz/bv/activity_page/inspectorate',
    phone: '+998 71 200-06-00',
  },
  {
    id: 'mygov',
    title: 'Yagona portal (my.gov.uz)',
    desc: 'Elektron murojaatlar va davlat xizmatlari uchun rasmiy portal.',
    badge: 'Onlayn',
    url: 'https://my.gov.uz/uz',
    phone: '1242 — umumiy savollar',
  },
  {
    id: 'court',
    title: 'Sudga murojaat',
    desc: 'Sudga murojaat yuborish uchun my.gov.uz dagi rasmiy xizmat.',
    badge: 'Sud',
    url: 'https://my.gov.uz/uz/service/1318',
  },
]

export default function SubmissionGuide({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#091019] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-full border border-emerald-glow/20 bg-emerald-glow/5 px-3 py-1 text-xs font-semibold text-emerald-glow">
              Qayerga yuborish?
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">Arizangiz uchun mos yo‘nalish</h3>
            <p className="mt-1 text-xs text-slate-500">
              {item?.caseNumber ? `CASE: ${item.caseNumber}` : 'CASE'} {item?.category ? `• ${item.category}` : ''}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Yopish"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {DESTINATIONS.map((destination) => (
            <div key={destination.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white">{destination.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{destination.desc}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-400">{destination.badge}</span>
              </div>

              {destination.phone && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-emerald-glow" />
                  {destination.phone}
                </div>
              )}

              {destination.url ? (
                <a href={destination.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-glow/20 bg-emerald-glow/5 px-3 py-2 text-xs font-semibold text-emerald-glow hover:bg-emerald-glow/10">
                  <ExternalLink className="h-3.5 w-3.5" /> Rasmiy sahifani ochish
                </a>
              ) : (
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> Hujjatni topshirish tartibini ish beruvchidan aniqlang
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4 text-xs leading-5 text-slate-400">
          <strong className="text-slate-200">Muhim:</strong> Madadkor qaysi yo‘nalish mosligini ko‘rsatadi, lekin yakuniy tanlov va huquqiy baho vaziyatga qarab tekshirilishi kerak. Arizani yuborishdan oldin ma’lumotlaringiz va ilovalarni tekshiring.
        </div>
      </div>
    </div>
  )
}
