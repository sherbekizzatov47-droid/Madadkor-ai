import { Scale, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="premium-nav mx-3 mt-3 flex max-w-7xl items-center justify-between rounded-[22px] px-4 py-3 md:mx-auto md:mt-5 md:px-5">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-glow/20 to-violet-glow/20 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(27,227,180,.10)]">
            <Scale className="h-4 w-4 text-emerald-glow" strokeWidth={2.2} />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-[15px] font-extrabold tracking-tight text-white">
              MADADKOR <span className="text-emerald-glow">AI</span>
            </span>
            <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Huquqiy bilim — har kim uchun
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-7 text-[13px] font-semibold text-slate-400 md:flex">
          <li><a href="#about" className="text-emerald-glow transition-colors hover:text-emerald-glow">Bosh sahifa</a></li>
          <li><a href="#rights" className="transition-colors hover:text-white">Huquqiy bilimlar</a></li>
          <li><a href="#documents" className="transition-colors hover:text-white">Qonunchilik</a></li>
          <li><a href="#chat-section" className="transition-colors hover:text-white">Savol-javob</a></li>
          <li>
            <a href="#sources" className="inline-flex items-center gap-1 transition-colors hover:text-white">
              Yangiliklar <span className="text-[10px] opacity-60">▾</span>
            </a>
          </li>
          <li><a href="#call-center" className="transition-colors hover:text-white">Aloqa</a></li>
        </ul>

        {/* Right side buttons */}
        <div className="flex items-center gap-2.5">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/10 hover:text-white">
            <Settings className="h-4 w-4" />
          </button>
          <a
            href="#chat-section"
            className="hidden rounded-xl border border-white/12 bg-transparent px-4 py-2 text-[13px] font-bold text-white transition-all hover:bg-white/5 sm:inline-block"
          >
            Kirish
          </a>
          <a
            href="#chat-section"
            onClick={() => window.dispatchEvent(new CustomEvent('madadkor:start-call'))}
            className="hidden rounded-xl bg-emerald-glow px-4 py-2 text-[13px] font-bold text-base-950 shadow-[0_14px_40px_rgba(27,227,180,.18)] transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            Ro'xatdan o'tish
          </a>
        </div>
      </nav>
    </header>
  )
}
