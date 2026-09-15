import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Building2, CarFront, CheckCircle2, FileText, Gavel,
  Mic, Paperclip, MessageCircleQuestion, Search, ScanText, BookOpenCheck, Bell,
  Scale, Shield, ShieldCheck, Sparkles, Brain, FileStack, Users, Infinity as InfinityIcon, Clock3
} from 'lucide-react'

const ORG_STRIP = [
  { label: 'PROKURATURASI', tone: 'prokuratura', icon: Scale },
  { label: 'ICHKI ISHLAR VAZIRLIGI', tone: 'iiv', icon: Shield },
  { label: 'SUDI', tone: 'sud', icon: Gavel, big: true },
  { label: 'DAVLAT XAVFSIZLIK XIZMATI', tone: 'dxx', icon: ShieldCheck },
  { label: "YO‘L PATRUL XIZMATI", tone: 'ypx', icon: CarFront },
]

const QUICK_NAV = [
  { title: 'PROKURATURA', desc: 'Qonuniylik va murojaatlar yo‘nalishi', tone: 'purple', icon: Scale },
  { title: 'ICHKI ISHLAR', desc: 'Call-markaz: 102 / 1102', tone: 'blue', icon: Shield, call: '1102' },
  { title: 'SUD', desc: 'Sudga oid masalalar va huquqiy yo‘nalish', tone: 'gold', icon: Gavel },
  { title: 'DAVLAT XAVFSIZLIK XIZMATI', desc: 'Call-markaz: 1520', tone: 'slate', icon: ShieldCheck, call: '1520' },
  { title: 'YPX', desc: "Yo‘l harakati va YTH masalalari", tone: 'green', icon: CarFront },
]

const MINI_FEATURES = [
  { title: 'Savollarga javob', desc: 'Huquqiy savollaringizga aniq va sodda javob.', icon: MessageCircleQuestion },
  { title: 'Qonun izlash', desc: 'Kerakli qonun va moddani tez va oson toping.', icon: Search },
  { title: 'Hujjat tahlili', desc: 'Hujjatlaringizni AI yordamida tahlil qiling.', icon: ScanText },
  { title: 'Misollar va tushuntirish', desc: 'Real hayotiy misollar bilan tushuntirib beramiz.', icon: BookOpenCheck },
  { title: 'Yangiliklar', desc: 'Qonunchilikdagi so‘nggi o‘zgarishlar.', icon: Bell },
]

const STATS = [
  { value: '10 000+', label: 'Qonun va hujjatlar', icon: FileStack },
  { value: '5 000+', label: 'Javoblar bazasi', icon: MessageCircleQuestion },
  { value: '50 000+', label: 'Foydalanuvchilar', icon: Users },
  { value: '24/7', label: 'AI yordam xizmati', icon: Clock3 },
  { value: 'Doimiy', label: 'Yangilanib boradi', icon: InfinityIcon },
]

