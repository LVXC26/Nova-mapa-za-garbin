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
alter table profiles add column if not exists notifikacije jsonb default '{}';

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

-- ═══════════════════════════════════════════════════════════════════
-- STORAGE — slike plovil
-- ═══════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('plovila-slike', 'plovila-slike', true)
on conflict (id) do nothing;

create policy "Javni bralni dostop - slike plovil" on storage.objects
  for select using (bucket_id = 'plovila-slike');

create policy "Prijavljeni nalagajo slike v svojo mapo" on storage.objects
  for insert with check (
    bucket_id = 'plovila-slike'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Prijavljeni brisejo svoje slike" on storage.objects
  for delete using (
    bucket_id = 'plovila-slike'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ═══════════════════════════════════════════════════════════════════
-- PLOVILA — manjkajoči stolpci (uporablja jih dodaj-plovilo forma)
-- ═══════════════════════════════════════════════════════════════════

alter table plovila add column if not exists promoted boolean default false;
alter table plovila add column if not exists prodano boolean default false;
alter table plovila add column if not exists cena_na_zahtevo boolean default false;
alter table plovila add column if not exists urgentno boolean default false;
alter table plovila add column if not exists updated_at timestamptz default now();

-- ═══════════════════════════════════════════════════════════════════
-- SKIPERJI — dodatni stolpci za javni profil
-- ═══════════════════════════════════════════════════════════════════

alter table skiperji add column if not exists ocena numeric not null default 0;
alter table skiperji add column if not exists st_ocen integer not null default 0;
alter table skiperji add column if not exists tip_skiper text check (tip_skiper in ('samostojni', 'agencija')) default 'samostojni';
alter table skiperji add column if not exists naziv_agencije text;
alter table skiperji add column if not exists ekipa jsonb default '[]';

-- En skipper profil na uporabnika (potrebno za upsert po user_id v dashboard/profil)
alter table skiperji add constraint skiperji_user_id_key unique (user_id);

-- ═══════════════════════════════════════════════════════════════════
-- CHARTERJI — profili charter podjetij/zasebnikov
-- ═══════════════════════════════════════════════════════════════════

create table charterji (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  naziv text not null,
  opis text,
  tip text check (tip in ('podjetje', 'zasebnik')) not null default 'podjetje',
  lokacija text not null,
  kontakt_email text not null,
  kontakt_tel text not null,
  spletna_stran text,
  ocena numeric not null default 0,
  st_plovil integer not null default 0,
  max_oseb integer not null default 0,
  max_dolzina_m numeric not null default 0,
  tip_plovila text[] default '{}',
  verified boolean default false,
  created_at timestamptz default now()
);

alter table charterji enable row level security;
create policy "Javni bralni dostop - charterji" on charterji for select using (true);
create policy "Uredi svoj charter profil" on charterji for update using (auth.uid() = user_id);
create policy "Vstavi charter profil" on charterji for insert with check (auth.uid() = user_id);

-- En charter profil na uporabnika (potrebno za upsert po user_id v dashboard/profil)
alter table charterji add constraint charterji_user_id_key unique (user_id);

-- ═══════════════════════════════════════════════════════════════════
-- ADMIN — dostop do nepotrjenih/neverificiranih vnosov
-- ═══════════════════════════════════════════════════════════════════

-- Plovila nimajo admin select/update politike — brez tega admin ne vidi
-- oglasov, ki čakajo na odobritev (Javni bralni dostop kaže samo potrjeno = true)
create policy "Admin bere vsa plovila" on plovila for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin ureja plovila" on plovila for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Lastnik mora videti tudi svoje nepotrjene oglase (Javni bralni dostop
-- kaže samo potrjeno = true, zato "Moja plovila"/urejanje brez te politike ne dela)
create policy "Lastnik bere svoja plovila" on plovila for select using (auth.uid() = user_id);

create policy "Admin ureja skiperje" on skiperji for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Admin ureja charterje" on charterji for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ═══════════════════════════════════════════════════════════════════
-- PRILJUBLJENI — shranjena plovila uporabnika
-- ═══════════════════════════════════════════════════════════════════

create table priljubljeni (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  plovilo_id uuid references plovila on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, plovilo_id)
);

alter table priljubljeni enable row level security;
create policy "Uporabnik bere svoje priljubljene" on priljubljeni for select using (auth.uid() = user_id);
create policy "Uporabnik doda priljubljeno" on priljubljeni for insert with check (auth.uid() = user_id);
create policy "Uporabnik odstrani priljubljeno" on priljubljeni for delete using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- REZERVNI DELI — tržnica rezervnih delov
-- ═══════════════════════════════════════════════════════════════════

