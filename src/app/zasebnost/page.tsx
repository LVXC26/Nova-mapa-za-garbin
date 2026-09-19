import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Politika zasebnosti in piškotkov | Garbin',
  description: 'Kako Garbin zbira, uporablja in varuje vaše osebne podatke, ter katere piškotke uporabljamo.',
}

function Razdelek({ naslov, id, children }: { naslov: string; id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-10 scroll-mt-24">
      <h2 className="font-display text-xl font-bold text-[#0c2340] mb-3">{naslov}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

export default function ZasebnostPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="bg-[#0c2340] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Politika zasebnosti in piškotkov</h1>
            <p className="text-white/70 text-lg">Velja od 19. 9. 2026. Zadnja sprememba: 19. 9. 2026.</p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <Razdelek naslov="1. Upravljavec osebnih podatkov">
              <p>
                Upravljavec osebnih podatkov je <strong>Garbin d.o.o.</strong>, Obala 14, 6320 Portorož, Slovenija
                (matična in davčna številka: <em>[vpiše se pred objavo]</em>).
              </p>
              <p>
                Za vsa vprašanja glede zasebnosti in obdelave osebnih podatkov nas lahko kontaktirate na{' '}
                <a href="mailto:matej@lumavx.com" className="text-[#c9a84c] hover:underline">matej@lumavx.com</a>.
              </p>
            </Razdelek>

            <Razdelek naslov="2. Katere podatke zbiramo">
              <p>Odvisno od tega, kako uporabljate Garbin, lahko obdelujemo naslednje podatke:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Podatki ob registraciji:</strong> ime, e-poštni naslov, geslo (shranjeno šifrirano), vloga (kupec, charter, skipper).</li>
                <li><strong>Podatki profila:</strong> naziv agencije, opis, fotografije, kontaktni podatki, ki jih sami dodate.</li>
                <li><strong>Podatki o oglasih:</strong> informacije o plovilih, cene, lokacije, fotografije, ki jih objavite.</li>
                <li><strong>Komunikacija:</strong> sporočila v internem klepetu med uporabniki in vsebina obrazcev za povpraševanje (ime, e-pošta, telefon, sporočilo).</li>
                <li><strong>Plačilni podatki:</strong> pri nakupu promocijskih paketov plačilo obdela Stripe — Garbin ne vidi in ne shranjuje številke vaše kartice.</li>
                <li><strong>Tehnični podatki:</strong> IP naslov, tip naprave/brskalnika, obiskane strani — zbrano prek Google Analytics, samo če ste to dovolili.</li>
              </ul>
            </Razdelek>

            <Razdelek naslov="3. Namen obdelave in pravna podlaga">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Izvajanje pogodbe</strong> — omogočanje registracije, objave oglasov, komunikacije med uporabniki in obdelave plačil za promocijske pakete.</li>
                <li><strong>Zakoniti interes</strong> — preprečevanje zlorab, varnost platforme, izboljšave delovanja strani.</li>
                <li><strong>Privolitev</strong> — analitični piškotki (Google Analytics) in marketinški piškotki (Meta Pixel) se uporabljajo izključno, če to izrecno dovolite v pasici za piškotke.</li>
              </ul>
            </Razdelek>

            <Razdelek naslov="4. Piškotki (cookies)" id="piskotki">
              <p>Ob prvem obisku vas vprašamo za soglasje. Uporabljamo tri kategorije piškotkov:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Nujni piškotki</strong> — potrebni za osnovno delovanje strani (npr. prijava, shranjena izbira glede piškotkov). Teh ni mogoče izklopiti.</li>
                <li><strong>Analitični piškotki (Google Analytics)</strong> — pomagajo nam razumeti, kako obiskovalci uporabljajo stran, da jo lahko izboljšujemo. Naložijo se šele, ko to dovolite.</li>
                <li><strong>Marketinški piškotki (Meta Pixel)</strong> — uporabljajo se za merjenje učinkovitosti oglasov. Naložijo se šele, ko to dovolite.</li>
              </ul>
              <p>
                Svojo izbiro lahko kadarkoli spremenite tako, da v brskalniku počistite piškotke te strani, s čimer se
                pasica za piškotke ponovno prikaže.
              </p>
            </Razdelek>

            <Razdelek naslov="5. Zunanji ponudniki storitev">
              <p>Za delovanje platforme uporabljamo naslednje zaupanja vredne zunanje ponudnike, ki v našem imenu obdelujejo podatke:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Supabase</strong> — baza podatkov, avtentikacija in shramba slik.</li>
                <li><strong>Vercel</strong> — gostovanje spletne strani.</li>
                <li><strong>Resend</strong> — pošiljanje e-poštnih obvestil (npr. ob prejemu povpraševanja).</li>
                <li><strong>Stripe</strong> — obdelava plačil za promocijske pakete.</li>
                <li><strong>Google Analytics</strong> — analitika obiska (samo ob privolitvi).</li>
                <li><strong>Meta (Facebook) Pixel</strong> — merjenje oglasov (samo ob privolitvi).</li>
                <li><strong>Tawk.to</strong> — klepet za podporo strankam v živo.</li>
              </ul>
              <p>
                Nekateri od teh ponudnikov imajo sedež izven Evropske unije (npr. ZDA). V teh primerih se prenos podatkov
                izvaja na podlagi standardnih pogodbenih klavzul (SCC) ali drugih ustreznih zaščitnih mehanizmov v skladu z GDPR.
              </p>
            </Razdelek>

            <Razdelek naslov="6. Hramba podatkov">
              <p>
                Osebne podatke hranimo le toliko časa, kolikor je potrebno za namen, za katerega so bili zbrani, oziroma
                dokler imate aktiven uporabniški račun. Ob izbrisu računa (v nastavitvah profila) izbrišemo vaše osebne
                podatke v roku 30 dni, razen podatkov, ki jih moramo hraniti dlje zaradi zakonskih obveznosti (npr. računovodski dokumenti).
              </p>
            </Razdelek>

            <Razdelek naslov="7. Vaše pravice" id="vase-pravice">
              <p>V skladu s Splošno uredbo o varstvu podatkov (GDPR) imate pravico do:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>dostopa do svojih osebnih podatkov,</li>
                <li>popravka netočnih podatkov,</li>
                <li>izbrisa podatkov ("pravica do pozabe"),</li>
                <li>prenosljivosti podatkov,</li>
                <li>ugovora obdelavi in preklica privolitve kadarkoli,</li>
                <li>vložitve pritožbe pri Informacijskem pooblaščencu RS (www.ip-rs.si), če menite, da obdelava krši vaše pravice.</li>
              </ul>
              <p>
                Za uveljavljanje katerekoli od teh pravic nam pišite na{' '}
                <a href="mailto:matej@lumavx.com" className="text-[#c9a84c] hover:underline">matej@lumavx.com</a>.
              </p>
            </Razdelek>

            <Razdelek naslov="8. Varnost podatkov">
              <p>
                Vaše podatke ščitimo s tehničnimi in organizacijskimi ukrepi (šifrirana povezava HTTPS, nadzor dostopa na
                ravni baze podatkov, šifrirana gesla). Kljub temu noben sistem ni popolnoma varen — če opazite karkoli
                sumljivega, nas prosimo takoj obvestite.
              </p>
            </Razdelek>

            <Razdelek naslov="9. Spremembe te politike">
              <p>
                To politiko lahko občasno posodobimo. O pomembnejših spremembah vas bomo obvestili prek strani ali
                e-pošte. Datum zadnje spremembe je naveden na vrhu strani.
              </p>
            </Razdelek>

            <div className="bg-[#0c2340] rounded-2xl p-8 text-center">
              <p className="text-white/70 mb-4 text-sm">Imate vprašanje o zasebnosti ali piškotkih?</p>
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
