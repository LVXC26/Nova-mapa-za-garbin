import type { Plovilo, Novica, NovicaKategorija, Charter, TipCharterPlovila } from '@/types/database'

// IDs plovil ki so promoted (plačan oglas) — max 2-3
export const mockPromotedIds: string[] = ['1', '5']

// ─── KURIRANE SLIKE PO TIPU PLOVILA ───────────────────────────────
// Vsak tip ima točno ustrezne fotografije

// Jadrnice — jadra, jambori, krmarjenje
const IMG_JADRNICA = [
  'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&w=900&q=80', // bela jadrnica, jadra napeta
  'https://images.unsplash.com/photo-1559839809-3fd6ed4fabe7?auto=format&fit=crop&w=900&q=80',   // jadrnica sončni zahod, morje
  'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80', // jadrnica modra voda
  'https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?auto=format&fit=crop&w=900&q=80', // jadrnica iz zraka, marina
  'https://images.unsplash.com/photo-1518535226285-3e2c47f8e8fd?auto=format&fit=crop&w=900&q=80', // posadka na jadrnici
]

// Motorni čolni — brez jader, motor, hitrost
const IMG_MOTORNI = [
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',   // beli motorni čoln, hitrost
  'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=80', // motorni čoln, valovi
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=900&q=80', // motorni cruiser
  'https://images.unsplash.com/photo-1511527844068-006b95d2aa04?auto=format&fit=crop&w=900&q=80', // motorni čoln marina
]

// Luksuzne jahte — velika plovila, beli trup, motor
const IMG_JAHTA = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80', // luksuzna motorna jahta
  'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80', // superjahta na morju
  'https://images.unsplash.com/photo-1567899378277-15b5b5523cbf?auto=format&fit=crop&w=900&q=80', // jahta privezana v marini
]

// Gumenjaki / RIB čolni — napihljivi, sivi/črni trup
const IMG_GUMENJAK = [
  'https://images.unsplash.com/photo-1530736581871-c23ceb21e61a?auto=format&fit=crop&w=900&q=80',  // RIB gumenjak, motor
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80',  // gumenjak, adrenalin
  'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=900&q=80',  // zodiac tip gumenjak
]

// Katamarani — dva trupa, velik prostor
const IMG_KATAMARAN = [
  'https://images.unsplash.com/photo-1559496417-e94d4a36ffe0?auto=format&fit=crop&w=900&q=80',    // katamaran iz zraka
  'https://images.unsplash.com/photo-1535916707207-35f9d47f47e2?auto=format&fit=crop&w=900&q=80', // katamaran na sidru
  'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80', // multi-hull plovba
]

// Jet ski — osebni vodni skuter
const IMG_JET = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80', // jet ski, akcija
  'https://images.unsplash.com/photo-1601766751411-7c37e4fad2e9?auto=format&fit=crop&w=900&q=80', // jet ski, skoki
]

// Marina za charter podjetja
const IMG_MARINA = [
  'https://images.unsplash.com/photo-1519789110440-4b90d6f7e65b?auto=format&fit=crop&w=900&q=80', // marina, privezane jadrnice
  'https://images.unsplash.com/photo-1548574505-3ad3b1a69a54?auto=format&fit=crop&w=900&q=80',   // pristanišče, Jadran
  'https://images.unsplash.com/photo-1500628017-d5cdde8f8e13?auto=format&fit=crop&w=900&q=80',   // marina, poletje
]

// Helper: vrni slike za tip plovila
export function getSlikeZaTip(tip: string, count = 3): string[] {
  const map: Record<string, string[]> = {
    jadrnica: IMG_JADRNICA,
    motorni: IMG_MOTORNI,
    jahta: IMG_JAHTA,
    gumenjak: IMG_GUMENJAK,
    katamaran: IMG_KATAMARAN,
    jet: IMG_JET,
  }
  const arr = map[tip] ?? IMG_JADRNICA
  return arr.slice(0, count)
}