create table rezervni_deli (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  opis text,
  cena decimal not null,
  stanje text check (stanje in ('novo', 'rabljeno')) not null default 'rabljeno',
  kategorija text check (kategorija in ('motor', 'elektronika', 'jadra', 'sidrna oprema', 'trup', 'drugo')) not null default 'drugo',
  tip_plovila text,
  slika_url text,
  kontakt_email text,
  kontakt_tel text,
  lokacija text,
  potrjeno boolean default false,
  user_id uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

alter table rezervni_deli enable row level security;
create policy "Javni bralni dostop - rezervni deli" on rezervni_deli for select using (potrjeno = true);
create policy "Dodaj rezervni del" on rezervni_deli for insert with check (auth.uid() = user_id);
create policy "Uredi svoj rezervni del" on rezervni_deli for update using (auth.uid() = user_id);
create policy "Lastnik bere svoje rezervne dele" on rezervni_deli for select using (auth.uid() = user_id);
create policy "Admin bere vse rezervne dele" on rezervni_deli for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin ureja rezervne dele" on rezervni_deli for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ═══════════════════════════════════════════════════════════════════
-- PROMOCIJE — admin-urejane promocijske akcije
-- ═══════════════════════════════════════════════════════════════════

create table promocije (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  opis text,
  slika_url text,
  popust integer,
  tip text check (tip in ('popust', 'featured', 'sezonska', 'paket')) not null default 'popust',
  veljavnost_do date,
  plovilo_id uuid references plovila on delete cascade,
  barva text,
  aktivna boolean default true,
  created_at timestamptz default now()
);

alter table promocije enable row level security;
create policy "Javni bralni dostop - promocije" on promocije for select using (aktivna = true);
create policy "Admin bere vse promocije" on promocije for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin ureja promocije" on promocije for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin posodablja promocije" on promocije for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin brise promocije" on promocije for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ═══════════════════════════════════════════════════════════════════
-- ADMIN — dodatne politike za CMS (novice, bannerji, zemljevid, uporabniki)
-- ═══════════════════════════════════════════════════════════════════

create policy "Admin bere vse novice" on novice for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin doda novico" on novice for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin ureja novico" on novice for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin brise novico" on novice for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Admin bere vse bannerje" on bannerji for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin doda banner" on bannerji for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin ureja banner" on bannerji for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin brise banner" on bannerji for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Admin doda tocko na zemljevid" on zemljevid_tocke for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin ureja tocko na zemljevidu" on zemljevid_tocke for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin brise tocko z zemljevida" on zemljevid_tocke for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Admin ureja vlogo uporabnika" on profiles for update using (
  exists (select 1 from profiles p2 where p2.id = auth.uid() and p2.is_admin = true)
);

-- ═══════════════════════════════════════════════════════════════════
-- POVPRASEVANJA — popravki: admin jih ni mogel prebrati (using(false)
-- je blokiral čisto vse), tip ni dopuščal splošnega kontakta ali
-- prijav "postani partner"/"postani skipper"
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Samo admin bere povprasevanja" on povprasevanja;
create policy "Admin bere povprasevanja" on povprasevanja for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

alter table povprasevanja drop constraint if exists povprasevanja_tip_check;
alter table povprasevanja add constraint povprasevanja_tip_check
  check (tip in ('charter', 'skipper', 'plovilo', 'kontakt', 'prijava-charter', 'prijava-skipper'));

-- ═══════════════════════════════════════════════════════════════════
-- SOCIALNI FEED — objave na profilih skiperjev/charterjev
-- ═══════════════════════════════════════════════════════════════════

alter table profiles add column if not exists dovoli_tuje_objave boolean default true;
alter table profiles add column if not exists avto_odobritev_objav boolean default false;

create table objave (
  id uuid primary key default gen_random_uuid(),
  lastnik_user_id uuid references auth.users on delete cascade not null,
  avtor_user_id uuid references auth.users on delete cascade not null,
  avtor_ime text not null,
  avtor_vloga text,
  tip text check (tip in ('objava', 'potovanje')) not null default 'objava',
  vsebina text not null,
  lokacija text,
  plovilo text,
  odobrena boolean not null default false,
  created_at timestamptz default now()
);

alter table objave enable row level security;
create policy "Javni bralni dostop - odobrene objave" on objave for select using (odobrena = true);
create policy "Lastnik bere vse svoje objave" on objave for select using (auth.uid() = lastnik_user_id);
create policy "Prijavljeni dodajo objavo" on objave for insert with check (auth.uid() = avtor_user_id);
create policy "Lastnik ureja objave na svojem profilu" on objave for update using (auth.uid() = lastnik_user_id);
create policy "Lastnik brise objave na svojem profilu" on objave for delete using (auth.uid() = lastnik_user_id);
create policy "Avtor brise svojo objavo" on objave for delete using (auth.uid() = avtor_user_id);

create table objava_likes (
  id uuid primary key default gen_random_uuid(),
  objava_id uuid references objave on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique (objava_id, user_id)
);

alter table objava_likes enable row level security;
create policy "Javni bralni dostop - likes" on objava_likes for select using (true);
create policy "Prijavljeni dodajo like" on objava_likes for insert with check (auth.uid() = user_id);
create policy "Prijavljeni odstranijo svoj like" on objava_likes for delete using (auth.uid() = user_id);

create table objava_komentarji (
  id uuid primary key default gen_random_uuid(),
  objava_id uuid references objave on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  ime text not null,
  vsebina text not null,
  created_at timestamptz default now()
);

alter table objava_komentarji enable row level security;
create policy "Javni bralni dostop - komentarji objav" on objava_komentarji for select using (true);
create policy "Prijavljeni dodajo komentar" on objava_komentarji for insert with check (auth.uid() = user_id);
create policy "Prijavljeni brisejo svoj komentar" on objava_komentarji for delete using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- PLAČLJIVA PROMOCIJA OGLASOV — Stripe Checkout
-- ═══════════════════════════════════════════════════════════════════

alter table plovila add column if not exists promoted_do timestamptz;

create table promocija_narocila (
  id uuid primary key default gen_random_uuid(),
  plovilo_id uuid references plovila on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  stripe_session_id text unique not null,
  znesek_cent integer not null,
  valuta text not null default 'eur',
  dni_promocije integer not null default 30,
  status text check (status in ('pending', 'placano', 'preklicano')) not null default 'pending',
  created_at timestamptz default now(),
  placano_at timestamptz
);

