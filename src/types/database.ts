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
  promoted_do?: string | null
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
  notifikacije?: Record<string, boolean> | null
  dovoli_tuje_objave?: boolean
  avto_odobritev_objav?: boolean
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
  user_id?: string | null
}

export type TipSkiper = 'samostojni' | 'agencija'

export interface Skipper {
  id: string
  ime: string
  lokacija: string
  izkusnje_let: number
  jeziki: string[]
  certifikati: string[]
  tip_plovila: string[]
  opis: string
  ocena: number
  st_ocen: number
  cena_dan: number
  verified: boolean
  tip_skiper: TipSkiper
  naziv_agencije?: string | null
  ekipa?: { ime: string; specializacija: string; ocena: number }[] | null
  created_at: string
  user_id?: string | null
}

export interface Povprasevanje {
  id: string
  tip: 'charter' | 'skipper' | 'plovilo' | 'kontakt' | 'prijava-charter' | 'prijava-skipper'
  target_id: string
  ime: string
  email: string
  telefon: string | null
  termin: string | null
  sporocilo: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Rating {
  id: string
  rater_id: string
  rated_id: string
  rated_type: 'charter' | 'skipper'
  score: number
  komentar: string | null
  created_at: string
}

export interface Priljubljen {
  id: string
  user_id: string
  plovilo_id: string
  created_at: string
}

export type StanjeDela = 'novo' | 'rabljeno'
export type KategorijaDela = 'motor' | 'elektronika' | 'jadra' | 'sidrna oprema' | 'trup' | 'drugo'

export interface RezervniDel {
  id: string
  naziv: string
  opis: string | null
  cena: number
  stanje: StanjeDela
  kategorija: KategorijaDela
  tip_plovila: string | null
  slika_url: string | null
  kontakt_email: string | null
  kontakt_tel: string | null
  lokacija: string | null
  potrjeno: boolean
  user_id: string | null
  created_at: string
}

export type TipPromocije = 'popust' | 'featured' | 'sezonska' | 'paket'

export interface Promocija {
  id: string
  naziv: string
  opis: string | null
  slika_url: string | null
  popust: number | null
  tip: TipPromocije
  veljavnost_do: string | null
  plovilo_id: string | null
  barva: string | null
  aktivna: boolean
  created_at: string
}

export interface Banner {
  id: string
  naziv: string
  slika_url: string | null
  link_url: string | null
  pozicija: string
  dimenzije: string | null
  aktiven: boolean
  created_at: string
}

export interface ZemljevidTocka {
  id: string
  naziv: string
  tip: 'marina' | 'otok' | 'restavracija' | 'nevarno'
  lat: number
  lng: number
  opis: string | null
  link: string | null
  created_at: string
}

export type TipObjave = 'objava' | 'potovanje'

export interface Objava {
  id: string
  lastnik_user_id: string
  avtor_user_id: string
  avtor_ime: string
  avtor_vloga: string | null
  tip: TipObjave
  vsebina: string
  lokacija: string | null
  plovilo: string | null
  odobrena: boolean
  created_at: string
}

export interface ObjavaLike {
  id: string
  objava_id: string
  user_id: string
  created_at: string
}

export interface ObjavaKomentar {
  id: string
  objava_id: string
  user_id: string
  ime: string
  vsebina: string
  created_at: string
}

export interface PromocijaNarocilo {
  id: string
  plovilo_id: string
  user_id: string
  stripe_session_id: string
  znesek_cent: number
  valuta: string
  dni_promocije: number
  status: 'pending' | 'placano' | 'preklicano'
  created_at: string
  placano_at: string | null
}

export interface Database {
  public: {
    Tables: {
      plovila: { Row: Pick<Plovilo, keyof Plovilo>; Insert: Omit<Plovilo, 'id' | 'created_at'>; Update: Partial<Plovilo>; Relationships: [] }
      profiles: { Row: Pick<Profil, keyof Profil>; Insert: Omit<Profil, 'created_at'>; Update: Partial<Profil>; Relationships: [] }
      charter_narocnine: { Row: Pick<CharterNarocnina, keyof CharterNarocnina>; Insert: Omit<CharterNarocnina, 'id' | 'created_at' | 'updated_at'>; Update: Partial<CharterNarocnina>; Relationships: [] }
      novice: { Row: Pick<Novica, keyof Novica>; Insert: Omit<Novica, 'id' | 'created_at'>; Update: Partial<Novica>; Relationships: [] }
      novice_kategorije: { Row: Pick<NovicaKategorija, keyof NovicaKategorija>; Insert: Omit<NovicaKategorija, 'id'>; Update: Partial<NovicaKategorija>; Relationships: [] }
      novice_tagi: { Row: Pick<NovicaTag, keyof NovicaTag>; Insert: Omit<NovicaTag, 'id'>; Update: Partial<NovicaTag>; Relationships: [] }
      komentarji: { Row: Pick<Komentar, keyof Komentar>; Insert: Omit<Komentar, 'id' | 'created_at'>; Update: Partial<Komentar>; Relationships: [] }
      oprema_moznosti: { Row: Pick<OpremaOpcija, keyof OpremaOpcija>; Insert: Omit<OpremaOpcija, 'id'>; Update: Partial<OpremaOpcija>; Relationships: [] }
      povprasevanja: { Row: Pick<Povprasevanje, keyof Povprasevanje>; Insert: Omit<Povprasevanje, 'id' | 'created_at'>; Update: Partial<Povprasevanje>; Relationships: [] }
      messages: { Row: Pick<Message, keyof Message>; Insert: Omit<Message, 'id' | 'created_at'>; Update: Partial<Message>; Relationships: [] }
      skiperji: { Row: Pick<Skipper, keyof Skipper>; Insert: Omit<Skipper, 'id' | 'created_at'>; Update: Partial<Skipper>; Relationships: [] }
      charterji: { Row: Pick<Charter, keyof Charter>; Insert: Omit<Charter, 'id' | 'created_at'>; Update: Partial<Charter>; Relationships: [] }
      ratings: { Row: Pick<Rating, keyof Rating>; Insert: Omit<Rating, 'id' | 'created_at'>; Update: Partial<Rating>; Relationships: [] }
      priljubljeni: { Row: Pick<Priljubljen, keyof Priljubljen>; Insert: Omit<Priljubljen, 'id' | 'created_at'>; Update: Partial<Priljubljen>; Relationships: [] }
      rezervni_deli: { Row: Pick<RezervniDel, keyof RezervniDel>; Insert: Omit<RezervniDel, 'id' | 'created_at'>; Update: Partial<RezervniDel>; Relationships: [] }
      promocije: { Row: Pick<Promocija, keyof Promocija>; Insert: Omit<Promocija, 'id' | 'created_at'>; Update: Partial<Promocija>; Relationships: [] }
      bannerji: { Row: Pick<Banner, keyof Banner>; Insert: Omit<Banner, 'id' | 'created_at'>; Update: Partial<Banner>; Relationships: [] }
      zemljevid_tocke: { Row: Pick<ZemljevidTocka, keyof ZemljevidTocka>; Insert: Omit<ZemljevidTocka, 'id' | 'created_at'>; Update: Partial<ZemljevidTocka>; Relationships: [] }
      objave: { Row: Pick<Objava, keyof Objava>; Insert: Omit<Objava, 'id' | 'created_at'>; Update: Partial<Objava>; Relationships: [] }
      objava_likes: { Row: Pick<ObjavaLike, keyof ObjavaLike>; Insert: Omit<ObjavaLike, 'id' | 'created_at'>; Update: Partial<ObjavaLike>; Relationships: [] }
      objava_komentarji: { Row: Pick<ObjavaKomentar, keyof ObjavaKomentar>; Insert: Omit<ObjavaKomentar, 'id' | 'created_at'>; Update: Partial<ObjavaKomentar>; Relationships: [] }
      promocija_narocila: { Row: Pick<PromocijaNarocilo, keyof PromocijaNarocilo>; Insert: Omit<PromocijaNarocilo, 'id' | 'created_at'>; Update: Partial<PromocijaNarocilo>; Relationships: [] }
    }
    Views: {
      public_profiles: {
        Row: Pick<Profil, 'id' | 'ime' | 'vloga' | 'verified' | 'dovoli_tuje_objave' | 'created_at'>
        Insert: never
        Update: never
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
