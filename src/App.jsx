import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Disclaimer from './components/Disclaimer.jsx'
import ChatSection from './components/ChatSection.jsx'
import Footer from './components/Footer.jsx'
import VapiCallButton from './components/VapiCallButton.jsx'
import MadadkorCenter from './components/MadadkorCenter.jsx'
import CallCenter from './components/CallCenter.jsx'
import LegalHub from './components/LegalHub.jsx'
import LegalSources from './components/LegalSources.jsx'
import LegalInstitutions from './components/LegalInstitutions.jsx'
import DocumentLibrary from './components/DocumentLibrary.jsx'
import DocumentAnalyzer from './components/DocumentAnalyzer.jsx'
import { useEffect, useState } from 'react'
import { ArrowUpRight, FileSearch } from 'lucide-react'

export default function App() {
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  useEffect(() => {
    const open = () => setShowAnalyzer(true)
    window.addEventListener('madadkor:analyze-document', open) 
    return () => window.removeEventListener('madadkor:analyze-document', open)
  }, [])
  return <div id="top" className="site-shell min-h-screen bg-base-950">
    <Navbar />
    <main>
      <Hero />
      <LegalHub />
      <LegalInstitutions />
      <Features />
      <MadadkorCenter />
      <DocumentLibrary />
      <section id="analyzer-entry" className="mx-auto max-w-7xl px-6 pb-12">
        <div className="premium-stage relative overflow-hidden rounded-[32px] p-6 md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="section-kicker"><FileSearch className="h-3.5 w-3.5" /> HUJJAT STUDIYASI</div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">Shartnoma yoki arizadagi muhim bandlarni bir qarashda toping.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Ish haqi, ish vaqti, ta’til, muddat, bekor qilish va javobgarlikka oid iboralarni ajratib, tekshirishga yordam beradi.</p>
            </div>
            <button onClick={() => setShowAnalyzer(true)} className="glow-button inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">Hujjatni tahlil qilish <ArrowUpRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
      <LegalSources />
      <CallCenter />
      <Disclaimer />
      <ChatSection />
    </main>
    <Footer />
    <VapiCallButton />
    {showAnalyzer && <DocumentAnalyzer onClose={() => setShowAnalyzer(false)} />}
  </div>
}