alter table promocija_narocila enable row level security;
create policy "Lastnik bere svoja narocila" on promocija_narocila for select using (auth.uid() = user_id);
create policy "Admin bere vsa narocila promocij" on promocija_narocila for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
-- Uporabnik lahko ustvari svoje (pending) naročilo pred plačilom, a ga ne more
-- sam potrditi kot plačanega — status na "placano" postavi izključno webhook
-- (service role), ki obide RLS, zato tu ni client-side update politike.
create policy "Uporabnik ustvari svoje narocilo" on promocija_narocila for insert with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- LASTNIKI BEREJO SVOJA POVPRAŠEVANJA (dashboard šteje samo svoja, ne vsa)
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Charter bere svoja povprasevanja" on povprasevanja;
create policy "Charter bere svoja povprasevanja" on povprasevanja for select using (
  tip = 'charter' and target_id in (select id::text from charterji where user_id = auth.uid())
);
drop policy if exists "Skipper bere svoja povprasevanja" on povprasevanja;
create policy "Skipper bere svoja povprasevanja" on povprasevanja for select using (
  tip = 'skipper' and target_id in (select id::text from skiperji where user_id = auth.uid())
);
drop policy if exists "Prodajalec bere povprasevanja za svoja plovila" on povprasevanja;
create policy "Prodajalec bere povprasevanja za svoja plovila" on povprasevanja for select using (
  tip = 'plovilo' and target_id in (select id::text from plovila where user_id = auth.uid())
);

-- ═══════════════════════════════════════════════════════════════════
-- LASTNIK LAHKO IZBRIŠE SVOJE PLOVILO (prej ni obstajala nobena delete politika)
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Lastnik brise svoje plovilo" on plovila;
create policy "Lastnik brise svoje plovilo" on plovila for delete using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: prepreči, da bi si uporabnik sam podelil admin
-- dostop ali "verified" značko prek "Uredi svoj profil" politike.
-- RLS politika sama po sebi ne omeji, KATERE stolpce sme uporabnik
-- spremeniti — brez tega bi lahko vsak prijavljen uporabnik prek
-- Supabase klienta v konzoli brskalnika pognal:
--   supabase.from('profiles').update({ is_admin: true }).eq('id', svoj_id)
-- in si tako podelil admin dostop. Ta sprožilec to zavrne na nivoju baze,
-- ne glede na to, kaj odjemalec pošlje.
-- ═══════════════════════════════════════════════════════════════════

create or replace function prevent_self_privilege_escalation()
returns trigger as $$
begin
  -- auth.uid() je NULL pri service-role klicih (npr. /api/admin/uporabniki, ki
  -- admin status že preveri v aplikacijski kodi) — te vedno spustimo skozi.
  -- Za vsako zahtevo z resnično prijavljenim uporabnikom (auth.uid() ni null)
  -- pa dovolimo teh dveh polj samo, če je ta uporabnik že admin. Pokrijemo
  -- tudi INSERT — brez tega bi lahko nekdo poslal is_admin/verified že ob
  -- prvem vstavljanju vrstice, ne samo prek kasnejšega update-a.
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.is_admin := false;
      new.verified := false;
    else
      new.is_admin := old.is_admin;
      new.verified := old.verified;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_self_privilege_escalation on profiles;
create trigger trg_prevent_self_privilege_escalation
before insert or update on profiles
for each row execute function prevent_self_privilege_escalation();

-- ═══════════════════════════════════════════════════════════════════
-- ISTI VARNOSTNI POPRAVEK ZA CHARTERJI IN SKIPERJI: lastnik lahko ureja
-- svoj profil (naziv, opis, kontakt ...), ne sme pa si sam podeliti
-- "verified" značke ali ponarediti svoje ocene (ocena/st_ocen) — to
-- sme spremeniti samo admin (RLS "Admin ureja charterje/skiperje" ali
-- service-role klici, kjer je auth.uid() prazen).
-- ═══════════════════════════════════════════════════════════════════

create or replace function prevent_charter_self_escalation()
returns trigger as $$
begin
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.verified := false;
      new.ocena := 0;
    else
      new.verified := old.verified;
      new.ocena := old.ocena;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_charter_self_escalation on charterji;
create trigger trg_prevent_charter_self_escalation
before insert or update on charterji
for each row execute function prevent_charter_self_escalation();

create or replace function prevent_skipper_self_escalation()
returns trigger as $$
begin
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.verified := false;
      new.ocena := 0;
      new.st_ocen := 0;
    else
      new.verified := old.verified;
      new.ocena := old.ocena;
      new.st_ocen := old.st_ocen;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_skipper_self_escalation on skiperji;
create trigger trg_prevent_skipper_self_escalation
before insert or update on skiperji
for each row execute function prevent_skipper_self_escalation();

-- Isto za plovila: lastnik ne sme sam sebi vklopiti plačljive promocije
-- (promoted/promoted_do) mimo Stripe plačila — to sme nastaviti samo
-- Stripe webhook (service-role, auth.uid() prazen) ali admin. Pokrijemo
-- tudi INSERT, ker bi sicer lahko poslal promoted:true že ob objavi oglasa.
create or replace function prevent_plovilo_self_promotion()
returns trigger as $$
begin
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.promoted := false;
      new.promoted_do := null;
    else
      new.promoted := old.promoted;
      new.promoted_do := old.promoted_do;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_plovilo_self_promotion on plovila;
create trigger trg_prevent_plovilo_self_promotion
before insert or update on plovila
for each row execute function prevent_plovilo_self_promotion();

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: "Javni bralni dostop - profili" (using(true)) je
-- razkrival VSA polja vsakega uporabnika komurkoli, ki bi neposredno
-- poklical Supabase API (mimo aplikacije) — vključno s telefonsko
-- številko, opisom in spletno stranjo vsakega registriranega prodajalca.
-- Aplikacija sama nikoli ne bere tujih profilov v celoti (samo id/ime
-- in par nastavitev), zato ustvarimo ozek javni pogled samo s temi
-- varnimi polji, osnovno tabelo pa omejimo na lastnika (+ admin).
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Javni bralni dostop - profili" on profiles;
drop policy if exists "Lastnik bere svoj profil" on profiles;
create policy "Lastnik bere svoj profil" on profiles for select using (auth.uid() = id);

