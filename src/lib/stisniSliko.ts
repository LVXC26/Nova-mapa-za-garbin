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

export async function stisniSliko(datoteka: File): Promise<File> {
  // GIF preskočimo — canvas bi izrisal samo prvo sličico animacije.
  if (!datoteka.type.startsWith('image/') || datoteka.type === 'image/gif') return datoteka
  if (datoteka.size < PRAG_ZA_STISKANJE_B) return datoteka

  let objectUrl: string | null = null
  try {
    objectUrl = URL.createObjectURL(datoteka)
    const slika = new Image()
    await new Promise<void>((resolve, reject) => {
      slika.onload = () => resolve()
      slika.onerror = () => reject(new Error('Slike ni bilo mogoče prebrati'))
      slika.src = objectUrl as string
    })

    const { naturalWidth: sirina, naturalHeight: visina } = slika
    if (!sirina || !visina) return datoteka

    const razmerje = Math.min(1, MAX_DIMENZIJA / Math.max(sirina, visina))
    const ciljnaSirina = Math.max(1, Math.round(sirina * razmerje))
    const ciljnaVisina = Math.max(1, Math.round(visina * razmerje))

    const platno = document.createElement('canvas')
    platno.width = ciljnaSirina
    platno.height = ciljnaVisina
    const ctx = platno.getContext('2d')
    if (!ctx) return datoteka
    ctx.drawImage(slika, 0, 0, ciljnaSirina, ciljnaVisina)

    const blob: Blob | null = await new Promise((resolve) => platno.toBlob(resolve, 'image/jpeg', KVALITETA))
    // Stiskanje ni pomagalo (redko, npr. že zelo stisnjena slika) — obdržimo original.
    if (!blob || blob.size >= datoteka.size) return datoteka

    const novoIme = datoteka.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], novoIme, { type: 'image/jpeg' })
  } catch {
    // Karkoli gre narobe (nepodprt format, napaka pri branju ...) — raje
    // naložimo original kot da uporabniku blokiramo celoten obrazec.
    return datoteka
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
}

export async function stisniSlike(datoteke: File[]): Promise<File[]> {
  return Promise.all(datoteke.map(stisniSliko))
}
