// Supabase Storage (S3-združljiv) zavrne "ključe" (poti datotek) z nekaterimi
// znaki — najden pravi primer: ime datoteke "...Bavaria SR38 © YachtShot
// T012.jpg" (vsebuje "©", tipično pri profesionalnih/agencijskih fotografijah)
// je povzročilo "Invalid key" napako in nalaganje slike je v celoti spodletelo.
// Ta funkcija iz IMENA datoteke (ne poti/mape, tisto gradimo ločeno) odstrani
// vse, kar ni ASCII črka/številka/pika/vezaj/podčrtaj, preden ga uporabimo
// kot del shranjevalne poti.
export function varnoImeDatoteke(ime: string): string {
  const zadnjaTocka = ime.lastIndexOf('.')
  const imaPripono = zadnjaTocka > 0 && zadnjaTocka < ime.length - 1
  const osnova = imaPripono ? ime.slice(0, zadnjaTocka) : ime
  const pripona = imaPripono ? ime.slice(zadnjaTocka) : ''

  const varnaOsnova = osnova
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // šumniki/diakritiki -> osnovna črka
    .replace(/[^a-zA-Z0-9._-]+/g, '-') // vse ostalo (npr. ©, presledki, emoji) -> vezaj
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')

  const varnaPripona = pripona
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9.]+/g, '')
    .toLowerCase()

  return (varnaOsnova || 'datoteka') + varnaPripona
}