create or replace view public_profiles
with (security_invoker = false)
as select id, ime, vloga, verified, dovoli_tuje_objave, created_at from profiles;

grant select on public_profiles to anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: profilni lastnik (npr. charter podjetje) je prek
-- "Lastnik ureja objave na svojem profilu" (brez omejitve stolpcev)
-- lahko urejal VSEBINO objav, ki jih je napisal nekdo DRUG na njihovem
-- "zidu" — torej bi lahko potvoril, kaj je stranka dejansko napisala,
-- medtem ko bi ostalo prikazano pod imenom te stranke. Aplikacija to
-- politiko uporablja samo za "odobri objavo" (odobrena), zato ostalo
-- zaklenemo, razen če ureja svojo LASTNO objavo.
-- ═══════════════════════════════════════════════════════════════════

create or replace function prevent_objava_content_tampering()
returns trigger as $$
begin
  if auth.uid() is not null
     and auth.uid() <> old.avtor_user_id
     and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    new.vsebina := old.vsebina;
    new.lokacija := old.lokacija;
    new.plovilo := old.plovilo;
    new.avtor_ime := old.avtor_ime;
    new.avtor_vloga := old.avtor_vloga;
    new.avtor_user_id := old.avtor_user_id;
    new.lastnik_user_id := old.lastnik_user_id;
    new.tip := old.tip;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_objava_content_tampering on objave;
create trigger trg_prevent_objava_content_tampering
before update on objave
for each row execute function prevent_objava_content_tampering();

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: prejemnik sporočila je prek "Oznaci prebrano"
-- (brez omejitve stolpcev) lahko spremenil VSEBINO prejetega sporočila,
-- ne samo "read" — kar bi omogočilo potvarjanje zgodovine pogovora.
-- ═══════════════════════════════════════════════════════════════════

create or replace function prevent_message_content_tampering()
returns trigger as $$
begin
  if auth.uid() is not null and auth.uid() <> old.sender_id then
    new.content := old.content;
    new.sender_id := old.sender_id;
    new.receiver_id := old.receiver_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_message_content_tampering on messages;
create trigger trg_prevent_message_content_tampering
before update on messages
for each row execute function prevent_message_content_tampering();

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: nič ni preprečevalo, da bi charter/skiper sam
-- sebi napisal 5-zvezdično oceno (rated_id = svoj lasten charter/
-- skipper profil) in si tako ponaredil povprečno oceno.
-- ═══════════════════════════════════════════════════════════════════

create or replace function prevent_self_rating()
returns trigger as $$
begin
  if new.rated_type = 'skipper' and exists (
    select 1 from skiperji where id = new.rated_id and user_id = new.rater_id
  ) then
    raise exception 'Ne moreš oceniti samega sebe.';
  end if;
  if new.rated_type = 'charter' and exists (
    select 1 from charterji where id = new.rated_id and user_id = new.rater_id
  ) then
    raise exception 'Ne moreš oceniti samega sebe.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_self_rating on ratings;
create trigger trg_prevent_self_rating
before insert on ratings
for each row execute function prevent_self_rating();

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: omejitev tipa/velikosti slike (8 MB, samo slike)
-- je obstajala samo v JavaScript kodi obrazca — kdorkoli bi lahko prek
-- konzole poklical storage upload neposredno in naložil poljubno
-- (izvršljivo/ogromno) datoteko. To zdaj uveljavimo na nivoju bucketa,
-- česar odjemalec ne more zaobiti.
-- ═══════════════════════════════════════════════════════════════════

update storage.buckets
set file_size_limit = 8388608, -- 8 MB, usklajeno z MAX_VELIKOST_MB v kodi
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'plovila-slike';

-- ═══════════════════════════════════════════════════════════════════
-- KRITIČEN POPRAVEK: profiles_vloga_check je dovoljeval samo
-- 'prodajalec', 'charter', 'oba' — 'skipper' in 'kupec' (obe možnosti
-- na registracijskem obrazcu) sta bila torej OD NEKDAJ blokirana.
-- Vsak, ki se je poskusil registrirati kot Skipper ali Kupec/Najemnik,
-- je dobil "Database error saving new user" in registracija ni uspela.
-- ═══════════════════════════════════════════════════════════════════

alter table profiles drop constraint if exists profiles_vloga_check;
alter table profiles add constraint profiles_vloga_check
  check (vloga in ('prodajalec', 'charter', 'skipper', 'kupec', 'oba'));

-- ═══════════════════════════════════════════════════════════════════
-- POPRAVEK: skiperji.ocena / st_ocen (in charterji.ocena / st_ocen) se
-- ob oddaji ocene nikoli nista posodobila. Stran s podrobnostmi
-- skiperja si oceno izračuna sama iz "ratings" tabele, zato je tam
-- videti pravilno — a seznam /skiperji in vsa druga mesta, ki berejo
-- neposredno stolpec skiperji.ocena, so vedno prikazovala 0.0 ★ (0),
-- ne glede na to, koliko resničnih ocen je skipper prejel.
-- Trigger zdaj po vsaki spremembi v "ratings" preračuna in shrani
-- pravo povprečje + število ocen na ciljni skiperji/charterji vrstici.
-- UPDATE spodaj enkratno "poravna" že obstoječe ocene za nazaj.
-- ═══════════════════════════════════════════════════════════════════