// Legacy export za backward compatibility
export const unsplashSlike = {
  jadrnica: IMG_JADRNICA,
  motorni: IMG_MOTORNI,
  jahta: IMG_JAHTA,
  gumenjak: IMG_GUMENJAK,
  katamaran: IMG_KATAMARAN,
  jet: IMG_JET,
  marina: IMG_MARINA,
  jadran: [
    'https://images.unsplash.com/photo-1467621085189-47d03ab4a07f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  ],
}

export const unsplashSkipperji: Record<string, string> = {
  s1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  s2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  s3: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  s4: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  s5: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  s6: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
}

export const unsplashNovice: Record<string, string> = {
  'kako-izbrati-jadrnico': 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&w=800&q=80',
  'trg-plovil-2024': 'https://images.unsplash.com/photo-1519789110440-4b90d6f7e65b?auto=format&fit=crop&w=800&q=80',
  'vzdrzevanje-plovila-pomlad': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
}

export const mockPlovila: Plovilo[] = [
  {
    id: '1',
    naziv: 'Bavaria Cruiser 46',
    opis: 'Odlično vzdrževana jadrnica, primerna za morska potovanja. Popolna za družinske počitnice ali dolge pohode.',
    cena: 89000, letnik: 2019, dolzina_m: 14.2,
    tip: 'jadrnica', tip_oglasa: 'prodaja', stanje: 'odlično',
    lokacija: 'Marina Portorož',
    kontakt_email: 'janez@primer.si', kontakt_tel: '+386 41 123 456',
    // jadrnica → samo slike jadralnih jahtičev
    slike: [
      IMG_JADRNICA[0], // bela jadrnica, jadra napeta
      IMG_JADRNICA[1], // jadrnica sončni zahod
      IMG_JADRNICA[3], // iz zraka, marina
    ],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true },
    potrjeno: true, promoted: true, prodano: false, cena_na_zahtevo: false, urgentno: false, user_id: 'u1', created_at: '2024-03-01T10:00:00Z', updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    naziv: 'Jeanneau Cap Camarat 7.5',
    opis: 'Hiter in udoben motorni čoln za izlete po morju. Idealen za vikend avanture.',
    cena: 42000, letnik: 2021, dolzina_m: 7.5,
    tip: 'motorni', tip_oglasa: 'prodaja', stanje: 'odlično',
    lokacija: 'Marina Izola',
    kontakt_email: 'marina@primer.si', kontakt_tel: '+386 40 987 654',
    // motorni → brez jader, motorni čolni
    slike: [
      IMG_MOTORNI[0], // beli motorni čoln, hitrost
      IMG_MOTORNI[1], // motorni, valovi
      IMG_MOTORNI[2], // motorni cruiser
    ],
    model_3d_url: null,
    oprema: { gps: true, radar: false, vhf: true },
    potrjeno: true, promoted: false, prodano: false, cena_na_zahtevo: false, urgentno: true, user_id: 'u2', created_at: '2024-03-05T12:00:00Z', updated_at: '2024-03-05T12:00:00Z',
  },
  {
    id: '3',
    naziv: 'Dufour 412 Grand Large',
    opis: 'Prostorna jadrnica z odličnim performansom. Kompletno opremljena za oceansko jadranje.',
    cena: 115000, letnik: 2018, dolzina_m: 12.35,
    tip: 'jadrnica', tip_oglasa: 'prodaja', stanje: 'dobro',
    lokacija: 'Marina Koper',
    kontakt_email: 'peter@primer.si', kontakt_tel: '+386 31 555 777',
    // jadrnica → drugačne kot Bavaria, a vedno jadralnje
    slike: [
      IMG_JADRNICA[2], // modra voda
      IMG_JADRNICA[1], // sončni zahod
      IMG_JADRNICA[0], // jadra napeta
    ],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, generator: true },
    potrjeno: true, promoted: false, prodano: false, cena_na_zahtevo: false, urgentno: false, user_id: 'u3', created_at: '2024-02-20T09:00:00Z', updated_at: '2024-02-20T09:00:00Z',
  },
  {
    id: '4',
    naziv: 'Zodiac Pro 550',
    opis: 'Zanesljiv gumenjak s 115KM Yamaha motorjem. Odličen za reševalne operacije in izlete.',
    cena: 18500, letnik: 2022, dolzina_m: 5.5,
    tip: 'gumenjak', tip_oglasa: 'prodaja', stanje: 'odlično',
    lokacija: 'Piran',
    kontakt_email: 'luka@primer.si', kontakt_tel: '+386 70 333 444',
    // gumenjak → inflatable RIB fotografije
    slike: [
      IMG_GUMENJAK[0], // RIB, motor
      IMG_GUMENJAK[2], // zodiac tip
      IMG_GUMENJAK[1], // adrenalin
    ],
    model_3d_url: null,
    oprema: { gps: true },
    potrjeno: true, promoted: false, prodano: true, cena_na_zahtevo: false, urgentno: false, user_id: 'u4', created_at: '2024-03-10T14:00:00Z', updated_at: '2024-03-10T14:00:00Z',
  },
  {
    id: '5',
    naziv: 'Beneteau Oceanis 51.1',
    opis: 'Flagshipska jadrnica z luksuzno opremo. Tri kabine, dve kopalnici, klimatska naprava.',
    cena: 198000, letnik: 2020, dolzina_m: 15.64,
    tip: 'jadrnica', tip_oglasa: 'prodaja', stanje: 'odlično',
    lokacija: 'Portorož',
    kontakt_email: 'info@yachtlux.si', kontakt_tel: '+386 5 123 456',
    // jadrnica (ne jahta!) → večja jadralnica, posadka
    slike: [
      IMG_JADRNICA[4], // posadka na jadrnici
      IMG_JADRNICA[0], // jadra napeta
      IMG_JADRNICA[2], // modra voda
    ],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true, generator: true, klima: true },
    potrjeno: true, promoted: true, prodano: false, cena_na_zahtevo: true, urgentno: false, user_id: 'u5', created_at: '2024-01-15T11:00:00Z', updated_at: '2024-01-15T11:00:00Z',
  },
  {
    id: '6',
    naziv: 'Quicksilver Activ 755 Open',
    opis: 'Sodoben motorni čoln z elegantnim dizajnom. Primeren za daljše izlete in šport na vodi.',
    cena: 55000, letnik: 2022, dolzina_m: 7.5,
    tip: 'motorni', tip_oglasa: 'prodaja', stanje: 'odlično',
    lokacija: 'Marina Bernardin',
    kontakt_email: 'ales@primer.si', kontakt_tel: '+386 41 888 999',
    // motorni → hitri čolni, sporty
    slike: [
      IMG_MOTORNI[3], // motorni čoln marina
      IMG_MOTORNI[0], // hitrost
      IMG_MOTORNI[1], // valovi
    ],
    model_3d_url: null,
    oprema: { gps: true, vhf: true },
    potrjeno: true, promoted: false, prodano: false, cena_na_zahtevo: false, urgentno: false, user_id: 'u6', created_at: '2024-03-12T08:00:00Z', updated_at: '2024-03-12T08:00:00Z',
  },
]

