import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Disclaimer() {
  const { t } = useTranslation()

  return (
    <section id="disclaimer" className="relative py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="glass-card flex flex-col gap-4 border-amber-glow/20 bg-amber-glow/[0.04] p-6 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-glow/15 ring-1 ring-amber-glow/30">
            <AlertTriangle className="h-5 w-5 text-amber-glow" strokeWidth={2.2} />
          </div>
          <div>
            <h5 className="font-display text-sm font-bold text-white sm:text-base">{t('disclaimer.title')}</h5>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{t('disclaimer.text')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
