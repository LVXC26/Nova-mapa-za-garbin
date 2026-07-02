'use client'

import { useState } from 'react'
import { Settings, Shield, Users, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import FeedObjave from '@/components/social/FeedObjave'

export default function DashboardFeedPage() {
  const { user, vloga } = useAuth()
  const ime = user?.user_metadata?.ime ?? 'Uporabnik'

  const [nastavitve, setNastavitve] = useState({
    dovoliTujeObjave: true,
    avtoOdobritev: false,
    obvestilaEmail: true,
  })
  const [shranjeno, setShranjeno] = useState(false)

  function shrani() {
    setShranjeno(true)
    setTimeout(() => setShranjeno(false), 2500)
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Moj feed</h1>
      <p className="text-gray-500 text-sm mb-8">Objave na vašem profilu in nastavitve moderacije</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Feed */}
        <div className="lg:col-span-2">
          <FeedObjave
            title="Objave na profilu"
            showAddPost
            showModeracija
            avtor={ime}
            vloga={vloga ?? ''}
          />
        </div>

        {/* Nastavitve */}
        <div className="space-y-5">
          {/* Nastavitve moderacije */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-[#0c2340] mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c9a84c]" /> Moderacija objav
            </h2>
            <p className="text-xs text-gray-500 mb-4">Kdo lahko objavlja na vašem profilu?</p>

            <div className="space-y-4">
              {/* Dovoli tuje objave */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#0c2340]">Dovoli tuje objave</p>
                  <p className="text-xs text-gray-400 mt-0.5">Stranke lahko pišejo na vaš profil</p>
                </div>
                <button
                  onClick={() => setNastavitve(n => ({ ...n, dovoliTujeObjave: !n.dovoliTujeObjave }))}
                  className="shrink-0"
                >
                  {nastavitve.dovoliTujeObjave
                    ? <ToggleRight className="w-8 h-8 text-[#c9a84c]" />
                    : <ToggleLeft className="w-8 h-8 text-gray-300" />
                  }
                </button>
              </div>

              {/* Avtomatska odobritev */}
              {nastavitve.dovoliTujeObjave && (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#0c2340]">Avtomatska odobritev</p>
                    <p className="text-xs text-gray-400 mt-0.5">Objave se objavijo takoj brez pregleda</p>
                  </div>
                  <button
                    onClick={() => setNastavitve(n => ({ ...n, avtoOdobritev: !n.avtoOdobritev }))}
                    className="shrink-0"
                  >
                    {nastavitve.avtoOdobritev
                      ? <ToggleRight className="w-8 h-8 text-[#c9a84c]" />
                      : <ToggleLeft className="w-8 h-8 text-gray-300" />
                    }
                  </button>
                </div>
              )}

              {/* Email obvestila */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#0c2340]">Email ob novi objavi</p>
                  <p className="text-xs text-gray-400 mt-0.5">Obvestilo ko nekdo objavi</p>
                </div>
                <button
                  onClick={() => setNastavitve(n => ({ ...n, obvestilaEmail: !n.obvestilaEmail }))}
                  className="shrink-0"
                >
                  {nastavitve.obvestilaEmail
                    ? <ToggleRight className="w-8 h-8 text-[#c9a84c]" />
                    : <ToggleLeft className="w-8 h-8 text-gray-300" />
                  }
                </button>
              </div>
            </div>

            {/* Status prikaz */}
            <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${
              nastavitve.dovoliTujeObjave
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-50 text-gray-500'
            }`}>
              {nastavitve.dovoliTujeObjave
                ? nastavitve.avtoOdobritev
                  ? '✅ Tuje objave: samodejno odobrene'
                  : '👁 Tuje objave: čakajo vašo odobritev'
                : '🔒 Profil zalit — tuje objave onemogočene'
              }
            </div>

            {shranjeno && (
              <p className="mt-3 text-xs text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Nastavitve shranjene
              </p>
            )}

            <button
              onClick={shrani}
              className="mt-4 w-full py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]"
            >
              Shrani nastavitve
            </button>
          </div>

          {/* Info */}
          <div className="bg-[#0c2340]/5 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-[#0c2340] mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Tuje objave
            </p>
            Ko je tuji objava, se prikaže v čakajočih objavah. Odobrite jo ali jo zavrnite preden postane javno vidna. Zavrnjene objave so izbrisane brez obvestila avtorju.
          </div>
        </div>
      </div>
    </div>
  )
}
