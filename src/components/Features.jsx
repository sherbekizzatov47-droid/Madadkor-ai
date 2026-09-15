import { Users, Briefcase, HandCoins, Landmark, ShieldCheck, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const ICONS = [Users, Briefcase, HandCoins, Landmark, ShieldCheck, FileText]

export default function Features() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })

  return (
    <section id="capabilities" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">
            {t('features.eyebrow')}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {t('features.title')}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                className="glass-card group p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-glow/15 to-violet-glow/15 ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-glow-emerald">
                  <Icon className="h-5 w-5 text-emerald-glow" strokeWidth={2} />
                </div>
                <h4 className="mt-4 font-display text-base font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