// Plovila za najem — vsak charter ima svoja plovila (user_id ujema charter.id)
export const mockNajemPlovila: Plovilo[] = [
  // Adriatic Sail (c1) — 12 plovil
  {
    id: 'n1',
    naziv: 'Bavaria C45 Style',
    opis: 'Prostorna jadrnica z 4 kabinami za do 10 oseb. Klimatska naprava, generator, radar. Idealna za tedenske jadralne počitnice.',
    cena: 3200,
    letnik: 2021,
    dolzina_m: 13.99,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Marina Portorož',
    kontakt_email: 'info@adriaticsail.si',
    kontakt_tel: '+386 5 671 2300',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true, klima: true, generator: true },
    potrjeno: true,
    user_id: 'c1',
    created_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'n2',
    naziv: 'Jeanneau Sun Odyssey 440',
    opis: 'Sodobna jadrnica z odprto zasnovo. 3 kabine, 2 kopalnici. Primerna za posadko do 8 oseb.',
    cena: 2800,
    letnik: 2022,
    dolzina_m: 13.34,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Marina Portorož',
    kontakt_email: 'info@adriaticsail.si',
    kontakt_tel: '+386 5 671 2300',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true },
    potrjeno: true,
    user_id: 'c1',
    created_at: '2024-01-12T10:00:00Z',
  },
  {
    id: 'n3',
    naziv: 'Princess V52 — Motorni',
    opis: 'Luksuzni motorni jahta za do 40 oseb. Primerena za poslovne dogodke in zasebne zabave na morju.',
    cena: 8500,
    letnik: 2020,
    dolzina_m: 16.0,
    tip: 'motorni',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Marina Portorož',
    kontakt_email: 'info@adriaticsail.si',
    kontakt_tel: '+386 5 671 2300',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true, klima: true, generator: true, rib: true },
    potrjeno: true,
    user_id: 'c1',
    created_at: '2024-01-15T10:00:00Z',
  },
  // Blue Horizon (c2)
  {
    id: 'n4',
    naziv: 'Beneteau Oceanis 46.1',
    opis: 'Luksuzna jadrnica z 4 kabinami. Popolnoma opremljena, klimatska naprava, generator. Do 10 oseb.',
    cena: 3600,
    letnik: 2022,
    dolzina_m: 14.35,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Marina Koper',
    kontakt_email: 'charter@bluehorizon.si',
    kontakt_tel: '+386 5 662 4100',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true, klima: true, generator: true },
    potrjeno: true,
    user_id: 'c2',
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'n5',
    naziv: 'Hanse 548 — Regata',
    opis: 'Hitrostna jadrnica za izkušene mornarje. Do 12 oseb na krovu. RYA certificiran skipper na voljo.',
    cena: 4200,
    letnik: 2021,
    dolzina_m: 16.73,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Marina Koper',
    kontakt_email: 'charter@bluehorizon.si',
    kontakt_tel: '+386 5 662 4100',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true, epirb: true },
    potrjeno: true,
    user_id: 'c2',
    created_at: '2024-02-05T10:00:00Z',
  },
  // Izola Yacht Club (c3)
  {
    id: 'n6',
    naziv: 'Dufour 360 Grand Large',
    opis: 'Kompaktna jadrnica za do 6 oseb. Primerna za kratke in daljše izlete. Z ali brez skipperja.',
    cena: 1400,
    letnik: 2019,
    dolzina_m: 10.93,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'dobro',
    lokacija: 'Marina Izola',
    kontakt_email: 'najem@izolayc.si',
    kontakt_tel: '+386 5 641 3900',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, vhf: true },
    potrjeno: true,
    user_id: 'c3',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'n7',
    naziv: 'Zodiac Pro 650 Gumenjak',
    opis: 'Hitri gumenjak za izlete v bližnje zalive in otoke. Do 8 oseb. Dnevni najem.',
    cena: 350,
    letnik: 2021,
    dolzina_m: 6.5,
    tip: 'gumenjak',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Marina Izola',
    kontakt_email: 'najem@izolayc.si',
    kontakt_tel: '+386 5 641 3900',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true },
    potrjeno: true,
    user_id: 'c3',
    created_at: '2024-01-22T10:00:00Z',
  },
  // SeaTime (c4)
  {
    id: 'n8',
    naziv: 'Azimut 45 Fly',
    opis: 'Moderna motorni jahta za poslovne dogodke in zasebne izlete. Do 20 oseb na krovu.',
    cena: 5500,
    letnik: 2020,
    dolzina_m: 13.72,
    tip: 'motorni',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Piran',
    kontakt_email: 'hello@seatime.si',
    kontakt_tel: '+386 51 234 567',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true, klima: true },
    potrjeno: true,
    user_id: 'c4',
    created_at: '2024-03-01T10:00:00Z',
  },
  // Marko Kovač (c5) — zasebnik
  {
    id: 'n9',
    naziv: 'Bavaria 40 Cruiser',
    opis: 'Moja Bavaria 40 za tedenski najem. Do 6 oseb, 3 kabine. Skipper na razpolago za doplačilo. Izhodiščna točka Portorož.',
    cena: 1800,
    letnik: 2017,
    dolzina_m: 12.35,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Portorož',
    kontakt_email: 'marko.kovac@gmail.com',
    kontakt_tel: '+386 41 876 543',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, radar: true, vhf: true, autopilot: true },
    potrjeno: true,
    user_id: 'c5',
    created_at: '2024-02-10T10:00:00Z',
  },
  // Ana & Rok Vidmar (c6) — zasebnik
  {
    id: 'n10',
    naziv: 'Jeanneau 39i',
    opis: 'Naš Jeanneau 39i za tedenske chartere junij–september. Samo bareboat za skippers z veljavnim patentom. 6 oseb, 3 kabine.',
    cena: 1600,
    letnik: 2016,
    dolzina_m: 11.73,
    tip: 'jadrnica',
    tip_oglasa: 'najem',
    stanje: 'dobro',
    lokacija: 'Koper',
    kontakt_email: 'vidmar.charter@gmail.com',
    kontakt_tel: '+386 70 123 456',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true, vhf: true },
    potrjeno: true,
    user_id: 'c6',
    created_at: '2024-02-15T10:00:00Z',
  },
  // Luka Marinič (c7) — zasebnik
  {
    id: 'n11',
    naziv: 'Quicksilver 605 Open',
    opis: 'Dnevni najem motornega čolna za do 6 oseb. Okolica Piranskega zaliva, Strunjan, Sečovlje.',
    cena: 280,
    letnik: 2020,
    dolzina_m: 6.05,
    tip: 'motorni',
    tip_oglasa: 'najem',
    stanje: 'odlično',
    lokacija: 'Piran',
    kontakt_email: 'luka.marinic@gmail.com',
    kontakt_tel: '+386 31 999 888',
    slike: [],
    model_3d_url: null,
    oprema: { gps: true },
    potrjeno: true,
    user_id: 'c7',
    created_at: '2024-03-05T10:00:00Z',
  },
]

