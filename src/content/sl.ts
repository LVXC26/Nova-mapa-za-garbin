import type { SiteContent } from "./types";

export const sl: SiteContent = {
  locale: "sl",
  meta: {
    title: "LVX Experience — Video produkcija, marketing & spletne strani",
    description:
      "LVX Experience je studio za video produkcijo, marketing na Facebooku in Instagramu, organsko vodenje družbenih omrežij, izdelavo spletnih strani in Google SEO.",
  },
  nav: {
    items: [
      { label: "Domov", href: "/" },
      { label: "Storitve", href: "/storitve" },
      { label: "Projekti", href: "/projekti" },
      { label: "O nas", href: "/o-nas" },
      { label: "Kontakt", href: "/kontakt" },
    ],
    cta: { label: "Začnimo projekt ↗", href: "/kontakt" },
    langSwitch: { label: "EN", href: "/en" },
  },
  hero: {
    eyebrow: "Video · Marketing · Splet · SEO",
    titleLines: ["Izkušnje, ki jih", "vaše občinstvo opazi."],
    subtitle:
      "LVX Experience ustvarja video vsebine, marketinške kampanje in spletne strani, ki znamkam pomagajo izstopati na Facebooku, Instagramu in Googlu.",
    ctaPrimary: { label: "Začnimo projekt", href: "/kontakt" },
    ctaSecondary: { label: "Poglej storitve", href: "/storitve" },
    badges: ["Odprti za projekte", "Video produkcija", "Marketing & SEO"],
    hud: {
      status: "V PRODUKCIJI",
      project: "lvx_project_reel_v3",
      lines: [
        { label: "faza", value: "montaža" },
        { label: "format", value: "9:16 · 16:9" },
        { label: "objava", value: "FB / IG / Web" },
      ],
      flipHint: "Zadrži in povleci, da zavrtiš",
      backTitle: "Poglej naše delo",
      backCta: { label: "Vsi projekti →", href: "/projekti" },
    },
  },
  servicesSection: {
    eyebrow: "Storitve · 01",
    title: "Vse, kar znamka potrebuje na enem mestu.",
    intro:
      "Od prve ideje do objave — pokrivamo celotno digitalno prisotnost vašega podjetja.",
    items: [
      {
        tag: "Video",
        title: "Video produkcija",
        description:
          "Snemanje in montaža promocijskih, produktnih in socialnih videov, prilagojenih za Reels, TikTok in YouTube.",
        points: ["Snemanje na lokaciji", "Montaža & barvna korekcija", "Kratke in dolge formate"],
      },
      {
        tag: "Marketing",
        title: "Facebook & Instagram marketing",
        description:
          "Plačljive kampanje, ki jih ciljamo na prave ljudi — od nastavitve do optimizacije rezultatov.",
        points: ["Oglaševalske kampanje", "Ciljanje občinstva", "Sledenje rezultatom"],
      },
      {
        tag: "Social",
        title: "Organsko vodenje družbenih omrežij",
        description:
          "Vsebinski koledar, objave in skrb za skupnost, ki znamki gradi prepoznavnost iz dneva v dan.",
        points: ["Vsebinska strategija", "Redne objave", "Odzivanje na skupnost"],
      },
      {
        tag: "Splet",
        title: "Izdelava spletnih strani",
        description:
          "Hitre, moderne in mobilno prilagojene spletne strani, ki obiskovalce spremenijo v stranke.",
        points: ["Sodoben dizajn", "Mobilna prilagoditev", "Hitro nalaganje"],
      },
      {
        tag: "SEO",
        title: "Google SEO",
        description:
          "Optimizacija za iskalnike in lokalni SEO, ki dolgoročno povečuje organski obisk strani.",
        points: ["Tehnični SEO pregled", "Lokalna vidnost", "Rast organskega prometa"],
      },
    ],
  },
  industries: {
    eyebrow: "Panoge · 02",
    title: "Panoge, s katerimi radi sodelujemo.",
    intro:
      "Prilagajamo se specifiki vsake panoge — od gostinstva do osebnih blagovnih znamk.",
    items: [
      "Gostinstvo & kavarne",
      "Hoteli & turizem",
      "Wellness & spa",
      "Lokalni izdelki",
      "Osebne blagovne znamke",
      "Dogodki & poroke",
    ],
  },
  gallery: {
    eyebrow: "Utrinki · 03",
    title: "Utrinki z naših snemanj.",
    intro:
      "Nekaj dodatnih posnetkov iz primerov projektov, ki prikazujejo vrsto vsebin, ki jih ustvarjamo.",
    items: [
      {
        src: "/images/gallery/martinova-5.jpg",
        alt: "Gostinski lokal, ambient",
        title: "Gostinski lokal",
        tag: "Gostinstvo",
        description: "Foto/video vsebine za gostinski lokal.",
      },
      {
        src: "/images/gallery/hotel-lonca-5.jpg",
        alt: "Hotel, ambient",
        title: "Hotel & turizem",
        tag: "Hotel",
        description: "Predstavitvene vsebine za hotelsko namestitev.",
      },
      {
        src: "/images/gallery/athlete-gym-5.jpg",
        alt: "Fitnes studio, ambient",
        title: "Fitnes studio",
        tag: "Fitnes",
        description: "Dinamični posnetki za fitnes studio.",
      },
      {
        src: "/images/gallery/mia-kozmetika-5.jpg",
        alt: "Kozmetični izdelek, detajl",
        title: "Kozmetična znamka",
        tag: "Kozmetika",
        description: "Produktni posnetki za kozmetično znamko.",
      },
      {
        src: "/images/gallery/martinova-6.jpg",
        alt: "Gostinski lokal, dodaten detajl",
        title: "Gostinski lokal",
        tag: "Gostinstvo",
        description: "Foto/video vsebine za gostinski lokal.",
      },
      {
        src: "/images/gallery/hotel-lonca-6.jpg",
        alt: "Hotel, dodaten detajl",
        title: "Hotel & turizem",
        tag: "Hotel",
        description: "Predstavitvene vsebine za hotelsko namestitev.",
      },
      {
        src: "/images/gallery/athlete-gym-6.jpg",
        alt: "Fitnes studio, dodaten detajl",
        title: "Fitnes studio",
        tag: "Fitnes",
        description: "Dinamični posnetki za fitnes studio.",
      },
      {
        src: "/images/gallery/mia-kozmetika-6.jpg",
        alt: "Kozmetični izdelek, dodaten detajl",
        title: "Kozmetična znamka",
        tag: "Kozmetika",
        description: "Produktni posnetki za kozmetično znamko.",
      },
    ],
  },
  process: {
    eyebrow: "Proces · 04",
    title: "Kako pripeljemo projekt od ideje do objave.",
    intro: "Jasen proces, ki poskrbi, da veste, kaj se dogaja v vsaki fazi.",
    steps: [
      {
        number: "01",
        title: "Brief",
        description: "Spoznamo vašo znamko, cilje in občinstvo ter dogovorimo smer projekta.",
      },
      {
        number: "02",
        title: "Ideja & scenarij",
        description: "Pripravimo koncept, scenarij in vizualne reference pred snemanjem.",
      },
      {
        number: "03",
        title: "Produkcija",
        description: "Snemamo video vsebino in zbiramo gradivo za marketinške kampanje.",
      },
      {
        number: "04",
        title: "Montaža & objava",
        description: "Montiramo, oblikujemo in objavljamo vsebino na dogovorjenih kanalih.",
      },
      {
        number: "05",
        title: "Rast & optimizacija",
        description: "Spremljamo rezultate ter optimiziramo kampanje in SEO za dolgoročno rast.",
      },
    ],
  },
  projects: {
    eyebrow: "Projekti · 2026",
    title: "Primeri projektov.",
    intro:
      "Ker LVX Experience šele začenja, tukaj so primeri projektov, ki prikazujejo vrsto dela, ki ga opravljamo.",
    note: "Placeholder primeri — zamenjani bodo z resničnimi projekti strank, ko bodo na voljo.",
    items: [
      {
        images: [
          "/images/projects/hartatek-1.jpg",
          "/images/gallery/martinova-2.jpg",
          "/images/gallery/martinova-3.jpg",
          "/images/gallery/martinova-4.jpg",
          "/images/gallery/martinova-7.jpg",
          "/images/gallery/martinova-8.jpg",
        ],
        title: "Primer: Gostinski lokal",
        category: "Video produkcija & Social",
        description: "Foto/video vsebine in vodenje družbenih omrežij za gostinski lokal.",
      },
      {
        images: [
          "/images/projects/hartatek-2.jpg",
          "/images/gallery/hotel-lonca-2.jpg",
          "/images/gallery/hotel-lonca-3.jpg",
          "/images/gallery/hotel-lonca-4.jpg",
          "/images/gallery/hotel-lonca-7.jpg",
          "/images/gallery/hotel-lonca-8.jpg",
        ],
        title: "Primer: Hotel & turizem",
        category: "Spletna stran & SEO",
        description: "Predstavitvena spletna stran z optimizacijo za lokalni Google SEO.",
      },
      {
        images: [
          "/images/projects/hartatek-3.jpg",
          "/images/gallery/athlete-gym-2.jpg",
          "/images/gallery/athlete-gym-3.jpg",
          "/images/gallery/athlete-gym-4.jpg",
          "/images/gallery/athlete-gym-7.jpg",
          "/images/gallery/athlete-gym-8.jpg",
        ],
        title: "Primer: Fitnes studio",
        category: "Marketing kampanja",
        description: "Facebook in Instagram oglaševalska kampanja za povečanje članstva.",
      },
      {
        images: [
          "/images/projects/hartatek-4.jpg",
          "/images/gallery/mia-kozmetika-2.jpg",
          "/images/gallery/mia-kozmetika-3.jpg",
          "/images/gallery/mia-kozmetika-4.jpg",
          "/images/gallery/mia-kozmetika-7.jpg",
          "/images/gallery/mia-kozmetika-8.jpg",
        ],
        title: "Primer: Kozmetična znamka",
        category: "Video & Organsko vodenje",
        description: "Produktni videi in redno vodenje družbenih omrežij za kozmetično znamko.",
      },
      {
        images: [
          "/images/gallery/kaos-okusov-1.jpg",
          "/images/gallery/kaos-okusov-2.jpg",
          "/images/gallery/kaos-okusov-3.jpg",
          "/images/gallery/kaos-okusov-4.jpg",
          "/images/gallery/kaos-okusov-5.jpg",
          "/images/gallery/kaos-okusov-6.jpg",
        ],
        title: "Primer: Burger restavracija",
        category: "Organsko vodenje omrežij",
        description: "Redno vodenje družbenih omrežij in vsebine, ki prikazujejo ponudbo in vzdušje burger restavracije.",
      },
      {
        images: [
          "/images/gallery/slajs-1.jpg",
          "/images/gallery/slajs-2.jpg",
          "/images/gallery/slajs-3.jpg",
          "/images/gallery/slajs-4.jpg",
          "/images/gallery/slajs-5.jpg",
          "/images/gallery/slajs-6.jpg",
        ],
        title: "Primer: Pinsa & sendvič bar",
        category: "Organsko vodenje omrežij",
        description: "Vizualno privlačne objave za ponudbo pinse in focaccia sendvičev.",
      },
      {
        images: [
          "/images/gallery/dvor-tacen-1.jpg",
          "/images/gallery/dvor-tacen-2.jpg",
          "/images/gallery/dvor-tacen-3.jpg",
          "/images/gallery/dvor-tacen-4.jpg",
          "/images/gallery/dvor-tacen-5.jpg",
          "/images/gallery/dvor-tacen-6.jpg",
        ],
        title: "Primer: Restavracija & prenočišče",
        category: "Organsko vodenje omrežij",
        description: "Vodenje družbenih omrežij za restavracijo z gostinsko ponudbo in prenočitvami.",
      },
    ],
  },
  about: {
    eyebrow: "O nas",
    title: "Ekipa za video, marketing in digitalno rast.",
    paragraphs: [
      "LVX Experience je studio, ki se ukvarja z video produkcijo, marketingom na družbenih omrežjih, organskim vodenjem profilov, izdelavo spletnih strani in Google SEO.",
      "Verjamemo, da dobra vsebina in jasna digitalna strategija znamki pomagata zrasti — zato povezujemo kreativno produkcijo s podatkovno podprtim marketingom.",
      "Vsak projekt začnemo z jasnim briefom in ga peljemo skozi ves proces, od ideje do objave in optimizacije rezultatov.",
    ],
    values: [
      { title: "Kreativnost", description: "Vsak video in vsaka objava ima svojo zgodbo." },
      { title: "Rezultati", description: "Merimo uspeh s podatki, ne le z všečki." },
      { title: "Zanesljivost", description: "Držimo dogovorjene roke in redno poročamo o napredku." },
    ],
  },
  contact: {
    eyebrow: "Kontakt · 2026",
    title: "Imate projekt v mislih? Pogovoriva se.",
    intro:
      "Pišite nam o vaši znamki in ciljih — v nekaj dneh se vam oglasimo s predlogom sodelovanja.",
    email: "info@lvxexperience.com",
    location: "Slovenija",
    social: [
      { label: "Instagram", href: "https://www.instagram.com/" },
      { label: "Facebook", href: "https://www.facebook.com/" },
      { label: "YouTube", href: "https://www.youtube.com/" },
    ],
    form: {
      name: "Ime in priimek",
      email: "E-poštni naslov",
      message: "Sporočilo",
      messagePlaceholder: "Povejte nam nekaj o vašem projektu…",
      submit: "Pošlji povpraševanje",
      note: "Sporočilo se odpre v vašem e-poštnem programu, naslovljeno na LVX Experience.",
    },
  },
  footer: {
    tagline: "Video produkcija, marketing in digitalna rast.",
    rights: "Vse pravice pridržane.",
  },
};
