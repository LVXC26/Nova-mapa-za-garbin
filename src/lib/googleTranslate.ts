// Google Translate Website Widget bere/piše svoj prevod prek piškotka
// "googtrans" v obliki "/<izvorni>/<ciljni>" (npr. "/sl/en"). Nastavitev
// piškotka + osvežitev strani je uradno dokumentiran način za proženje
// prevoda brez uporabe skritega privzetega Google spustnega menija.
const IZVORNI_JEZIK = 'sl'

export function nastaviJezik(ciljniJezik: string | null) {
  if (typeof document === 'undefined') return
  if (!ciljniJezik || ciljniJezik === IZVORNI_JEZIK) {
    // Izbris piškotka — Google Translate se odjavi in stran prikaže original.
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  } else {
    const vrednost = `/${IZVORNI_JEZIK}/${ciljniJezik}`
    document.cookie = `googtrans=${vrednost}; path=/`
    document.cookie = `googtrans=${vrednost}; path=/; domain=${window.location.hostname}`
  }
  window.location.reload()
}

export function trenutniJezik(): string {
  if (typeof document === 'undefined') return IZVORNI_JEZIK
  const ujemanje = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/)
  return ujemanje?.[1] ?? IZVORNI_JEZIK
}