export const mockPromocije = [
  {
    id: 'p1',
    naziv: 'Pomladna Akcija — 15% Popust',
    opis: 'Posebna pomladna ponudba na vse jadrnice letnik 2018–2020. Ne zamudite priložnosti za nakup sanjske jadrnice.',
    slika_url: null,
    popust: 15,
    tip: 'popust' as const,
    veljavnost_do: '2024-05-31',
    plovilo_id: '1',
    barva: '#0c2340',
  },
  {
    id: 'p2',
    naziv: 'Featured Oglas — Beneteau Oceanis',
    opis: 'Ekskluzivna ponudba tedna. Luksuzna jadrnica z vso opremo po znižani ceni. Takojšnja prodaja.',
    slika_url: null,
    popust: null,
    tip: 'featured' as const,
    veljavnost_do: '2024-04-30',
    plovilo_id: '5',
    barva: '#c9a84c',
  },
  {
    id: 'p3',
    naziv: 'Sezonska Priložnost — Motorni čolni',
    opis: 'Začetek sezone pomeni nove priložnosti. Vsi motorni čolni z brezplačnim pregledom in serviserjem.',
    slika_url: null,
    popust: 10,
    tip: 'sezonska' as const,
    veljavnost_do: '2024-06-15',
    plovilo_id: '2',
    barva: '#1e3a5f',
  },
  {
    id: 'p4',
    naziv: 'Paket Oprema + Plovilo',
    opis: 'Kupi plovilo in dobi popolno navigacijsko opremo brezplačno. GPS, VHF radio, rešilni jopiči.',
    slika_url: null,
    popust: null,
    tip: 'paket' as const,
    veljavnost_do: '2024-05-15',
    plovilo_id: '3',
    barva: '#2e7d32',
  },
  {
    id: 'p5',
    naziv: 'Hitri Odkup — Gotovinska Cena',
    opis: 'Prodajamo hitro! Gumenjaki in manjši čolni po znižanih cenah za gotovinski odkup.',
    slika_url: null,
    popust: 20,
    tip: 'popust' as const,
    veljavnost_do: '2024-04-20',
    plovilo_id: '4',
    barva: '#6a1b9a',
  },
]

