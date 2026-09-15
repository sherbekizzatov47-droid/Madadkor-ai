import { Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-emerald-glow" />
          <span className="font-display text-sm font-bold text-white">Madadkor AI</span>
        </div>
        <p className="text-xs text-slate-500">{t('footer.tagline')}</p>
        <p className="text-[11px] text-slate-600">
          &copy; {year} Madadkor AI. {t('footer.rights')}
        </p>
        <p className="text-[11px] text-slate-700">{t('footer.madeWith')}</p>
      </div>
    </footer>
  )
}
