import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const active = i18n.resolvedLanguage || i18n.language || 'uz'
  const activeIndex = LANGS.findIndex((l) => l.code === active)

  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
      <div
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-emerald-glow/80 to-violet-glow/80 shadow-glow-emerald transition-all duration-300 ease-out"
        style={{
          width: `calc(${100 / LANGS.length}% - 4px)`,
          left: `calc(${(activeIndex >= 0 ? activeIndex : 0) * (100 / LANGS.length)}% + 2px)`,
        }}
      />
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`relative z-10 w-11 rounded-full py-1.5 text-xs font-semibold tracking-wide transition-colors duration-300 ${
            active === lang.code ? 'text-slate-950' : 'text-slate-300 hover:text-white'
          }`}
          aria-pressed={active === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
