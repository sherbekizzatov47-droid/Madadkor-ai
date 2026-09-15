import { motion } from 'framer-motion'
import { ArrowUpRight, FilePenLine, FileText, Gavel, MessageSquareWarning, ScrollText, ShieldCheck, TextCursorInput } from 'lucide-react'

const DOCS = [
  ['Ariza','Muassasa yoki tashkilotga rasmiy murojaat','FileText'],
  ['Shikoyat','Huquq buzilishi bo‘yicha shikoyat loyihasi','MessageSquareWarning'],
  ['Talabnoma','Pul, majburiyat yoki hujjat talab qilish','ScrollText'],
  ['Tushuntirish xati','Vaziyatni rasmiy tarzda bayon qilish','TextCursorInput'],
  ['Sudga da’vo loyihasi','Sudga murojaat uchun boshlang‘ich loyiha','Gavel'],
  ['Apellyatsiya / shikoyat','Sud hujjati bo‘yicha e’tiroz loyihasi','ShieldCheck'],
  ['Ish beruvchiga talabnoma','Mehnat masalalarida yozma talab','FilePenLine'],
]

const ICONS={FileText,MessageSquareWarning,ScrollText,TextCursorInput,Gavel,ShieldCheck,FilePenLine}

export default function DocumentLibrary(){
  const open=(type)=>window.dispatchEvent(new CustomEvent('madadkor:document-type',{detail:{type}}))
  return <section id="documents" className="relative py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="max-w-3xl"><div className="section-kicker"><FileText className="h-3.5 w-3.5"/> HUJJATLAR STUDIYASI</div><h2 className="premium-title">Kerakli hujjatni <span className="text-gradient">bir nechta qadamda</span> tayyorlang.</h2><p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">Madadkor CASE'dagi ma’lumotlardan foydalanib hujjat loyihasini tayyorlaydi. Foydalanuvchi yakuniy matnni ko‘rib chiqadi va o‘zi yuboradi.</p></div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DOCS.map(([name,desc,icon],i)=>{const Icon=ICONS[icon];return <motion.button key={name} onClick={()=>open(name)} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.03}} className="premium-card group min-h-[170px] p-5 text-left"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 text-emerald-300"><Icon className="h-5 w-5"/></div><ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-emerald-300"/></div><h3 className="mt-6 text-sm font-bold text-white">{name}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p></motion.button>})}
      </div>
    </div>
  </section>
}