-- charterji nikoli ni dobil st_ocen stolpca (skiperji ga je dobil prej
-- v tej datoteki) — brez njega bi spodnji trigger padel na prvi oceni
-- tipa 'charter'.
alter table charterji add column if not exists st_ocen integer not null default 0;

-- ═══════════════════════════════════════════════════════════════════
-- KRITIČEN POPRAVEK: trigger spodaj (posodobi_oceno_po_oceni) ob vsaki
-- oddani oceni poskusi posodobiti skiperji/charterji.ocena+st_ocen —
-- ampak to UPDATE ujameta prevent_skipper_self_escalation in
-- prevent_charter_self_escalation (zaščita pred samo-ocenjevanjem), ki
-- ne ločita "napadalec ročno spreminja svojo oceno prek konzole" od
-- "to je notranji preračun po pravi oceni stranke" — obakrat prepišeta
-- nazaj na staro vrednost. Ocene bi se torej NIKOLI ne posodobile za
-- normalno stranko, ki odda oceno. Popravimo obe funkciji, da s
-- pg_trigger_depth() prepoznata razliko: neposreden UPDATE od zunaj se
-- zgodi na globini 1, medtem ko update, sprožen ZNOTRAJ drugega
-- triggerja (ravno naš primer), teče na globini 2+.
-- ═══════════════════════════════════════════════════════════════════

-- VARNOSTNI POPRAVEK (naknadno odkrito): ta funkcija je ščitila "verified"
-- in "ocena", ni pa nikoli ščitila "st_ocen" (dodan šele zgoraj v tej
-- datoteki, po prvi različici te funkcije) — charter je torej lahko prek
-- konzole (supabase.from('charterji').update({st_ocen: 500})) sam sebi
-- ponaredil poljubno število ocen, do naslednje prave ocene stranke.
-- skiperji.st_ocen je bil ves čas pravilno zaščiten (primerjaj spodnjo
-- funkcijo) — tole samo poravna charterje na isto raven.
create or replace function prevent_charter_self_escalation()
returns trigger as $$
begin
  if pg_trigger_depth() <= 1 and auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.verified := false;
      new.ocena := 0;
      new.st_ocen := 0;
    else
      new.verified := old.verified;
      new.ocena := old.ocena;
      new.st_ocen := old.st_ocen;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function prevent_skipper_self_escalation()
returns trigger as $$
begin
  if pg_trigger_depth() <= 1 and auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.verified := false;
      new.ocena := 0;
      new.st_ocen := 0;
    else
      new.verified := old.verified;
      new.ocena := old.ocena;
      new.st_ocen := old.st_ocen;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function posodobi_oceno_po_oceni()
returns trigger as $$
declare
  ciljni_id uuid := coalesce(new.rated_id, old.rated_id);
  ciljni_tip text := coalesce(new.rated_type, old.rated_type);
  povprecje numeric;
  stevilo integer;
begin
  select coalesce(avg(score), 0), count(*) into povprecje, stevilo
  from ratings
  where rated_id = ciljni_id and rated_type = ciljni_tip;

  if ciljni_tip = 'skipper' then
    update skiperji set ocena = round(povprecje, 2), st_ocen = stevilo where id = ciljni_id;
  elsif ciljni_tip = 'charter' then
    update charterji set ocena = round(povprecje, 2), st_ocen = stevilo where id = ciljni_id;
  end if;

  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_posodobi_oceno_po_oceni on ratings;
create trigger trg_posodobi_oceno_po_oceni
after insert or update or delete on ratings
for each row execute function posodobi_oceno_po_oceni();

-- Enkratna poravnava za nazaj (varno za ponovni zagon — vedno samo
-- prepiše na trenutno pravilno vrednost, izračunano iz ratings).
update skiperji s set
  ocena = coalesce((select round(avg(r.score), 2) from ratings r where r.rated_id = s.id and r.rated_type = 'skipper'), 0),
  st_ocen = coalesce((select count(*) from ratings r where r.rated_id = s.id and r.rated_type = 'skipper'), 0);

update charterji c set
  ocena = coalesce((select round(avg(r.score), 2) from ratings r where r.rated_id = c.id and r.rated_type = 'charter'), 0),
  st_ocen = coalesce((select count(*) from ratings r where r.rated_id = c.id and r.rated_type = 'charter'), 0);

-- ═══════════════════════════════════════════════════════════════════
-- URGENTNA PRODAJA POSTANE PLAČLJIVA (30 €, 30 dni) — po direktorjevi
-- odločitvi. Prej je bil "Urgentna prodaja" brezplačen checkbox pri
-- dodajanju oglasa + brezplačen preklop na "Moja plovila"; oboje je
-- zdaj odstranjeno iz kode. Kupi se prek Stripe, enako kot "Promocija"
-- (glej promocija_narocila / plovila.promoted), samo z novim "tip"
-- stolpcem, da lahko en webhook loči med obema vrstama nakupa.
-- Obstoječi oglasi, ki so urgentno=true dobili brezplačno pred to
-- spremembo, po dogovoru obdržijo status do izteka/prodaje — spodaj
-- jih NE ponastavljam.
-- ═══════════════════════════════════════════════════════════════════

alter table plovila add column if not exists urgentno_do timestamptz;

alter table promocija_narocila add column if not exists tip text
  check (tip in ('promocija', 'urgentno')) not null default 'promocija';

