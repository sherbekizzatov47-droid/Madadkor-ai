import { motion } from 'framer-motion'
import {
  BadgeCheck, BriefcaseBusiness, CarFront, FileCheck2, Gavel, HeartHandshake,
  House, Landmark, Scale, ScrollText, ShieldAlert, ShoppingBag, UsersRound,
} from 'lucide-react'

const AREAS = [
  { title:'Mehnat huquqi', icon:BriefcaseBusiness, tone:'emerald', desc:'Ish haqi, ishdan bo‘shatish, mehnat shartnomasi, ta’til va ish joyidagi nizolar.', prompt:'Mehnat huquqi bo‘yicha savolim bor.' },
  { title:'Oila va aliment', icon:HeartHandshake, tone:'rose', desc:'Aliment, ota-ona majburiyatlari, nikoh va oilaviy nizolar bo‘yicha boshlang‘ich yo‘nalish.', prompt:'Oila va aliment masalasida yordam kerak.' },
  { title:'Ajrashish', icon:UsersRound, tone:'violet', desc:'Ajrashish tartibi, hujjatlar va keyingi amaliy qadamlar bo‘yicha yo‘l-yo‘riq.', prompt:'Ajrashish bo‘yicha savolim bor.' },
  { title:'Qarz va shartnoma', icon:ScrollText, tone:'sky', desc:'Qarz, kelishuv, shartnoma bandlari va talabnoma bo‘yicha yordam.', prompt:'Qarz yoki shartnoma bo‘yicha yordam kerak.' },
  { title:'Iste’molchi huquqi', icon:ShoppingBag, tone:'amber', desc:'Sifatsiz mahsulot, xizmat, pulni qaytarish va shikoyat qilish tartibi.', prompt:'Iste’molchi huquqim buzildi.' },
  { title:'Uy-joy va ijara', icon:House, tone:'cyan', desc:'Ijara, uy-joy nizolari va uy-joyga oid hujjatlar bo‘yicha yo‘nalish.', prompt:'Uy-joy yoki ijara masalasida yordam kerak.' },
  { title:'Meros', icon:Landmark, tone:'fuchsia', desc:'Merosni qabul qilish, ulushlar va hujjatlar bo‘yicha dastlabki yo‘l-yo‘riq.', prompt:'Meros masalasida yordam kerak.' },
  { title:'Jinoyat / ma’muriy', icon:ShieldAlert, tone:'red', desc:'Jiddiy yoki shoshilinch vaziyatlarda boshlang‘ich huquqiy yo‘nalish va keyingi qadamlar.', prompt:'Jinoyat yoki ma’muriy holat bo‘yicha savolim bor.' },
  { title:'Ijtimoiy yordam', icon:BadgeCheck, tone:'lime', desc:'Nafaqa, moddiy yordam, ijtimoiy xizmatlar va davlat ko‘magiga yo‘l-yo‘riq.', prompt:'Ijtimoiy yordam bo‘yicha savolim bor.' },
  { title:'Davlat xizmatlari', icon:Gavel, tone:'indigo', desc:'my.gov.uz va boshqa rasmiy elektron xizmatlardan foydalanish bo‘yicha yo‘riqnoma.', prompt:'Davlat xizmati bo‘yicha yordam kerak.' },
  { title:'Yo‘l harakati', icon:CarFront, tone:'orange', desc:'Yo‘l belgilari, YTH, haydovchi va piyoda huquqlari bo‘yicha boshlang‘ich yordam.', prompt:'Yo‘l harakati qoidalari bo‘yicha savolim bor.' },
]

const toneMap = {
  emerald:'from-emerald-400/20 to-teal-400/5 text-emerald-200', rose:'from-rose-400/20 to-pink-400/5 text-rose-200', violet:'from-violet-400/20 to-fuchsia-400/5 text-violet-200', sky:'from-sky-400/20 to-cyan-400/5 text-sky-200', amber:'from-amber-400/20 to-orange-400/5 text-amber-200', cyan:'from-cyan-400/20 to-sky-400/5 text-cyan-200', fuchsia:'from-fuchsia-400/20 to-violet-400/5 text-fuchsia-200', red:'from-red-400/20 to-orange-400/5 text-red-200', lime:'from-lime-400/20 to-emerald-400/5 text-lime-200', indigo:'from-indigo-400/20 to-violet-400/5 text-indigo-200', orange:'from-orange-400/20 to-amber-400/5 text-orange-200'
}

export default function LegalHub(){
  const open = (prompt) => window.dispatchEvent(new CustomEvent('madadkor:start-call',{detail:{message:prompt}}))
  return (
    <section id="rights" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(27,227,180,.06),transparent_28%),radial-gradient(circle_at_90%_70%,rgba(139,107,255,.08),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="section-kicker"><Scale className="h-3.5 w-3.5"/> HUQUQIY NAVIGATSIYA</div>
            <h2 className="premium-title">Muammo qaysi yo‘nalishda bo‘lishidan qat’i nazar, <span className="text-gradient">Madadkor yo‘lni topadi.</span></h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">Savolni huquqiy terminlarda berishingiz shart emas. Oddiy tilda ayting — Madadkor yo‘nalishni aniqlaydi, kerakli savollarni beradi va CASE'ni keyingi amaliy bosqichga olib boradi.</p>
          </div>
          <a href="https://lex.uz/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-white/[0.06]">Rasmiy qonun bazasi <span className="text-slate-500">LexUZ ↗</span></a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {AREAS.map((area, i)=>{ const Icon=area.icon; return (
            <motion.article key={area.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.45,delay:(i%4)*.04}} className={`premium-card group flex min-h-[220px] flex-col p-5 ${i===0 ? 'lg:col-span-5' : i===1 ? 'lg:col-span-3' : i===2 ? 'lg:col-span-4' : i===3 ? 'lg:col-span-4' : i===4 ? 'lg:col-span-3' : i===5 ? 'lg:col-span-5' : 'lg:col-span-3'}`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${toneMap[area.tone]} ring-1 ring-white/10`}><Icon className="h-5 w-5"/></div>
              <h3 className="mt-5 text-base font-bold text-white">{area.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">{area.desc}</p>
              <button onClick={()=>open(area.prompt)} className="mt-auto pt-5 text-left text-xs font-semibold text-emerald-300 transition group-hover:text-white">Savol berish →</button>
            </motion.article>
          )})}
        </div>
      </div>
    </section>
  )
}