export const mockNovice: (Novica & { kategorija: NovicaKategorija })[] = [
  {
    id: 'n1',
    naslov: 'Kako izbrati pravo jadrnico za vaše prve pomorske pustolovščine',
    vsebina: '',
    povzetek: 'Vodnik za začetnike pri nakupu prve jadrnice. Kaj upoštevati pri izbiri velikosti, starosti in opreme plovila.',
    slika_url: null,
    slug: 'kako-izbrati-jadrnico',
    avtor: 'Matej Kovač',
    kategorija_id: 'k2',
    published_at: '2024-03-10T10:00:00Z',
    created_at: '2024-03-10T10:00:00Z',
    kategorija: { id: 'k2', naziv: 'Nasveti za kupce', slug: 'nasveti', barva: '#1e3a5f' },
  },
  {
    id: 'n2',
    naslov: 'Trg plovil 2024: cene rastejo, povpraševanje rekordno',
    vsebina: '',
    povzetek: 'Analiza slovenskega trga plovil v prvem četrtletju 2024. Jadrnice so dosegle rekordne cene.',
    slika_url: null,
    slug: 'trg-plovil-2024',
    avtor: 'Ana Novak',
    kategorija_id: 'k1',
    published_at: '2024-03-05T09:00:00Z',
    created_at: '2024-03-05T09:00:00Z',
    kategorija: { id: 'k1', naziv: 'Novosti na trgu', slug: 'novosti', barva: '#0c2340' },
  },
  {
    id: 'n3',
    naslov: 'Vzdrževanje plovila pozimi — checklist za pomlad',
    vsebina: '',
    povzetek: 'Vse kar morate preveriti preden spustite plovilo v vodo po zimski sezoni. Praktičen seznam za lastnike.',
    slika_url: null,
    slug: 'vzdrzevanje-plovila-pomlad',
    avtor: 'Rok Marinič',
    kategorija_id: 'k3',
    published_at: '2024-02-28T14:00:00Z',
    created_at: '2024-02-28T14:00:00Z',
    kategorija: { id: 'k3', naziv: 'Vzdrževano plovilo', slug: 'vzdrzevanje', barva: '#c9a84c' },
  },
]

