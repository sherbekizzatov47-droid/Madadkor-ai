import { motion } from 'framer-motion'
import { Building2, Gavel, Shield, CarFront, Scale, ArrowUpRight, Phone, Send, Globe, X } from 'lucide-react'
import { useState } from 'react'

const INSTITUTIONS = [
  { key:'court', title:'O‘zbekiston sud tizimi', short:'SUD', desc:'Sudga oid masalalar, nizolar va protsessual yo‘nalishlar.', icon:Gavel, tone:'gold', phone:'+998712077377', phoneLabel:'(71) 207-73-77', telegram:'https://t.me/suduzbot', telegramLabel:'@suduzbot', site:'https://my.sud.uz/' },
  { key:'prosecutor', title:'Prokuratura', short:'PROKURATURA', desc:'Qonuniylik, murojaatlar va prokuror nazoratiga oid yo‘nalishlar.', icon:Scale, tone:'red', phone:'1007', phoneLabel:'1007', site:'https://gov.uz/oz/prokuratura' },
  { key:'iiv', title:'Ichki ishlar', short:'IIV', desc:'Jamoat xavfsizligi va ichki ishlar masalalari.', icon:Shield, tone:'blue', phone:'102', phoneLabel:'102', phone2:'1102', phone2Label:'1102', telegram:'https://t.me/iivuz_tv', telegramLabel:'@iivuz_tv', site:'https://gov.uz/oz/iiv' },
  { key:'dxx', title:'DXX', short:'DXX', desc:'Davlat xavfsizligi yo‘nalishidagi murojaatlar.', icon:Shield, tone:'violet', phone:'1520', phoneLabel:'1520', site:'https://gov.uz/' },
  { key:'ypx', title:'YPX', short:'YPX', desc:'Yo‘l harakati, YTH va haydovchi huquqlariga oid masalalar.', icon:CarFront, tone:'amber', phone:'102', phoneLabel:'102', telegram:'https://t.me/iivuz_tv', telegramLabel:'@iivuz_tv', site:'https://gov.uz/oz/iiv' },
]
const tones={gold:'from-amber-300/20 via-yellow-300/5 to-transparent text-amber-200',red:'from-red-400/20 via-rose-300/5 to-transparent text-rose-200',blue:'from-sky-400/20 via-cyan-300/5 to-transparent text-sky-200',violet:'from-violet-400/20 via-indigo-300/5 to-transparent text-violet-200',amber:'from-orange-400/20 via-amber-300/5 to-transparent text-orange-200'}

export default function LegalInstitutions(){
  const [selected,setSelected]=useState(null)
  return <section id="institutions" className="relative overflow-hidden py-24">
    <div className="legal-orbit absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/[0.06]" />
    <div className="legal-orbit legal-orbit-delay absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/[0.05]" />
    <div className="relative mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-3xl text-center"><span className="section-kicker"><Building2 className="h-3.5 w-3.5"/> HUQUQIY YO‘NALISH</span><h2 className="premium-title">Muammoingiz qaysi tashkilotga tegishli ekanini <span className="text-gradient">Madadkor yo‘lga soladi.</span></h2><p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">Tashkilotni tanlang — call-markaz, rasmiy Telegram yoki rasmiy sayt orqali murojaat qilish yo‘lini ochamiz.</p></div>
      <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {INSTITUTIONS.map((item,i)=>{const Icon=item.icon; return <motion.article key={item.key} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5,delay:i*.07}} className="institution-card group relative min-h-[255px] overflow-hidden rounded-[28px] border border-white/10 bg-[#07101b]/80 p-5 backdrop-blur-xl">
          <div className={`institution-building institution-building-${item.key}`} aria-hidden="true"><span className="building-roof"/><span className="building-columns"/></div>
          <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[item.tone]} ring-1 ring-white/10`}><Icon className="h-5 w-5"/></div>
          <div className="relative z-10 mt-5"><p className="text-[10px] font-black tracking-[0.2em] text-slate-500">{item.short}</p><h3 className="mt-1 text-base font-bold text-white">{item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{item.desc}</p></div>
          <button onClick={()=>setSelected(item)} className="relative z-10 mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 transition group-hover:text-white">Murojaat qilish <ArrowUpRight className="h-3.5 w-3.5"/></button>
        </motion.article>})}
      </div>
    </div>
    {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={()=>setSelected(null)}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#07101b] p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Rasmiy murojaat</p><h3 className="mt-1 text-2xl font-black text-white">{selected.title}</h3></div><button onClick={()=>setSelected(null)} className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"><X className="h-5 w-5"/></button></div>
        <p className="mt-4 text-sm leading-6 text-slate-400">Quyidagi rasmiy kanallardan birini tanlang. Madadkor AI qaysi yo‘l sizning muammoingizga mosligini ham tushuntirib beradi.</p>
        <div className="mt-6 space-y-3">
          <a href={`tel:${selected.phone}`} className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 hover:bg-emerald-400/15"><Phone className="h-5 w-5 text-emerald-300"/><span><b className="block text-white">Call-markaz / ishonch telefoni</b><span className="text-xs text-slate-400">{selected.phoneLabel}</span></span></a>
          {selected.phone2 && <a href={`tel:${selected.phone2}`} className="flex items-center gap-3 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 hover:bg-sky-400/15"><Phone className="h-5 w-5 text-sky-300"/><span><b className="block text-white">Qo‘shimcha raqam</b><span className="text-xs text-slate-400">{selected.phone2Label}</span></span></a>}
          {selected.telegram && <a target="_blank" rel="noreferrer" href={selected.telegram} className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 hover:bg-cyan-400/15"><Send className="h-5 w-5 text-cyan-300"/><span><b className="block text-white">Rasmiy Telegram</b><span className="text-xs text-slate-400">{selected.telegramLabel}</span></span></a>}
          <a target="_blank" rel="noreferrer" href={selected.site} className="flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 hover:bg-violet-400/15"><Globe className="h-5 w-5 text-violet-300"/><span><b className="block text-white">Rasmiy sayt / elektron murojaat</b><span className="text-xs text-slate-400">Rasmiy sahifani ochish</span></span></a>
        </div>
      </div>
    </div>}
  </section>
}