-- ═══════════════════════════════════════════════════════════════════
-- KRITIČEN VARNOSTNI POPRAVEK: "Uredi svoje plovilo" RLS pravilo
-- preverja samo lastništvo VRSTICE (auth.uid() = user_id), ne pa
-- katerih STOLPCEV se sme dotakniti. "promoted"/"promoted_do" je to
-- od nekdaj ščitil trg_prevent_plovilo_self_promotion — ampak
-- "urgentno"/"urgentno_do" NE, ker je bil urgentno prej brezplačen
-- checkbox. Zdaj ko je urgentno plačljiv (30 €), bi lahko kdorkoli
-- prek konzole v brskalniku pognal npr.
--   supabase.from('plovila').update({ urgentno: true }).eq('id', ...)
-- in dobil "Nujno" značko popolnoma brezplačno, mimo Stripe plačila.
-- Star trigger nadomestimo z razširjenim, ki ščiti oba para stolpcev.
-- Webhook (service-role klient) to obide, ker auth.uid() je tam null.
-- ═══════════════════════════════════════════════════════════════════

drop trigger if exists trg_prevent_plovilo_self_promotion on plovila;
drop function if exists prevent_plovilo_self_promotion();

create or replace function prevent_plovilo_self_boost()
returns trigger as $$
begin
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.promoted := false;
      new.promoted_do := null;
      new.urgentno := false;
      new.urgentno_do := null;
    else
      new.promoted := old.promoted;
      new.promoted_do := old.promoted_do;
      new.urgentno := old.urgentno;
      new.urgentno_do := old.urgentno_do;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_plovilo_self_boost on plovila;
create trigger trg_prevent_plovilo_self_boost
before insert or update on plovila
for each row execute function prevent_plovilo_self_boost();

-- ═══════════════════════════════════════════════════════════════════
-- KRITIČEN POPRAVEK: "objave" (Feed) — frontend sam izračuna in pošlje
-- vrednost "odobrena" znotraj insert klica. RLS "Prijavljeni dodajo
-- objavo" preveri samo auth.uid() = avtor_user_id, ne preveri pa niti
-- vrednosti odobrena niti tega, ali lastnik profila sploh dovoljuje
-- tuje objave (dovoli_tuje_objave). Kdorkoli bi torej lahko prek
-- konzole v brskalniku:
--   supabase.from('objave').insert({ lastnik_user_id: '<tuj-profil>',
--     avtor_user_id: '<moj-id>', avtor_ime: 'x', vsebina: 'spam',
--     odobrena: true })
-- objavil karkoli na TUJEM profilu, takoj vidno vsem (odobrena=true),
-- popolnoma mimo lastnikove moderacije — tudi če je lastnik tuje
-- objave popolnoma izklopil. Spodnji trigger prezre, kar pošlje
-- odjemalec, in "odobrena" vedno preračuna iz resničnih podatkov v
-- profiles; ob izklopljenih tujih objavah insert zavrne. Mimogrede
-- popravi tudi to, da "avto_odobritev_objav" nastavitev ni bila nikoli
-- dejansko upoštevana nikjer v kodi (frontend je tuje objave vedno
-- pošiljal kot odobrena=false, ne glede na to nastavitev).
-- ═══════════════════════════════════════════════════════════════════

create or replace function nastavi_odobritev_objave()
returns trigger as $$
declare
  dovoljeno boolean;
  avto_odobri boolean;
begin
  if new.avtor_user_id = new.lastnik_user_id then
    new.odobrena := true;
    return new;
  end if;

  select coalesce(dovoli_tuje_objave, true), coalesce(avto_odobritev_objav, false)
    into dovoljeno, avto_odobri
    from profiles where id = new.lastnik_user_id;

  if dovoljeno is false then
    raise exception 'Lastnik profila ne dovoljuje objav drugih uporabnikov.';
  end if;

  new.odobrena := coalesce(avto_odobri, false);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_nastavi_odobritev_objave on objave;
create trigger trg_nastavi_odobritev_objave
before insert on objave
for each row execute function nastavi_odobritev_objave();

-- ═══════════════════════════════════════════════════════════════════
-- Ista vrsta popravka, dve manjši mesti:
--
-- 1) "komentarji" (komentarji pod novicami) — insert dovoljen popolnoma
--    vsem ("with check (true)"), aplikacija sicer vedno pošlje
--    potrjen:false, a nič ne prepreči, da bi kdo prek konzole poslal
--    potrjen:true in dobil takoj javno viden, neodobren komentar.
--
-- 2) "promocija_narocila" — lastnik lahko vstavi svojo vrstico
--    (insert with check auth.uid()=user_id), polje "status" pa ni
--    zaščiteno. To NE omogoča zastonj urgentno/promoted (to ščiti
--    prevent_plovilo_self_boost na plovila), lahko pa nekdo vstavi
--    lažno "placano" naročilo, ki v adminovem pregledu izgleda kot
--    resnično plačilo, ki ni bilo nikoli obdelano prek Stripe/webhooka.
-- ═══════════════════════════════════════════════════════════════════

create or replace function prisili_nepotrjen_komentar()
returns trigger as $$
begin
  new.potrjen := false;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prisili_nepotrjen_komentar on komentarji;
create trigger trg_prisili_nepotrjen_komentar
before insert on komentarji
for each row execute function prisili_nepotrjen_komentar();

create or replace function prisili_pending_narocilo()
returns trigger as $$
begin
  -- Naročilo lahko na "placano" preklopi samo webhook, in to z UPDATE,
  -- ne INSERT — zato je vsak nov INSERT vedno "pending", brez izjeme.
  new.status := 'pending';
  new.placano_at := null;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prisili_pending_narocilo on promocija_narocila;
create trigger trg_prisili_pending_narocilo
before insert on promocija_narocila
for each row execute function prisili_pending_narocilo();

