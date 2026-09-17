'use client'

import Script from 'next/script'

// Tawk.to živi klepet za podporo strankam. Naloži se vedno (za razliko od
// GA4/Meta Pixel v AnalyticsScripts.tsx, ki čakata na GDPR soglasje) — gre
// za neposredno komunikacijsko orodje, ki ga obiskovalec sam sproži s
// klikom (kot kontaktni obrazec), ne za sledenje/oglaševanje med strankami.
// 'unsafe-inline' na script-src je že prej dovoljen (Next.js hidracija),
// zato lahko uradno Tawk.to kodo vstavimo inline, brez zunanje datoteke.
export default function TawkChat() {
  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function() {
          var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/6aaba23f40f8bd3449875a90/1k2n73hv6';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  )
}
