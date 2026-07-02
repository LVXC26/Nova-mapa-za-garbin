export type TipPlovila = 'jadrnica' | 'motorni' | 'gumenjak' | 'katamaran' | 'jet' | 'drugo'
export type StanjePlovila = 'odlično' | 'dobro' | 'potrebuje popravilo'
export type KategorijaOpreme = 'navigacija' | 'varnost' | 'udobje' | 'motor'
export type TipOglasa = 'prodaja' | 'najem'

export interface Plovilo {
  id: string
  naziv: string
  opis: string | null
  cena: number
  letnik: number | null
  dolzina_m: number | null
  tip: TipPlovila
  tip_oglasa: TipOglasa
  stanje: StanjePlovila | null
  lokacija: string | null
  kontakt_email: string | null
  kontakt_tel: string | null
  slike: string[] | null
  model_3d_url: string | null
  oprema: Record<string, boolean> | null
  potrjeno: boolean
  promoted?: boolean
  prodano?: boolean
  cena_na_zahtevo?: boolean
  urgentno?: boolean
  user_id: string | null
  created_at: string
  updated_at?: string
}

export interface Novica {
  id: string
  naslov: string
  vsebina: string
  povzetek: string | null
  slika_url: string | null
  slug: string
  avtor: string | null
  kategorija_id: string | null
  published_at: string | null
  created_at: string
  kategorija?: NovicaKategorija
  tagi?: NovicaTag[]
}

export interface NovicaKategorija {
  id: string
  naziv: string
  slug: string
  barva: string | null
}

export interface NovicaTag {
  id: string
  naziv: string
  slug: string
}

export interface Komentar {
  id: string
  novica_id: string
  ime: string
  email: string
  vsebina: string
  potrjen: boolean
  created_at: string
}

export interface OpremaOpcija {
  id: string
  kategorija: KategorijaOpreme
  naziv: string
  ikona: string | null
}

export interface Profil {
  id: string
  vloga: 'prodajalec' | 'charter' | 'oba'
  ime: string | null
  opis: string | null
  telefon: string | null
  spletna_stran: string | null
  verified: boolean
  is_admin: boolean
  created_at: string
}

export type PlanNarocnine = 'free' | 'trial' | 'basic' | 'pro'

export interface CharterNarocnina {
  id: string
  charter_id: string
  plan: PlanNarocnine
  trial_zacetek: string | null
  trial_konec: string | null
  brezplacni_meseci: number
  podelil_admin_id: string | null
  opomba: string | null
  created_at: string
  updated_at: string
}

export type TipCharterja = 'podjetje' | 'zasebnik'

export type TipCharterPlovila = 'jahta' | 'jadrnica' | 'motorni' | 'gumenjak'

export interface Charter {
  id: string
  naziv: string
  opis: string
  tip: TipCharterja
  lokacija: string
  kontakt_email: string
  kontakt_tel: string
  spletna_stran: string | null
  ocena: number
  st_plovil: number
  max_oseb: number
  max_dolzina_m: number
  tip_plovila: TipCharterPlovila[]
  verified: boolean
  created_at: string
}

export interface Povprasevanje {
  id: string
  tip: 'charter' | 'skipper' | 'plovilo'
  target_id: string
  ime: string
  email: string
  telefon: string | null
  termin: string | null
  sporocilo: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      plovila: { Row: Plovilo; Insert: Omit<Plovilo, 'id' | 'created_at'>; Update: Partial<Plovilo>; Relationships: [] }
      profiles: { Row: Profil; Insert: Omit<Profil, 'created_at'>; Update: Partial<Profil>; Relationships: [] }
      charter_narocnine: { Row: CharterNarocnina; Insert: Omit<CharterNarocnina, 'id' | 'created_at' | 'updated_at'>; Update: Partial<CharterNarocnina>; Relationships: [] }
      novice: { Row: Novica; Insert: Omit<Novica, 'id' | 'created_at'>; Update: Partial<Novica>; Relationships: [] }
      novice_kategorije: { Row: NovicaKategorija; Insert: Omit<NovicaKategorija, 'id'>; Update: Partial<NovicaKategorija>; Relationships: [] }
      novice_tagi: { Row: NovicaTag; Insert: Omit<NovicaTag, 'id'>; Update: Partial<NovicaTag>; Relationships: [] }
      komentarji: { Row: Komentar; Insert: Omit<Komentar, 'id' | 'created_at'>; Update: Partial<Komentar>; Relationships: [] }
      oprema_moznosti: { Row: OpremaOpcija; Insert: Omit<OpremaOpcija, 'id'>; Update: Partial<OpremaOpcija>; Relationships: [] }
      povprasevanja: { Row: Povprasevanje; Insert: Omit<Povprasevanje, 'id' | 'created_at'>; Update: Partial<Povprasevanje>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
