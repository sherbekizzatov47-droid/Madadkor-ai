import { Play, Pause, ScanLine, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'

export default function LegalCinematicVideo(){
  const ref=useRef(null); const [paused,setPaused]=useState(false)
  const toggle=()=>{if(!ref.current)return;if(ref.current.paused){ref.current.play();setPaused(false)}else{ref.current.pause();setPaused(true)}}
  return <section id="cinematic" className="relative py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-10 max-w-3xl"><span className="section-kicker"><Sparkles className="h-3.5 w-3.5"/> MADADKOR CINEMATIC</span><h2 className="premium-title">Huquqiy muhitni <span className="text-gradient">jonli his qiling.</span></h2><p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">Sud, prokuratura, ichki ishlar, DXX va YPX yo‘nalishlari bitta raqamli huquqiy makonda birlashadi.</p></div>
      <div className="legal-video-frame">
        <video ref={ref} className="h-full w-full object-cover" src="/madadkor-legal-cinematic.mp4" autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020611]/80 via-transparent to-[#020611]/20" />
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200 backdrop-blur-xl"><span className="live-dot"/> Legal motion / V19</div>
        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-xl"><div className="flex items-center gap-2 text-xs font-bold text-cyan-200"><ScanLine className="h-4 w-4"/> HUQUQIY TAHLIL TIZIMI</div><p className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">Huquqni bilish — o‘zingizni himoya qilishdir.</p></div><button onClick={toggle} className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xl hover:bg-white/15">{paused?<Play className="h-4 w-4"/>:<Pause className="h-4 w-4"/>}{paused?'Videoni davom ettirish':'Pauza'}</button></div>
      </div>
    </div>
  </section>
}
