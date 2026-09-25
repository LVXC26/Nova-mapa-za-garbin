import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Pogoji uporabe | Garbin',
  description: 'Pogoji uporabe platforme Garbin — pravice in obveznosti uporabnikov spletnega mesta garbin.net.',
}

function Razdelek({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl font-bold text-[#0c2340] mb-3">{naslov}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

export default function PogojiUporabePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="bg-[#0c2340] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Pogoji uporabe</h1>
            <p className="text-white/70 text-lg">Velja od 19. 9. 2026. Zadnja sprememba: 19. 9. 2026.</p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <Razdelek naslov="1. Splošno">
              <p>
                Ti pogoji uporabe urejajo uporabo spletne strani garbin.net ("Garbin", "platforma"), ki jo upravlja
                LUMAVX s.p., Cesta sv. Vida 10, 1225 Lukovica. Z registracijo ali uporabo platforme sprejemate te pogoje.
                Če se z njimi ne strinjate, platforme ne uporabljajte.
              </p>
            </Razdelek>

            <Razdelek naslov="2. Kaj je Garbin">
              <p>
                Garbin je spletna platforma, ki povezuje ponudnike (prodajalce, charter podjetja, skiperje) z
                iskalci plovil, storitev najema in skipperskih storitev. <strong>Garbin ni stranka pri dejanski
                prodaji, najemu ali rezervaciji</strong> — te se dogovorijo neposredno med uporabnikoma. Garbin ne
                jamči za točnost, kakovost, varnost ali zakonitost objavljenih oglasov niti za sposobnost
                uporabnikov, da sklenjeni dogovor izpolnijo.
              </p>
            </Razdelek>

            <Razdelek naslov="3. Registracija in uporabniški računi">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Za objavo oglasov, pošiljanje sporočil in nekatere druge funkcije je potrebna registracija.</li>
                <li>Ob registraciji morate navesti resnične in točne podatke.</li>
                <li>Odgovorni ste za varovanje gesla svojega računa in za vso aktivnost, ki se zgodi pod njim.</li>
                <li>Račun lahko kadarkoli izbrišete v nastavitvah profila.</li>
              </ul>
            </Razdelek>

            <Razdelek naslov="4. Obveznosti uporabnikov">
              <p>Pri uporabi platforme se zavezujete, da ne boste:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>objavljali zavajajočih, netočnih ali lažnih informacij o plovilih ali storitvah,</li>
                <li>objavljali vsebine, ki krši pravice tretjih oseb (avtorske pravice, blagovne znamke ipd.),</li>
                <li>uporabljali platforme za nezakonite namene ali goljufije,</li>
                <li>poskušali motiti delovanje platforme (npr. z avtomatiziranim zajemanjem podatkov, vdori ipd.),</li>
                <li>izdajali se za drugo osebo ali podjetje.</li>
              </ul>
              <p>Garbin si pridržuje pravico do odstranitve vsebine ali začasne oziroma trajne ukinitve računa, ki krši te pogoje.</p>
            </Razdelek>

            <Razdelek naslov="5. Plačila in promocijski paketi">
              <p>
                Osnovna objava oglasa je brezplačna. Za dodatne funkcije (npr. promoviran/urgenten oglas) so na voljo
                plačljivi paketi, katerih cene so navedene na strani <Link href="/paketi" className="text-[#c9a84c] hover:underline">Paketi &amp; cenik</Link>.
                Plačila obdela zunanji ponudnik Stripe; Garbin ne shranjuje podatkov vaše plačilne kartice. Plačane
                promocije se praviloma ne vračajo, razen v primeru tehnične napake na naši strani.
              </p>
              <p>
                Garbin lahko v določenih primerih deluje kot posrednik med stranko in charter podjetjem/skiperjem. V
                takih primerih se Garbin s ponudnikom (charterjem/skiperjem) dogovori za nadomestilo (provizijo) za
                posredovanje stranke. Višina nadomestila se določi individualno in ni javno objavljena.
              </p>
            </Razdelek>

            <Razdelek naslov="6. Intelektualna lastnina">
              <p>
                Znamka Garbin, logotip in oblikovanje spletne strani so last LUMAVX s.p. Vsebino, ki jo objavite
                (fotografije, opise), obdržite v lasti, a Garbinu podeljujete pravico do njene prikazave na platformi
                za namen delovanja storitve.
              </p>
            </Razdelek>

            <Razdelek naslov="7. Omejitev odgovornosti">
              <p>
                Platforma se uporablja "kot je" ("as is"). Garbin ne odgovarja za škodo, ki bi nastala zaradi:
                netočnih navedb v oglasih drugih uporabnikov, nezmožnosti dostopa do platforme, dogovorov sklenjenih
                med uporabniki izven platforme, ali dejanj tretjih ponudnikov storitev (Stripe, Supabase, Vercel
                ipd.). Uporabnikom priporočamo, da pred sklenitvijo posla plovilo osebno preverijo.
              </p>
            </Razdelek>

            <Razdelek naslov="8. Spremembe pogojev">
              <p>
                Te pogoje lahko občasno posodobimo. O pomembnejših spremembah vas obvestimo prek strani ali e-pošte.
                Nadaljnja uporaba platforme po objavi sprememb pomeni njihovo sprejetje.
              </p>
            </Razdelek>

            <Razdelek naslov="9. Veljavno pravo">
              <p>
                Za te pogoje in vsa razmerja, ki iz njih izhajajo, velja pravo Republike Slovenije. Za reševanje
                morebitnih sporov je pristojno sodišče v Republiki Sloveniji.
              </p>
            </Razdelek>

            <div className="bg-[#0c2340] rounded-2xl p-8 text-center">
              <p className="text-white/70 mb-4 text-sm">Vprašanja glede pogojev uporabe?</p>
              <Link
                href="/kontakt"
                className="inline-block px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-105 text-sm"
              >
                Kontaktirajte nas
              </Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
