-- Profili uporabnikov (razširi auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  vloga text check (vloga in ('prodajalec', 'charter', 'oba')) not null default 'prodajalec',
  ime text,
  opis text,
  telefon text,
  spletna_stran text,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Javni bralni dostop - profili" on profiles for select using (true);
create policy "Uredi svoj profil" on profiles for update using (auth.uid() = id);
create policy "Vstavi profil" on profiles for insert with check (auth.uid() = id);

-- Samodejno ustvari profil ob registraciji
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, vloga, ime)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'vloga', 'prodajalec'),
    new.raw_user_meta_data->>'ime'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Plovila
create table plovila (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  opis text,
  cena decimal not null,
  letnik integer,
  dolzina_m decimal,
  tip text check (tip in ('jadrnica', 'motorni', 'gumenjak', 'katamaran', 'jet', 'drugo')) not null,
  tip_oglasa text check (tip_oglasa in ('prodaja', 'najem')) not null default 'prodaja',
  stanje text check (stanje in ('odlično', 'dobro', 'potrebuje popravilo')),
  lokacija text,
  kontakt_email text,
  kontakt_tel text,
  slike text[],
  model_3d_url text,
  oprema jsonb default '{}',
  potrjeno boolean default false,
  user_id uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

-- Novice kategorije
create table novice_kategorije (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  slug text unique not null,
  barva text
);

-- Novice
create table novice (
  id uuid primary key default gen_random_uuid(),
  naslov text not null,
  vsebina text not null,
  povzetek text,
  slika_url text,
  slug text unique not null,
  avtor text,
  kategorija_id uuid references novice_kategorije(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Tagi
create table novice_tagi (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  slug text unique not null
);

-- Many-to-many: novice <-> tagi
create table novice_tagi_rel (
  novica_id uuid references novice(id) on delete cascade,
  tag_id uuid references novice_tagi(id) on delete cascade,
  primary key (novica_id, tag_id)
);

-- Komentarji
create table komentarji (
  id uuid primary key default gen_random_uuid(),
  novica_id uuid references novice(id) on delete cascade,
  ime text not null,
  email text not null,
  vsebina text not null,
  potrjen boolean default false,
  created_at timestamptz default now()
);

-- Oprema opcije
create table oprema_moznosti (
  id uuid primary key default gen_random_uuid(),
  kategorija text check (kategorija in ('navigacija', 'varnost', 'udobje', 'motor')) not null,
  naziv text not null,
  ikona text
);

-- Skiperji profili
create table skiperji (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  ime text not null,
  lokacija text not null,
  izkusnje_let integer not null default 0,
  jeziki text[] default '{}',
  certifikati text[] default '{}',
  tip_plovila text[] default '{}',
  opis text,
  cena_dan decimal,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Sporočila (chat)
create table messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Ocene
create table ratings (
  id uuid primary key default gen_random_uuid(),
  rater_id uuid references auth.users on delete cascade not null,
  rated_id uuid not null,
  rated_type text check (rated_type in ('charter', 'skipper')) not null,
  score integer check (score >= 1 and score <= 5) not null,
  komentar text,
  created_at timestamptz default now(),
  unique (rater_id, rated_id, rated_type)
);

-- Točke na zemljevidu
create table zemljevid_tocke (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  tip text check (tip in ('marina', 'otok', 'restavracija', 'nevarno')) not null,
  lat decimal not null,
  lng decimal not null,
  opis text,
  link text,
  created_at timestamptz default now()
);

-- Oglaševalski bannerji
create table bannerji (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  slika_url text,
  link_url text,
  pozicija text not null,
  dimenzije text,
  aktiven boolean default true,
  created_at timestamptz default now()
);

-- RLS politike
alter table plovila enable row level security;
alter table novice enable row level security;
alter table novice_kategorije enable row level security;
alter table novice_tagi enable row level security;
alter table novice_tagi_rel enable row level security;
alter table komentarji enable row level security;
alter table oprema_moznosti enable row level security;

-- Javni bralni dostop
create policy "Javni bralni dostop - plovila" on plovila for select using (potrjeno = true);
create policy "Javni bralni dostop - novice" on novice for select using (published_at is not null);
create policy "Javni bralni dostop - kategorije" on novice_kategorije for select using (true);
create policy "Javni bralni dostop - tagi" on novice_tagi for select using (true);
create policy "Javni bralni dostop - tagi rel" on novice_tagi_rel for select using (true);
create policy "Javni bralni dostop - komentarji" on komentarji for select using (potrjen = true);
create policy "Javni bralni dostop - oprema" on oprema_moznosti for select using (true);

-- Prijavljeni uporabniki lahko dodajo plovilo
create policy "Dodaj plovilo" on plovila for insert with check (auth.uid() = user_id);
create policy "Uredi svoje plovilo" on plovila for update using (auth.uid() = user_id);

-- Komentarji - kdorkoli lahko doda (brez registracije)
create policy "Dodaj komentar" on komentarji for insert with check (true);

-- Skiperji RLS
alter table skiperji enable row level security;
create policy "Javni bralni dostop - skiperji" on skiperji for select using (true);
create policy "Uredi svoj skipper profil" on skiperji for update using (auth.uid() = user_id);
create policy "Vstavi skipper profil" on skiperji for insert with check (auth.uid() = user_id);

-- Messages RLS
alter table messages enable row level security;
create policy "Beri svoja sporocila" on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Posji sporocilo" on messages for insert with check (auth.uid() = sender_id);
create policy "Oznaci prebrano" on messages for update using (auth.uid() = receiver_id);

-- Ratings RLS
alter table ratings enable row level security;
create policy "Javni bralni dostop - ratings" on ratings for select using (true);
create policy "Dodaj oceno" on ratings for insert with check (auth.uid() = rater_id);

-- Zemljevid RLS (javni bralni dostop, samo admin piše)
alter table zemljevid_tocke enable row level security;
create policy "Javni bralni dostop - zemljevid" on zemljevid_tocke for select using (true);

-- Bannerji RLS (javni bralni dostop)
alter table bannerji enable row level security;
create policy "Javni bralni dostop - bannerji" on bannerji for select using (aktiven = true);

-- Seed: začetne kategorije
insert into novice_kategorije (naziv, slug, barva) values
  ('Novosti na trgu', 'novosti', '#0c2340'),
  ('Nasveti za kupce', 'nasveti', '#1e3a5f'),
  ('Vzdrževano plovilo', 'vzdrzevanje', '#c9a84c'),
  ('Eventi & regaté', 'eventi', '#2e7d32'),
  ('Zakonodaja & dovoljenja', 'zakonodaja', '#6a1b9a');

-- Povpraševanja (inquiry form submissions)
create table povprasevanja (
  id uuid primary key default gen_random_uuid(),
  tip text check (tip in ('charter', 'skipper', 'plovilo')) not null,
  target_id text not null,
  ime text not null,
  email text not null,
  telefon text,
  termin text,
  sporocilo text not null,
  created_at timestamptz default now()
);

alter table povprasevanja enable row level security;
create policy "Kdorkoli lahko doda povprasevanje" on povprasevanja for insert with check (true);
create policy "Samo admin bere povprasevanja" on povprasevanja for select using (false);

-- Seed: začetne oprema opcije
insert into oprema_moznosti (kategorija, naziv, ikona) values
  ('navigacija', 'GPS / Chartplotter', 'map-pin'),
  ('navigacija', 'Radar', 'radio'),
  ('navigacija', 'VHF radio', 'radio-tower'),
  ('navigacija', 'Autopilot', 'navigation'),
  ('varnost', 'Rešilni jopiči', 'life-buoy'),
  ('varnost', 'Epirb', 'alert-triangle'),
  ('varnost', 'Ognjegasnik', 'flame'),
  ('varnost', 'Pnevmatični čoln', 'anchor'),
  ('udobje', 'Klimatska naprava', 'wind'),
  ('udobje', 'Generator', 'zap'),
  ('udobje', 'Hladilnik', 'thermometer'),
  ('udobje', 'Tuš / kopalnica', 'droplets'),
  ('motor', 'Zunajbordni motor', 'cog'),
  ('motor', 'Vgradni motor', 'settings'),
  ('motor', 'Samodejni vzvratni tok', 'refresh-cw');

-- ═══════════════════════════════════════════════════════════════════
-- ADMIN & NAROČNINE — dodatek
-- ═══════════════════════════════════════════════════════════════════

-- Admin zastavica na profilih
alter table profiles add column if not exists is_admin boolean default false;

-- Ko je Supabase aktiven, postavi admin:
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'matej.skulj10@gmail.com');

-- Admin policies za profiles
create policy "Admin bere vse profile" on profiles for select using (
  exists (select 1 from profiles p2 where p2.id = auth.uid() and p2.is_admin = true)
);
create policy "Admin ureja profile" on profiles for update using (
  exists (select 1 from profiles p2 where p2.id = auth.uid() and p2.is_admin = true)
);

-- Naročnine charterjev
create table charter_narocnine (
  id uuid primary key default gen_random_uuid(),
  charter_id text not null,
  plan text check (plan in ('free', 'trial', 'basic', 'pro')) default 'free',
  trial_zacetek timestamptz,
  trial_konec timestamptz,
  brezplacni_meseci integer default 0,
  podelil_admin_id uuid references auth.users on delete set null,
  opomba text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table charter_narocnine enable row level security;

create policy "Admin bere narocnine" on charter_narocnine for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin vstavi narocnine" on charter_narocnine for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin posodablja narocnine" on charter_narocnine for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Charter bere svojo narocnino" on charter_narocnine for select using (
  charter_id = auth.uid()::text
);
