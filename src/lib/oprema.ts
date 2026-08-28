// Enoten vir resnice za opremo plovila — uporablja ga obrazec za
// dodajanje/urejanje oglasa (checkboxi) IN stran s podrobnostmi
// plovila (prikaz oznak). Prej sta imela ločeno, neusklajeno kopijo,
// zato so se na strani plovila prikazovali surovi ključi namesto
// oznak (npr. "bow_thruster" namesto "Bow thruster").

export const opremaKategorije = [
  {
    naziv: 'Navigacija',
    opcije: [
      { kljuc: 'gps', label: 'GPS / Chartplotter' },
      { kljuc: 'radar', label: 'Radar' },
      { kljuc: 'vhf', label: 'VHF radio' },
      { kljuc: 'autopilot', label: 'Autopilot' },
      { kljuc: 'ploter', label: 'Ploter' },
      { kljuc: 'ais', label: 'AIS' },
    ],
  },
  {
    naziv: 'Motor',
    opcije: [
      { kljuc: 'generator', label: 'Generator' },
      { kljuc: 'bow_thruster', label: 'Bow thruster' },
    ],
  },
  {
    naziv: 'Udobje',
    opcije: [
      { kljuc: 'klima', label: 'Klimatska naprava' },
      { kljuc: 'ogrevanje', label: 'Ogrevanje' },
      { kljuc: 'hladilnik', label: 'Hladilnik' },
      { kljuc: 'pecica', label: 'Pečica' },
      { kljuc: 'mikrovalovna', label: 'Mikrovalovna' },
    ],
  },
  {
    naziv: 'Varnost',
    opcije: [
      { kljuc: 'epirb', label: 'EPIRB' },
      { kljuc: 'life_raft', label: 'Life raft' },
      { kljuc: 'jopici', label: 'Rešilni jopiči' },
      { kljuc: 'signalne_luce', label: 'Signalne luči' },
    ],
  },
  {
    naziv: 'Dodatno',
    opcije: [
      { kljuc: 'rib', label: 'RIB / Gumenjak' },
      { kljuc: 'elektricni_vitli', label: 'Električni vitli' },
      { kljuc: 'solarni', label: 'Solarni paneli' },
      { kljuc: 'watermaker', label: 'Watermaker' },
    ],
  },
] as const

export const opremaLabele: Record<string, string> = Object.fromEntries(
  opremaKategorije.flatMap((kat) => kat.opcije.map((o) => [o.kljuc, o.label]))
)