export default function Hero(){
  const start=(message)=>window.dispatchEvent(new CustomEvent('madadkor:chat-message',{detail:{message}}))
  const openInstitution=(item)=>{
    if(item.call){
      window.location.href=`tel:${item.call}`
      return
    }
    start(`${item.title} bo‘yicha huquqiy muammom bor. Qonuniy asos, kimga murojaat qilish va qanday yo‘l tutish kerakligini tushuntirib ber.`)
  }
  return <section id="about" className="hero-cinematic relative min-h-[calc(100vh-90px)] overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
    <video className="hero-cinematic-video" src="/madadkor-legal-cinematic.mp4" autoPlay muted loop playsInline preload="auto" poster="/madadkor-legal-cinematic-poster.jpg" aria-hidden="true" />
    <div className="hero-video-overlay" />
    <div className="pointer-events-none absolute inset-0 grid-overlay opacity-70" />
    <div className="pointer-events-none absolute inset-0 aurora" />
    <div className="pointer-events-none absolute inset-0 noise" />
    <div className="pointer-events-none absolute left-[4%] top-36 h-80 w-80 rounded-full bg-emerald-glow/10 blur-[120px]" />
    <div className="pointer-events-none absolute right-[4%] top-28 h-96 w-96 rounded-full bg-violet-glow/10 blur-[140px]" />

    <div className="relative z-10 mx-auto max-w-7xl px-6">

      {/* 1. Top institution photo-strip */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-10 grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:gap-3">
        {ORG_STRIP.map(({label,tone,icon:Icon,big})=>
          <div key={label} className={`org-strip-card org-tone-${tone} ${big?'sm:scale-[1.06] sm:shadow-[0_0_40px_rgba(251,191,36,.08)]':''}`}>
            <div className="org-strip-bg" aria-hidden="true" />
            <span className="org-strip-emblem"><Icon className="h-5 w-5"/></span>
            <p className="org-strip-label text-slate-400">O‘ZBEKISTON<br/>RESPUBLIKASI</p>
            <p className="org-strip-label mt-0.5">{label}</p>
          </div>
        )}
      </motion.div>

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="section-kicker"><Sparkles className="h-3.5 w-3.5"/> MADADKOR AI</motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.08}} className="mt-6 text-5xl font-black leading-[.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-[5.6rem]">
          Huquqiy bilim —<br/><span className="text-gradient">har kim uchun!</span>
        </motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.14}} className="mx-auto mt-6 max-w-2xl text-[15px] leading-7 text-slate-300 md:text-lg">O‘zbekiston qonunchiligini sodda va tushunarli tilda tushuntiradigan sizning AI yordamchingiz.</motion.p>

        {/* Floating side badges — hidden on small screens */}
        <div className="hero-side-badge left-[-2%] top-16 hidden xl:flex">
          <span className="hero-side-badge-icon bg-emerald-300/10 text-emerald-200"><FileText className="h-4 w-4"/></span>
          <div className="text-left"><p className="text-[11px] font-black text-white">QONUNLAR BAZASI</p><p className="text-[10px] text-slate-400">10 000+ hujjat · doimiy yangilanadi</p></div>
        </div>
        <div className="hero-side-badge right-[-2%] top-16 hidden xl:flex" style={{animationDelay:'1.2s'}}>
          <span className="hero-side-badge-icon bg-violet-300/10 text-violet-200"><Brain className="h-4 w-4"/></span>
          <div className="text-left"><p className="text-[11px] font-black text-white">AI TAHLIL</p><p className="text-[10px] text-slate-400">sun’iy intellekt tez va aniq javob</p></div>
        </div>

        <motion.div initial={{opacity:0,y:22,scale:.98}} animate={{opacity:1,y:0,scale:1}} transition={{delay:.2}} className="relative mx-auto mt-9 max-w-3xl">
          <div className="hero-ai-box">
            <div className="px-5 pt-5 pb-4">
              <input aria-label="Huquqiy savol" className="hero-ai-input w-full" placeholder="Huquqiy savolingizni yozing..." onKeyDown={(e)=>{if(e.key==='Enter'&&e.currentTarget.value.trim())start(e.currentTarget.value.trim())}}/>
            </div>
            <div className="flex items-center gap-2 border-t border-white/[0.06] px-5 py-3">
              <button aria-label="Ovozli xabar" className="hero-search-dot"><Mic className="h-4 w-4"/></button>
              <button aria-label="Fayl biriktirish" className="hero-search-dot"><Paperclip className="h-4 w-4"/></button>
              <button onClick={()=>{}} className="hero-misollar-btn">Misollar</button>
              <div className="flex-1"/>
              <button onClick={(e)=>{const box=e.currentTarget.closest('.hero-ai-box'); const input=box?.querySelector('input'); if(input?.value.trim())start(input.value.trim()); else start('Huquqiy muammomni aniqlab ber.')}} className="hero-ask-button"><Sparkles className="h-4 w-4"/> So'rash</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Colored quick-nav org row */}
      <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5}} className="mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {QUICK_NAV.map((item)=>{ const {title,desc,tone,icon:Icon}=item; return (
          <button key={title} onClick={()=>openInstitution(item)} className={`quicknav-card quicknav-${tone} text-left`}>
            <span className="quicknav-icon"><Icon className="h-4.5 w-4.5"/></span>
            <p className="mt-3 text-[13px] font-black tracking-tight text-white">{title}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-300/80">{desc}</p>
            <span className="quicknav-arrow mt-4"><ArrowUpRight className="h-3.5 w-3.5 text-white"/></span>
            {item.call && <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">Call-markazga qo‘ng‘iroq</span>}
          </button>
        )})}
      </motion.div>

      {/* 3. Mini feature strip */}
      <div className="mx-auto mt-4 grid max-w-6xl gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {MINI_FEATURES.map(({title,desc,icon:Icon})=>
          <div key={title} className="hero-mini-feature">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-200"><Icon className="h-4 w-4"/></span>
            <div><p className="text-[12px] font-bold text-white">{title}</p><p className="mt-0.5 text-[10.5px] leading-4 text-slate-500">{desc}</p></div>
          </div>
        )}
      </div>

      {/* 4. Stats strip */}
      <div className="mx-auto mt-4 grid max-w-6xl gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map(({value,label,icon:Icon})=>
          <div key={label} className="hero-stat-item">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/5 text-emerald-200"><Icon className="h-4 w-4"/></span>
            <div><p className="text-[13px] font-black text-white">{value}</p><p className="text-[10px] leading-4 text-slate-500">{label}</p></div>
          </div>
        )}
      </div>

      <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{delay:.05}} className="mx-auto mt-10 max-w-5xl">
        <div className="hero-flow-card">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><p className="micro-copy text-emerald-300">MADADKOR AI / LIVE CASE</p><p className="mt-1 text-lg font-extrabold text-white">Muammo → yo‘nalish → yechim</p></div><div className="status-pill"><span className="live-dot"/> Tizim faol</div></div>
          <div className="grid gap-2 p-3 md:grid-cols-4">
            {[
              ['01','Muammo','“Ishxonam ikki oydan beri oylik bermayapti.”'],
              ['02','Tahlil','Muhim faktlar ajratilmoqda.'],
              ['03','Yo‘nalish','Mehnat huquqi / murojaat yo‘li.'],
              ['04','Keyingi qadam','Tegishli tashkilot yoki call-center.'],
            ].map(([num,title,desc],i)=><div key={num} className={`hero-flow-step ${i===0?'active':''}`}><span className="workflow-num">{num}</span><div><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{desc}</p></div>{i<2&&<CheckCircle2 className="ml-auto h-4 w-4 text-emerald-300"/>}</div>)}
          </div>
          <div className="border-t border-white/10 px-5 py-3 text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">AI huquqiy maslahat o‘rnini bosmaydi · rasmiy manbani tekshirish tavsiya etiladi</div>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500"><Building2 className="h-3.5 w-3.5 text-emerald-300"/> Sud · Prokuratura · IIV · DXX · YPX <span className="text-emerald-300">—</span> barchasi bitta huquqiy makonda</div>
    </div>
  </section>
}
