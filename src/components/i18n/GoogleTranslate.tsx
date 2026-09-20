'use client'

import Script from 'next/script'

// Google Translate Website Widget — prevede CELOTNO izrisano vsebino strani
// (vključno z opisi plovil/novicami iz baze, ki jih ni mogoče ročno prevesti
// za vsak jezik posebej) v izbran jezik, v realnem času, brezplačno. Widget
// se naloži na vsaki strani, a je vizualno skrit (glej globals.css) — svoj
// jezikovni izbirnik že imamo v Navbar.tsx, ki upravlja isti mehanizem prek
// "googtrans" piškotka (glej lib/googleTranslate.ts).
declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: { translate?: { TranslateElement: new (options: object, elementId: string) => void } }
  }
}

export default function GoogleTranslate() {
  return (
    <>
      {/* NE display:none — Google Translate mora element dejansko "videti"
          (imeti izmerljive dimenzije v layoutu), sicer notranje ne napolni
          seznama jezikov (goog-te-combo ostane prazen, prevod se nikoli ne
          sproži). Zato je samo pomaknjen daleč izven zaslona. */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'sl',
              includedLanguages: 'en,hr,it',
              autoDisplay: false,
            }, 'google_translate_element');
          }
        `}
      </Script>
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  )
}