export const mockCharterji: Charter[] = [
  {
    id: 'c1',
    naziv: 'Adriatic Sail d.o.o.',
    opis: 'Vodilna charter agencija na Slovenskem primorju. Ponujamo najem jadrnic in motornih čolnov z ali brez skipperja za nezabiten jadralni izlet po Jadranu.',
    tip: 'podjetje',
    lokacija: 'Marina Portorož',
    kontakt_email: 'info@adriaticsail.si',
    kontakt_tel: '+386 5 671 2300',
    spletna_stran: 'https://adriaticsail.si',
    ocena: 4.9,
    st_plovil: 12,
    max_oseb: 40,
    max_dolzina_m: 45,
    tip_plovila: ['jahta', 'jadrnica', 'motorni'] as TipCharterPlovila[],
    verified: true,
    created_at: '2023-06-01T10:00:00Z',
  },
  {
    id: 'c2',
    naziv: 'Blue Horizon Charter',
    opis: 'Specializirana agencija za najem luksuznih jadrnic. Certifikati RYA, izkušeni skipperji, individualne rute.',
    tip: 'podjetje',
    lokacija: 'Marina Koper',
    kontakt_email: 'charter@bluehorizon.si',
    kontakt_tel: '+386 5 662 4100',
    spletna_stran: null,
    ocena: 4.7,
    st_plovil: 8,
    max_oseb: 12,
    max_dolzina_m: 30,
    tip_plovila: ['jahta', 'jadrnica'] as TipCharterPlovila[],
    verified: true,
    created_at: '2023-08-15T10:00:00Z',
  },
  {
    id: 'c3',
    naziv: 'Izola Yacht Club',
    opis: 'Jadralni klub z bogato tradicijo. Najem plovil za člane in nečlane. Organiziramo tudi tečaje jadralskega patenta.',
    tip: 'podjetje',
    lokacija: 'Marina Izola',
    kontakt_email: 'najem@izolayc.si',
    kontakt_tel: '+386 5 641 3900',
    spletna_stran: 'https://izolayc.si',
    ocena: 4.5,
    st_plovil: 6,
    max_oseb: 12,
    max_dolzina_m: 14,
    tip_plovila: ['jadrnica', 'gumenjak'] as TipCharterPlovila[],
    verified: true,
    created_at: '2023-05-20T10:00:00Z',
  },
  {
    id: 'c4',
    naziv: 'SeaTime Charter',
    opis: 'Mlada agencija z modernimi plovili. Specializirani za skupinska potovanja in teambuilding izlete.',
    tip: 'podjetje',
    lokacija: 'Piran',
    kontakt_email: 'hello@seatime.si',
    kontakt_tel: '+386 51 234 567',
    spletna_stran: null,
    ocena: 4.6,
    st_plovil: 4,
    max_oseb: 20,
    max_dolzina_m: 25,
    tip_plovila: ['motorni', 'jahta'] as TipCharterPlovila[],
    verified: false,
    created_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'c5',
    naziv: 'Marko Kovač',
    opis: 'Izkušen mornar z 15 leti plovidbenih izkušenj. Nudim najem moje Bavaria 40 z možnostjo skipperja. Odlično vzdrževano plovilo za do 6 oseb.',
    tip: 'zasebnik',
    lokacija: 'Portorož',
    kontakt_email: 'marko.kovac@gmail.com',
    kontakt_tel: '+386 41 876 543',
    spletna_stran: null,
    ocena: 5.0,
    st_plovil: 1,
    max_oseb: 6,
    max_dolzina_m: 12,
    tip_plovila: ['jadrnica'] as TipCharterPlovila[],
    verified: true,
    created_at: '2023-09-01T10:00:00Z',
  },
  {
    id: 'c6',
    naziv: 'Ana & Rok Vidmar',
    opis: 'Oddajamo naš Jeanneau 39i za tedenske chartere junij–september. Mogoče samo bareboat za skippers z veljavnim patentom.',
    tip: 'zasebnik',
    lokacija: 'Koper',
    kontakt_email: 'vidmar.charter@gmail.com',
    kontakt_tel: '+386 70 123 456',
    spletna_stran: null,
    ocena: 4.8,
    st_plovil: 1,
    max_oseb: 8,
    max_dolzina_m: 12,
    tip_plovila: ['jadrnica'] as TipCharterPlovila[],
    verified: false,
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'c7',
    naziv: 'Luka Marinič',
    opis: 'Najem motornega čolna Quicksilver 605 za dnevne izlete. Primeren za do 6 oseb, okolica Piranskega zaliva.',
    tip: 'zasebnik',
    lokacija: 'Piran',
    kontakt_email: 'luka.marinic@gmail.com',
    kontakt_tel: '+386 31 999 888',
    spletna_stran: null,
    ocena: 4.4,
    st_plovil: 1,
    max_oseb: 6,
    max_dolzina_m: 6,
    tip_plovila: ['motorni'] as TipCharterPlovila[],
    verified: false,
    created_at: '2024-03-01T10:00:00Z',
  },
]

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
  tip_skiper: 'samostojni' | 'agencija'
  naziv_agencije?: string
  ekipa?: { ime: string; specializacija: string; ocena: number }[]
  created_at: string
}