-- ═══════════════════════════════════════════════════════════════════
-- KOLEDAR ZASEDENOSTI ZA NAJEMNA PLOVILA
-- Charter za vsako svoje plovilo za najem označi termine, ko je plovilo
-- že zasedeno — javno vidno na strani plovila, da stranka pred oddajo
-- povpraševanja vidi, kdaj je prosto.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists plovilo_zasedenost (
  id uuid primary key default gen_random_uuid(),
  plovilo_id uuid references plovila(id) on delete cascade not null,
  datum_od date not null,
  datum_do date not null,
  created_at timestamptz default now(),
  constraint veljaven_datumski_razpon check (datum_do >= datum_od)
);

alter table plovilo_zasedenost enable row level security;

drop policy if exists "Javni bralni dostop - zasedenost" on plovilo_zasedenost;
create policy "Javni bralni dostop - zasedenost" on plovilo_zasedenost for select using (true);

drop policy if exists "Lastnik plovila upravlja zasedenost" on plovilo_zasedenost;
create policy "Lastnik plovila upravlja zasedenost" on plovilo_zasedenost for all
  using (exists (select 1 from plovila where plovila.id = plovilo_zasedenost.plovilo_id and plovila.user_id = auth.uid()))
  with check (exists (select 1 from plovila where plovila.id = plovilo_zasedenost.plovilo_id and plovila.user_id = auth.uid()));

create index if not exists idx_plovilo_zasedenost_plovilo_id on plovilo_zasedenost(plovilo_id);

-- ═══════════════════════════════════════════════════════════════════
-- POSEBNE VLOGE: is_moderator (lahko izbriše katerokoli objavo/komentar
-- na charter/skipper zidovih, ne samo svoje) in auto_promocija (vsak
-- oglas te osebe je vedno prikazan kot "Promoted", brez plačila).
-- Oboje nastavlja izključno obstoječi admin prek /admin/uporabniki —
-- enak vzorec in enaka zaščita pred samo-podelitvijo kot pri is_admin.
-- ═══════════════════════════════════════════════════════════════════

alter table profiles add column if not exists is_moderator boolean default false;
alter table profiles add column if not exists auto_promocija boolean default false;

-- Razširimo OBSTOJEČI zaščitni trigger (varuje že is_admin/verified), da
-- ščiti tudi ta dva nova stolpca pred samo-podelitvijo prek "Uredi svoj
-- profil" politike (npr. supabase.from('profiles').update({is_moderator:true})
-- iz konzole brskalnika).
create or replace function prevent_self_privilege_escalation()
returns trigger as $$
begin
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    if TG_OP = 'INSERT' then
      new.is_admin := false;
      new.verified := false;
      new.is_moderator := false;
      new.auto_promocija := false;
    else
      new.is_admin := old.is_admin;
      new.verified := old.verified;
      new.is_moderator := old.is_moderator;
      new.auto_promocija := old.auto_promocija;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_self_privilege_escalation on profiles;
create trigger trg_prevent_self_privilege_escalation
before insert or update on profiles
for each row execute function prevent_self_privilege_escalation();

-- Moderator lahko izbriše katerokoli objavo/komentar na katerem koli
-- charter/skipper zidu (obstoječe pravice dovolijo samo lastniku/avtorju
-- brisati SVOJE — to je dodatna, širša pravica poleg njih, ne zamenjava).
drop policy if exists "Moderator brise katerokoli objavo" on objave;
create policy "Moderator brise katerokoli objavo" on objave for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_moderator = true)
);

drop policy if exists "Moderator brise katerikoli komentar" on objava_komentarji;
create policy "Moderator brise katerikoli komentar" on objava_komentarji for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_moderator = true)
);

-- Razširimo OBSTOJEČI prevent_plovilo_self_boost trigger: če ima
-- objavljalec auto_promocija=true, se "promoted" ne resetira na false
-- (kot za vse ostale), ampak se vsili na true — trajna brezplačna
-- promocija za ta račun, ne glede na to, kaj klient pošlje.
create or replace function prevent_plovilo_self_boost()
returns trigger as $$
declare
  ima_auto_promocijo boolean;
begin
  if auth.uid() is not null and not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    select coalesce(auto_promocija, false) into ima_auto_promocijo from profiles where id = auth.uid();
    if TG_OP = 'INSERT' then
      new.promoted := coalesce(ima_auto_promocijo, false);
      new.promoted_do := null;
      new.urgentno := false;
      new.urgentno_do := null;
    else
      new.promoted := case when ima_auto_promocijo then true else old.promoted end;
      new.promoted_do := case when ima_auto_promocijo then null else old.promoted_do end;
      new.urgentno := old.urgentno;
      new.urgentno_do := old.urgentno_do;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_prevent_plovilo_self_boost on plovila;
create trigger trg_prevent_plovilo_self_boost
before insert or update on plovila
for each row execute function prevent_plovilo_self_boost();

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK: kontakt lastnika najemnega plovila (kontakt_email/
-- kontakt_tel) je bil na strani plovila samo SKRIT v UI-ju (glej commit
-- "Hide direct charter contact...") — osnovna tabela "plovila" pa je
-- imela povsem javno bralno politiko (potrjeno = true) BREZ omejitve
-- stolpcev, zato je bil kontakt še vedno berljiv z direktnim klicem na
--   /rest/v1/plovila?select=kontakt_email,kontakt_tel&id=eq...
-- mimo aplikacije, enak razred napake kot pri profiles/public_profiles.
-- Rešitev: osnovno tabelo zapremo za javnost, ozek javni POGLED pa za
-- najemna plovila kontakt polji vrne kot null. Lastnik svojega plovila
-- (dashboard) in admin bereta osnovno tabelo naprej brez sprememb.
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Javni bralni dostop - plovila" on plovila;

