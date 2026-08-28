// Vse strani so že od prej preklopljene na resnične podatke iz Supabase.
// Ta datoteka zdaj hrani samo še kurirane slike (Unsplash), za katere
// (še) ni polja v bazi — vse ostalo (mockPlovila, mockCharterji,
// mockSkiperji, mockNovice, mockPromocije, mockRezervniDeli ...) je bilo
// odstranjeno, ker ni imelo več niti enega uporabnika v kodi.

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
