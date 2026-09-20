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
      {/* ZACASNO VIDNO za diagnostiko — glej pogovor, goog-te-combo ostaja
          prazen tudi brez vsakega skrivanja, torej vzrok ni vidnost. */}
      <div id="google_translate_element" style={{ position: 'fixed', top: 70, right: 10, zIndex: 9999, background: 'white', padding: 4 }} />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'sl',
              includedLanguages: 'en,hr,it',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
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
