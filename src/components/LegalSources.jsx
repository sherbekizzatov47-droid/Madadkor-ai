import { ExternalLink, Landmark, Scale, ShieldCheck } from 'lucide-react'

const SOURCES = [
  {title:'LexUZ — qonunchilik bazasi', desc:'Qonunlar, kodekslar va normativ-huquqiy hujjatlarning rasmiy bazasi.', href:'https://lex.uz/', icon:Scale},
  {title:'my.gov.uz — davlat xizmatlari', desc:'Yagona interaktiv davlat xizmatlari portali va rasmiy elektron xizmatlar.', href:'https://my.gov.uz/uz', icon:Landmark},
  {title:'MySudUz — raqamli sud xizmatlari', desc:'Sudga elektron murojaat, hujjat namunalari va ish holatini kuzatish.', href:'https://my.sud.uz/', icon:ShieldCheck},
  {title:'Yo‘l harakati qoidalari', desc:'VMQ 172-son (12.04.2022) asosidagi rasmiy qoidalar hujjati.', href:'https://lex.uz/pdffile/6286569', icon:ExternalLink},
]

export default function LegalSources(){
  return <section id="sources" className="relative py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="max-w-3xl"><div className="section-kicker"><ShieldCheck className="h-3.5 w-3.5"/> ISHONCHLI MANBA</div><h2 className="premium-title">AI javobi ortida <span className="text-gradient">rasmiy manbaga qaytish</span> imkoniyati.</h2><p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">Madadkor javobni o‘ylab topmasligi kerak. Mahsulot rasmiy manbalarni ko‘rsatish va foydalanuvchini original hujjatga olib borish tamoyiliga qurilgan.</p></div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SOURCES.map(({title,desc,href,icon:Icon})=><a key={title} href={href} target="_blank" rel="noreferrer" className="premium-card group p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-emerald-300 ring-1 ring-white/10"><Icon className="h-5 w-5"/></div><ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-emerald-300"/></div><h3 className="mt-5 text-sm font-bold text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p></a>)}
      </div>
    </div>
  </section>
}
