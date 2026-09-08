// Zunanja (ne-inline) datoteka namesto inline <script> vsebine, da lahko CSP
// script-src ostane brez 'unsafe-inline' — ID prebere iz "src" query stringa
// lastnega <script> taga (glej AnalyticsScripts.tsx), ne iz okoljske
// spremenljivke (ta v brskalniku ni na voljo v navadni .js datoteki).
(function () {
  var scriptEl = document.currentScript
  var gaId = scriptEl && new URL(scriptEl.src).searchParams.get('id')
  if (!gaId) return

  var gtagScript = document.createElement('script')
  gtagScript.async = true
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId)
  document.head.appendChild(gtagScript)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', gaId, { anonymize_ip: true })
})()