export const mockSkiperji: Skipper[] = [
  {
    id: 's1',
    ime: 'Marko Horvat',
    lokacija: 'Portorož',
    izkusnje_let: 18,
    jeziki: ['slovenščina', 'angleščina', 'hrvaščina'],
    certifikati: ['ICC', 'VHF SRC', 'RYA Day Skipper'],
    tip_plovila: ['jadrnica', 'motorni'],
    opis: 'Izkušen mornar z 18 leti plovidbenih izkušenj po Jadranu. Specializiran za jadranje po hrvaških otokih in slovenskem primorju.',
    ocena: 4.9,
    st_ocen: 47,
    cena_dan: 180,
    verified: true,
    tip_skiper: 'samostojni',
    created_at: '2023-05-01T10:00:00Z',
  },
  {
    id: 's2',
    ime: 'Petra Novak',
    lokacija: 'Izola',
    izkusnje_let: 12,
    jeziki: ['slovenščina', 'angleščina', 'nemščina', 'italijanščina'],
    certifikati: ['ICC', 'VHF SRC', 'STCW'],
    tip_plovila: ['jadrnica', 'katamaran'],
    opis: 'Certificirana skipperka z bogatimi izkušnjami na jadrnicah in katamaranih. Skupaj odkrivamo Jadransko morje in mediteranske rute.',
    ocena: 5.0,
    st_ocen: 31,
    cena_dan: 200,
    verified: true,
    tip_skiper: 'samostojni',
    created_at: '2023-07-15T10:00:00Z',
  },
  {
    id: 's3',
    ime: 'Luka Benedičič',
    lokacija: 'Koper',
    izkusnje_let: 8,
    jeziki: ['slovenščina', 'angleščina'],
    certifikati: ['ICC', 'VHF SRC'],
    tip_plovila: ['motorni', 'gumenjak'],
    opis: 'Mlad in dinamičen skipper z odličnim poznavanjem koprskega primorja. Specializiran za motorni čolni in gumenjake za dnevne izlete.',
    ocena: 4.7,
    st_ocen: 22,
    cena_dan: 140,
    verified: true,
    tip_skiper: 'samostojni',
    created_at: '2023-09-01T10:00:00Z',
  },
  {
    id: 's4',
    ime: 'Jadran Skipper Agencija',
    lokacija: 'Split',
    izkusnje_let: 15,
    jeziki: ['slovenščina', 'angleščina', 'hrvaščina', 'italijanščina'],
    certifikati: ['RYA Training Centre', 'ISO 9001', 'STCW'],
    tip_plovila: ['jadrnica', 'motorni', 'katamaran', 'jahta'],
    opis: 'Vodilna agencija za profesionalne skiperje na Jadranu. Pokrivamo rute od Trsta do Dubrovnika z ekipo 8 certificiranih skiperjev.',
    ocena: 4.8,
    st_ocen: 89,
    cena_dan: 220,
    verified: true,
    tip_skiper: 'agencija',
    naziv_agencije: 'Jadran Skipper d.o.o.',
    ekipa: [
      { ime: 'Andrej Marinič', specializacija: 'Jadrnice, offshore', ocena: 4.9 },
      { ime: 'Nina Vrhovnik', specializacija: 'Katamarani, Mediteran', ocena: 4.8 },
      { ime: 'Boris Kos', specializacija: 'Motorni jahti, VIP charter', ocena: 5.0 },
      { ime: 'Sara Miklavžič', specializacija: 'Regatni jadranje', ocena: 4.7 },
    ],
    created_at: '2022-01-10T10:00:00Z',
  },
  {
    id: 's5',
    ime: 'Tina Kovačič',
    lokacija: 'Portorož',
    izkusnje_let: 6,
    jeziki: ['slovenščina', 'angleščina'],
    certifikati: ['ICC', 'VHF SRC'],
    tip_plovila: ['jadrnica'],
    opis: 'Mlada skipperka specializirana za jadranje. Odlična izbira za pare in manjše skupinice, ki se želijo naučiti osnov jadralnega plovna.',
    ocena: 4.6,
    st_ocen: 15,
    cena_dan: 130,
    verified: false,
    tip_skiper: 'samostojni',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 's6',
    ime: 'Rok Pirnat',
    lokacija: 'Izola',
    izkusnje_let: 15,
    jeziki: ['slovenščina', 'angleščina', 'hrvaščina'],
    certifikati: ['ICC', 'VHF SRC', 'RYA Day Skipper'],
    tip_plovila: ['motorni', 'jahta'],
    opis: 'Izkušen skipper za motorni in jachtno jadranje. Specializiran za čarterje na Kvarnerju in Dalmaciji.',
    ocena: 4.85,
    st_ocen: 38,
    cena_dan: 190,
    verified: true,
    tip_skiper: 'samostojni',
    created_at: '2023-03-05T10:00:00Z',
  },
]

