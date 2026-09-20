// Telefonske fotografije so pogosto 5-25MB (visoka ločljivost + EXIF) — za
// spletni prikaz je to nepotrebno in samo upočasni stran ter poveča stroške
// shrambe/prenosa pri Supabase (glej pogovor o 500 uporabnikih). Pred
// nalaganjem zato v brskalniku sliko pomanjšamo na razumno največjo
// dimenzijo in jo ponovno stisnemo kot JPEG. Kvaliteta 30MB varnostna meja
// v obrazcih ostane nespremenjena — to je samo dodatna optimizacija tega,
// kar se dejansko naloži.
//
// `new Image()` + `drawImage` (namesto createImageBitmap) namenoma —
// sodobni brskalniki `<img>` elemente ob branju samodejno zavrtijo glede na
// EXIF orientacijo, canvas pa nato izriše že pravilno obrnjeno sliko;
// createImageBitmap je pri tem med brskalniki manj konsistenten.
const MAX_DIMENZIJA = 2000
const KVALITETA = 0.82
// Pod to velikostjo stiskanje ni smiselno — slika je (skoraj gotovo) že
// primerno majhna, ponovno kodiranje bi samo izgubilo kvaliteto brez koristi.
const PRAG_ZA_STISKANJE_B = 1.5 * 1024 * 1024

// HEIC/HEIF — privzeti format iPhonovih fotografij — noben brskalnik razen
// Safarija ne zna prikazati v <img>. Brez pretvorbe spodaj bi naložena slika
// ostala trajno "pokvarjena" sličica za skoraj vse obiskovalce (potrjen
// primer: .heic slika, naložena v objavo, se je prikazala kot pokvarjena).
// Prepoznamo po priponi imena, ne po MIME tipu — različni OS/brskalniki ga
// za HEIC pogosto sploh ne nastavijo pravilno (prazen niz namesto image/heic).
const HEIC_PRIPONA = /\.(heic|heif)$/i

// Za razliko od ostalih napak spodaj (kjer je varneje naložiti original, ker
// je original vsaj prikazljiv) HEIC pretvorba, ki spodleti, NE sme tiho
// naložiti izvirne .heic datoteke — ta bi ostala trajno neprikazljiva
// sličica (potrjeno: nekateri realni iPhone HEIC-i niso podprti s strani
// WASM dekoderja, čeprav worker zdaj pravilno teče). Klicna mesta to napako
// ujamejo in uporabniku pokažejo razumljivo sporočilo namesto neuspelega tihega nalaganja.
export class HeicPretvorbaNapaka extends Error {
  constructor(imeDatoteke: string) {
    super(`Slike "${imeDatoteke}" ni bilo mogoče pretvoriti iz HEIC/HEIF formata. Na iPhoneu: Nastavitve → Kamera → Formati → "Najbolj združljivo", ali sliko pred nalaganjem izvozite kot JPG.`)
    this.name = 'HeicPretvorbaNapaka'
  }
}

async function pretvoriHeicVJpeg(datoteka: File): Promise<File> {
  const { default: heic2any } = await import('heic2any')
  const rezultat = await heic2any({ blob: datoteka, toType: 'image/jpeg', quality: KVALITETA })
  const blob = Array.isArray(rezultat) ? rezultat[0] : rezultat
  const novoIme = datoteka.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], novoIme, { type: 'image/jpeg' })
}

export async function stisniSliko(datoteka: File): Promise<File> {
  let delovnaDatoteka = datoteka
  if (HEIC_PRIPONA.test(datoteka.name)) {
    try {
      delovnaDatoteka = await pretvoriHeicVJpeg(datoteka)
    } catch {
      throw new HeicPretvorbaNapaka(datoteka.name)
    }
  }

  // GIF preskočimo — canvas bi izrisal samo prvo sličico animacije.
  if (!delovnaDatoteka.type.startsWith('image/') || delovnaDatoteka.type === 'image/gif') return delovnaDatoteka
  if (delovnaDatoteka.size < PRAG_ZA_STISKANJE_B) return delovnaDatoteka

  let objectUrl: string | null = null
  try {
    objectUrl = URL.createObjectURL(delovnaDatoteka)
    const slika = new Image()
    await new Promise<void>((resolve, reject) => {
      slika.onload = () => resolve()
      slika.onerror = () => reject(new Error('Slike ni bilo mogoče prebrati'))
      slika.src = objectUrl as string
    })

    const { naturalWidth: sirina, naturalHeight: visina } = slika
    if (!sirina || !visina) return delovnaDatoteka

    const razmerje = Math.min(1, MAX_DIMENZIJA / Math.max(sirina, visina))
    const ciljnaSirina = Math.max(1, Math.round(sirina * razmerje))
    const ciljnaVisina = Math.max(1, Math.round(visina * razmerje))

    const platno = document.createElement('canvas')
    platno.width = ciljnaSirina
    platno.height = ciljnaVisina
    const ctx = platno.getContext('2d')
    if (!ctx) return delovnaDatoteka
    ctx.drawImage(slika, 0, 0, ciljnaSirina, ciljnaVisina)

    const blob: Blob | null = await new Promise((resolve) => platno.toBlob(resolve, 'image/jpeg', KVALITETA))
    // Stiskanje ni pomagalo (redko, npr. že zelo stisnjena slika) — obdržimo original.
    if (!blob || blob.size >= delovnaDatoteka.size) return delovnaDatoteka

    const novoIme = delovnaDatoteka.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], novoIme, { type: 'image/jpeg' })
  } catch {
    // Karkoli gre narobe (nepodprt format, napaka pri branju ...) — raje
    // naložimo original kot da uporabniku blokiramo celoten obrazec.
    return delovnaDatoteka
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
}
