export interface ForumKategorija {
  slug: string
  naziv: string
  opis: string
  ikona: string
  barva: string
  steviloNiti: number
}

export interface ForumNit {
  id: string
  kategorija: string
  naslov: string
  vsebina: string
  avtor: string
  avatar: string
  vloga: string
  cas: string
  casISO: string
  odgovori: number
  ogledi: number
  likes: number
  pinned?: boolean
  reseno?: boolean
  tagi?: string[]
}

export interface ForumOdgovor {
  id: string
  nit_id: string
  vsebina: string
  avtor: string
  avatar: string
  vloga: string
  cas: string
  likes: number
  resitev?: boolean
}

export const forumKategorije: ForumKategorija[] = [
  { slug: 'jadranje', naziv: 'Jadranje & navigacija', opis: 'Nasveti za jadranje, rute, navigacija, vreme', ikona: '⛵', barva: 'bg-blue-500', steviloNiti: 47 },
  { slug: 'plovila', naziv: 'Plovila & oprema', opis: 'Nakup, prodaja, primerjave plovil in opreme', ikona: '🚤', barva: 'bg-[#0c2340]', steviloNiti: 83 },
  { slug: 'vzdrzevanje', naziv: 'Vzdrževanje', opis: 'Servis, popravila, zimovanje, antifouling', ikona: '🔧', barva: 'bg-amber-600', steviloNiti: 61 },
  { slug: 'charter', naziv: 'Charter & najem', opis: 'Izkušnje s charterji, priporočila, vprašanja', ikona: '🏢', barva: 'bg-emerald-600', steviloNiti: 29 },
  { slug: 'skiperji', naziv: 'Skiperji', opis: 'Iščete skipperja? Delite izkušnje, priporočila', ikona: '🧭', barva: 'bg-purple-600', steviloNiti: 22 },
  { slug: 'vreme', naziv: 'Vremenska napoved', opis: 'Vremenska okna, bora, jugo, napovedi', ikona: '🌊', barva: 'bg-sky-500', steviloNiti: 34 },
  { slug: 'splosno', naziv: 'Splošno', opis: 'Vse kar ne spada drugam — off-topic dobrodošel', ikona: '💬', barva: 'bg-gray-500', steviloNiti: 156 },
]

export const forumNiti: ForumNit[] = [
  {
    id: '1',
    kategorija: 'jadranje',
    naslov: 'Priporočila za ruto Portorož → Rovinj za prvič',
    vsebina: `Pozdravljeni! Letos prvič načrtujem plovbo iz Portoroža do Rovinju z Bavaria 34. Izkušnje z jadranjem imam, toda to bo moja prva daljša pomorska tura.\n\nKakšna je optimalna ruta? Koliko časa načrtovati? Kje so dobri sidriščni kraji vmes? Katera marina je v Rovinju najboljša za vezavo?\n\nHvala za vsak nasvet!`,
    avtor: 'Matej K.',
    avatar: '⛵',
    vloga: 'Kupec',
    cas: 'Pred 2 urami',
    casISO: '2024-06-10T08:00:00Z',
    odgovori: 8,
    ogledi: 142,
    likes: 12,
    tagi: ['Portorož', 'Rovinj', 'začetnik', 'ruta'],
  },
  {
    id: '2',
    kategorija: 'plovila',
    naslov: 'Bavaria 34 vs Jeanneau SO 379 — vaše izkušnje?',
    vsebina: `Odločam se med Bavaria 34 in Jeanneau Sun Odyssey 379, oba letnik 2018-2019, podobna cena.\n\nKakšne so vaše izkušnje z enim ali drugim? Zanima me principalmente:\n- Ravnanje v vetru in morju\n- Vzdrževanje\n- Udobje na krovu\n- Kakovost gradnje\n\nHvala!`,
    avtor: 'Rok V.',
    avatar: '🚤',
    vloga: 'Kupec',
    cas: 'Pred 5 urami',
    casISO: '2024-06-10T05:00:00Z',
    odgovori: 14,
    ogledi: 287,
    likes: 23,
    pinned: true,
    tagi: ['Bavaria', 'Jeanneau', 'primerjava'],
  },
  {
    id: '3',
    kategorija: 'vzdrzevanje',
    naslov: 'Antifouling priporočila za Jadran 2024',
    vsebina: `Kdaj je najboljši čas za antifouling v slovenskem primorju? Kateri produkt priporočate za počasne jadrnice (manj kot 6 vozlov)?\n\nLani sem uporabil International Micron CSC — zadovoljen, toda morda je kaj boljšega?`,
    avtor: 'Andrej M.',
    avatar: '🔧',
    vloga: 'Prodajalec',
    cas: 'Pred 1 dnem',
    casISO: '2024-06-09T10:00:00Z',
    odgovori: 6,
    ogledi: 198,
    likes: 9,
    reseno: true,
    tagi: ['antifouling', 'vzdrževanje', 'barva'],
  },
  {
    id: '4',
    kategorija: 'charter',
    naslov: 'Adriatic Sail — izkušnje s charterjem 2024?',
    vsebina: `Razmišljam o charterju pri Adriatic Sail v juliju. Ali je kdo imel izkušnjo z njimi v letošnji sezoni? Zanima me:\n- Stanje plovil\n- Odzivnost na težave\n- Ali je skipper vključen v ceno ali je doplačilo?`,
    avtor: 'Tina B.',
    avatar: '🏢',
    vloga: 'Kupec',
    cas: 'Pred 3 dnevi',
    casISO: '2024-06-07T14:00:00Z',
    odgovori: 11,
    ogledi: 341,
    likes: 18,
    tagi: ['Adriatic Sail', 'charter', 'izkušnja'],
  },
  {
    id: '5',
    kategorija: 'vreme',
    naslov: 'Bora napoved — kdaj je varno pluti?',
    vsebina: `Iščem nasvet od izkušenih — kateri vremenski portali so najbolj zanesljivi za Kvarner in severni Jadran? Windy, Wetter.at, MeteoAdriatic?\n\nTudi: kakšna je tipična "bora okno" — koliko dni traja in kdaj se pojavi?`,
    avtor: 'Marko H.',
    avatar: '🌊',
    vloga: 'Skipper',
    cas: 'Pred 4 urami',
    casISO: '2024-06-10T06:00:00Z',
    odgovori: 5,
    ogledi: 89,
    likes: 7,
    tagi: ['bora', 'vreme', 'Kvarner'],
  },
  {
    id: '6',
    kategorija: 'skiperji',
    naslov: 'Iščem skipperja za teden dni — julij, Kornati',
    vsebina: `Skupina 4 odraslih išče skipperja za teden dni v juliju (13.-20.7.). Imamo najem Bavaria 46 na Martinšici.\n\nIščemo izkušenega skipperja ki pozna Kornate in Šibenik. Komuniciramo v slovenščini ali angleščini.\n\nCena: fleksibilna, najpomembnejše so reference in izkušnje.`,
    avtor: 'Peter N.',
    avatar: '🧭',
    vloga: 'Kupec',
    cas: 'Pred 6 urami',
    casISO: '2024-06-10T04:00:00Z',
    odgovori: 4,
    ogledi: 167,
    likes: 3,
    tagi: ['iskanje', 'Kornati', 'julij'],
  },
  {
    id: '7',
    kategorija: 'splosno',
    naslov: 'Katera je vaša najljubša marina na Jadranu?',
    vsebina: `Samo za zabavo — katera marina je vaša absolutna najljubša? In zakaj?\n\nMoja je Palmižana na Hvaru — mir, narrava, odlična hrana. Ampak Korčula pride takoj za njo. 😄`,
    avtor: 'Ana K.',
    avatar: '💬',
    vloga: 'Kupec',
    cas: 'Pred 2 dnevoma',
    casISO: '2024-06-08T12:00:00Z',
    odgovori: 31,
    ogledi: 892,
    likes: 67,
    pinned: true,
    tagi: ['marina', 'favorite', 'Jadran'],
  },
]