export const mockRezervniDeli = [
  {
    id: 'd1',
    naziv: 'Yamaha 150HP F150DETX Zunajbordni Motor',
    opis: 'Rabljen motor v odličnem stanju. Servisan 2023, 450 delovnih ur. S certifikatom tehničnega pregleda.',
    cena: 8500,
    stanje: 'rabljeno' as const,
    kategorija: 'motor' as const,
    tip_plovila: 'motorni',
    slika_url: null,
    kontakt_email: 'motorji@primer.si',
    kontakt_tel: '+386 41 111 222',
    lokacija: 'Koper',
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'd2',
    naziv: 'Furuno GP-33 GPS Navigator',
    opis: 'Nov, neodpakiran GPS navigator. Primeren za vse tipe plovil. Garancija 2 leti.',
    cena: 420,
    stanje: 'novo' as const,
    kategorija: 'elektronika' as const,
    tip_plovila: 'jadrnica',
    slika_url: null,
    kontakt_email: 'elektronika@navsup.si',
    kontakt_tel: '+386 1 234 567',
    lokacija: 'Ljubljana',
    created_at: '2024-03-08T11:00:00Z',
  },
  {
    id: 'd3',
    naziv: 'Genova jadro 42m² — North Sails',
    opis: 'Rabljeno jadro, letnik 2021. Minimalna obraba, brez popravil. Primerno za Bavaria 40.',
    cena: 1800,
    stanje: 'rabljeno' as const,
    kategorija: 'jadra' as const,
    tip_plovila: 'jadrnica',
    slika_url: null,
    kontakt_email: 'jadra@sailor.si',
    kontakt_tel: '+386 40 444 555',
    lokacija: 'Portorož',
    created_at: '2024-03-12T09:00:00Z',
  },
  {
    id: 'd4',
    naziv: 'Bruce Sidro 15kg — galvaniziran',
    opis: 'Nov Bruce sidro 15kg. Primerno za plovila do 12m. Z 10m verige 8mm.',
    cena: 280,
    stanje: 'novo' as const,
    kategorija: 'sidrna oprema' as const,
    tip_plovila: 'jadrnica',
    slika_url: null,
    kontakt_email: 'sidra@marinestore.si',
    kontakt_tel: '+386 5 987 654',
    lokacija: 'Izola',
    created_at: '2024-03-14T15:00:00Z',
  },
  {
    id: 'd5',
    naziv: 'Gelcoat popravilo — komplet',
    opis: 'Komplet za popravilo trupa. Beli gelcoat 500g + trdilec + smirkovci. Profesionalna kakovost.',
    cena: 65,
    stanje: 'novo' as const,
    kategorija: 'trup' as const,
    tip_plovila: 'jadrnica',
    slika_url: null,
    kontakt_email: 'materiali@yachtpro.si',
    kontakt_tel: '+386 31 777 888',
    lokacija: 'Koper',
    created_at: '2024-03-15T08:00:00Z',
  },
  {
    id: 'd6',
    naziv: 'Garmin VHF 315i Marine Radio',
    opis: 'Vgrajen VHF radio z DSC klicem in GPS. Rabljen 1 sezono, odlično stanje.',
    cena: 320,
    stanje: 'rabljeno' as const,
    kategorija: 'elektronika' as const,
    tip_plovila: 'motorni',
    slika_url: null,
    kontakt_email: 'vhf@sailor.si',
    kontakt_tel: '+386 70 222 333',
    lokacija: 'Piran',
    created_at: '2024-03-16T13:00:00Z',
  },
  {
    id: 'd7',
    naziv: 'Volvo Penta IPS 500 Pogonski Sistem',
    opis: 'Kompleten pogonski sistem z motorjem 300KM. Servisan, 800 ur. Z dokumentacijo.',
    cena: 24000,
    stanje: 'rabljeno' as const,
    kategorija: 'motor' as const,
    tip_plovila: 'motorni',
    slika_url: null,
    kontakt_email: 'volvo@yachtengine.si',
    kontakt_tel: '+386 1 333 444',
    lokacija: 'Koper',
    created_at: '2024-03-17T10:00:00Z',
  },
  {
    id: 'd8',
    naziv: 'Gumenjak Zodiac Fender Set 6-kos',
    opis: 'Nov set 6 fenderjev za gumenjake. Bele barve, dolžina 50cm. Primerno za Zodiac in podobne.',
    cena: 120,
    stanje: 'novo' as const,
    kategorija: 'drugo' as const,
    tip_plovila: 'gumenjak',
    slika_url: null,
    kontakt_email: 'oprema@navsup.si',
    kontakt_tel: '+386 41 999 000',
    lokacija: 'Piran',
    created_at: '2024-03-18T09:00:00Z',
  },
]