create or replace view plovila_javno
with (security_invoker = false)
as select
  id, naziv, opis, cena, letnik, dolzina_m, tip, tip_oglasa, stanje, lokacija,
  case when tip_oglasa = 'najem' then null else kontakt_email end as kontakt_email,
  case when tip_oglasa = 'najem' then null else kontakt_tel end as kontakt_tel,
  slike, model_3d_url, oprema, potrjeno, promoted, promoted_do, prodano,
  cena_na_zahtevo, urgentno, urgentno_do, user_id, created_at, updated_at
from plovila
where potrjeno = true;

grant select on plovila_javno to anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- PROFILNA SLIKA — uporabnik lahko na "Nastavitve profila" naloži svojo
-- sliko. Ni zaupno/privilegirano polje (kot npr. is_admin), zato ne
-- potrebuje zaščitnega triggerja — enak razred kot "opis"/"telefon", ki
-- ju "Uredi svoj profil" politika že dovoljuje urejati. Bucket in RLS
-- so po vzoru "plovila-slike" — vsak nalaga/briše samo v svojo mapo
-- (ime datoteke se začne z njegovim auth.uid()).
-- ═══════════════════════════════════════════════════════════════════

alter table profiles add column if not exists slika_url text;

insert into storage.buckets (id, name, public)
values ('profilne-slike', 'profilne-slike', true)
on conflict (id) do nothing;

drop policy if exists "Javni bralni dostop - profilne slike" on storage.objects;
create policy "Javni bralni dostop - profilne slike" on storage.objects
  for select using (bucket_id = 'profilne-slike');

drop policy if exists "Prijavljeni nalagajo profilno sliko v svojo mapo" on storage.objects;
create policy "Prijavljeni nalagajo profilno sliko v svojo mapo" on storage.objects
  for insert with check (
    bucket_id = 'profilne-slike'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Prijavljeni brisejo svojo profilno sliko" on storage.objects;
create policy "Prijavljeni brisejo svojo profilno sliko" on storage.objects
  for delete using (
    bucket_id = 'profilne-slike'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- "ime" je že v javnem pogledu, slika je enako varna za pokazati vsem
-- (uporablja se lahko npr. pri komentarjih/objavah v prihodnje).
create or replace view public_profiles
with (security_invoker = false)
as select id, ime, vloga, verified, dovoli_tuje_objave, created_at, slika_url from profiles;

grant select on public_profiles to anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- VARNOSTNI POPRAVEK (najden pri pregledu ob delu na skiperjih): enak
-- razred napake kot pri "plovila" — "Javni bralni dostop - charterji"
-- (using(true)) ni omejeval stolpcev, zato je bil pravi kontakt_email in
-- kontakt_tel VSAKEGA charter racuna berljiv mimo aplikacije, kar UI
-- ze dolgo skriva:
--   curl ".../rest/v1/charterji?select=naziv,kontakt_email,kontakt_tel"
-- Resitev: enak vzorec kot plovila_javno — ozek javni pogled brez kontakt
-- polj, osnovno tabelo pa omejimo na lastnika + admina (ki ju uredita/
-- vidita naprej prek obstojecih "Uredi svoj.../Vstavi..." politik).
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Javni bralni dostop - charterji" on charterji;

drop policy if exists "Lastnik bere svoj charter profil" on charterji;
create policy "Lastnik bere svoj charter profil" on charterji for select using (auth.uid() = user_id);

drop policy if exists "Admin bere vse charterje" on charterji;
create policy "Admin bere vse charterje" on charterji for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create or replace view charterji_javno
with (security_invoker = false)
as select
  id, user_id, naziv, opis, tip, lokacija, spletna_stran, ocena, st_ocen,
  st_plovil, max_oseb, max_dolzina_m, tip_plovila, verified, created_at
from charterji;

grant select on charterji_javno to anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- POPRAVEK: admin v /admin/plovila klice supabase.from('plovila').delete(),
-- a nikoli ni obstajala politika, ki bi to dovolila komurkoli razen
-- lastniku samemu (glej "Lastnik brise svoje plovilo" zgoraj) — za
-- novice/bannerje/zemljevid je admin-delete politika obstajala, za
-- plovila pa je bila spregledana. Gumb "Zavrni" je zato RLS tiho
-- zavrnil (0 vrstic izbrisanih, brez napake).
-- ═══════════════════════════════════════════════════════════════════

drop policy if exists "Admin brise plovila" on plovila;
create policy "Admin brise plovila" on plovila for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ═══════════════════════════════════════════════════════════════════
-- SLIKE PRI OBJAVAH NA ZIDU (Feed) — npr. skipper ali charter deli slike
-- s poti s svojo stranko. Ni zaupno/privilegirano polje (kot "vsebina"/
-- "lokacija", ki ju avtor objave ze prosto ureja), zato ne potrebuje
-- zascitnega triggerja. Bucket in RLS po vzoru "plovila-slike" — vsak
-- nalaga/brise samo v svojo mapo.
-- ═══════════════════════════════════════════════════════════════════

alter table objave add column if not exists slike text[] default '{}';

insert into storage.buckets (id, name, public)
values ('objave-slike', 'objave-slike', true)
on conflict (id) do nothing;

drop policy if exists "Javni bralni dostop - slike objav" on storage.objects;
create policy "Javni bralni dostop - slike objav" on storage.objects
  for select using (bucket_id = 'objave-slike');

drop policy if exists "Prijavljeni nalagajo slike objav v svojo mapo" on storage.objects;
create policy "Prijavljeni nalagajo slike objav v svojo mapo" on storage.objects
  for insert with check (
    bucket_id = 'objave-slike'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Prijavljeni brisejo svoje slike objav" on storage.objects;
create policy "Prijavljeni brisejo svoje slike objav" on storage.objects
  for delete using (
    bucket_id = 'objave-slike'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