export const forumOdgovori: ForumOdgovor[] = [
  // Odgovori za nit 1 (Portorož → Rovinj)
  {
    id: 'o1', nit_id: '1',
    vsebina: 'Odlična ruta za začetek! Priporočam vmesno postanko pri Rovinju — Limski kanal je absoluten must. Čas plovbe: 6-8 ur pri normalnih razmerah. Pozor na buro med Trstom in Porečem.',
    avtor: 'Marko H.', avatar: '⛵', vloga: 'Skipper', cas: 'Pred 1 uro', likes: 8, resitev: true,
  },
  {
    id: 'o2', nit_id: '1',
    vsebina: 'Strinjam se z Markom. Dodal bi — preverite vremenska okna na MeteoAdriatic. Julij/avgust so pogosto umirjene razmere, toda zgodnji zjutraj je vedno bolje kot popoldne (maestral in termika).',
    avtor: 'Andrej M.', avatar: '🧭', vloga: 'Prodajalec', cas: 'Pred 45 min', likes: 5,
  },
  {
    id: 'o3', nit_id: '1',
    vsebina: 'Marina Rovinj ACI je odlična, rezervirajte vnaprej! Julij je high season. Alternativa: sidrite pred mestom — lepše in ceneje. 🏖️',
    avtor: 'Petra N.', avatar: '🚤', vloga: 'Charter', cas: 'Pred 30 min', likes: 4,
  },
  // Odgovori za nit 2 (Bavaria vs Jeanneau)
  {
    id: 'o4', nit_id: '2',
    vsebina: 'Imel sem oba. Bavaria je solidna "value for money" — boljše prostorno, Jeanneau je bolj "sailor\'s boat". Če jadrate radi in cenite performans, Jeanneau. Če hočete udobje in prostor za družino, Bavaria.',
    avtor: 'Rok P.', avatar: '⛵', vloga: 'Prodajalec', cas: 'Pred 4 urami', likes: 15, resitev: true,
  },
  {
    id: 'o5', nit_id: '2',
    vsebina: 'Bavaria ima boljšo servisno mrežo v Slovenji in Hrvaški. Rezervni deli hitreje dostopni. To je praktičen argument ki ga mnogi pozabijo pri nakupu.',
    avtor: 'Luka B.', avatar: '🔧', vloga: 'Kupec', cas: 'Pred 3 urami', likes: 9,
  },
  // Odgovori za nit 7 (Najljubša marina)
  {
    id: 'o6', nit_id: '7',
    vsebina: 'Palmižana je top, strinjam se! Meni je Stari Grad na Hvaru neverjetna za poletne večere — hrana, vino, klima. ⛵🍷',
    avtor: 'Tina B.', avatar: '💬', vloga: 'Kupec', cas: 'Pred 1 dnem', likes: 12,
  },
  {
    id: 'o7', nit_id: '7',
    vsebina: 'Za nautiko: Luka Krilo Jesenice pri Splitu. Tiha, čisto morje, lokalna konoba z odlično ribjo. Ne pozna je vsak, kar je prednost. 😄',
    avtor: 'Andrej M.', avatar: '⚓', vloga: 'Skipper', cas: 'Pred 18 urami', likes: 22,
  },
]
