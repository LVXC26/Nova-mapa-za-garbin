import Link from 'next/link'
import { Anchor, ArrowLeft, Search, Ship, Compass } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">

          {/* Animated anchor */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-[#0c2340]/5 animate-ping" />
            <div className="relative w-32 h-32 rounded-full bg-[#0c2340] flex items-center justify-center shadow-xl">
              <Anchor className="w-16 h-16 text-[#c9a84c] animate-float" />
            </div>
          </div>

          {/* 404 */}
          <div className="font-display text-8xl font-bold text-[#0c2340] mb-2 leading-none">404</div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2340] mb-4">
            Plovilo ni v tej marini
          </h1>
          <p className="text-gray-500 text-lg mb-2 max-w-md mx-auto leading-relaxed">
            Zdi se, da je ta stran zaplavala nekam drugam. Morda je bila premeščena ali pa nikoli ni obstajala.
          </p>
          <p className="text-gray-400 text-sm mb-10">
            Preverite URL ali se vrnite varno v pristanišče.
          </p>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-lg mx-auto">
            {[
              { href: '/plovila', label: 'Plovila', ikona: Ship },
              { href: '/charterji', label: 'Charter', ikona: Anchor },
              { href: '/skiperji', label: 'Skiperji', ikona: Compass },
            ].map(({ href, label, ikona: Ikona }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium text-[#0c2340]"
              >
                <Ikona className="w-4 h-4 text-[#c9a84c]" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" /> Domača stran
            </Link>
            <Link
              href="/plovila"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-105"
            >
              <Search className="w-4 h-4" /> Išči plovila
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
