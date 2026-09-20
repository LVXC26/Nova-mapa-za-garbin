import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

async function jeAdmin(): Promise<{ ok: boolean; userId?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return { ok: !!data?.is_admin, userId: user.id }
}

export async function GET() {
  const { ok } = await jeAdmin()
  if (!ok) return NextResponse.json({ error: 'Nisi admin' }, { status: 403 })

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: profili } = await adminClient.from('profiles').select('id, is_admin, is_moderator, auto_promocija')
  const profilMap = new Map((profili ?? []).map(p => [p.id, p]))

  const uporabniki = data.users.map((u) => ({
    id: u.id,
    ime: (u.user_metadata?.ime as string | undefined) ?? u.email ?? 'Uporabnik',
    email: u.email ?? '',
    vloga: (u.user_metadata?.vloga as string | undefined) ?? 'prodajalec',
    created: u.created_at,
    aktiven: !u.banned_until || new Date(u.banned_until) < new Date(),
    isAdmin: profilMap.get(u.id)?.is_admin ?? false,
    isModerator: profilMap.get(u.id)?.is_moderator ?? false,
    autoPromocija: profilMap.get(u.id)?.auto_promocija ?? false,
  }))

  return NextResponse.json({ data: uporabniki })
}

export async function PATCH(req: NextRequest) {
  const { ok } = await jeAdmin()
  if (!ok) return NextResponse.json({ error: 'Nisi admin' }, { status: 403 })

  const { userId, vloga, aktiven, isAdmin, isModerator, autoPromocija } = await req.json() as {
    userId: string; vloga?: string; aktiven?: boolean; isAdmin?: boolean; isModerator?: boolean; autoPromocija?: boolean
  }
  if (!userId) return NextResponse.json({ error: 'Manjka userId' }, { status: 400 })

  const adminClient = createAdminClient()

  if (vloga || aktiven !== undefined) {
    const { data: obstojeci } = await adminClient.auth.admin.getUserById(userId)
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      ...(vloga ? { user_metadata: { ...obstojeci?.user?.user_metadata, vloga } } : {}),
      ...(aktiven !== undefined ? { ban_duration: aktiven ? 'none' : '876000h' } : {}),
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (isAdmin !== undefined) {
    const { error } = await adminClient.from('profiles').update({ is_admin: isAdmin }).eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (isModerator !== undefined) {
    const { error } = await adminClient.from('profiles').update({ is_moderator: isModerator }).eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (autoPromocija !== undefined) {
    const { error } = await adminClient.from('profiles').update({ auto_promocija: autoPromocija }).eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    // Takoj uveljavimo tudi za oglase, ki jih je ta oseba že objavila prej —
    // brez tega bi "vedno promoviran" veljalo samo za bodoče, ne za obstoječe.
    if (autoPromocija) {
      await adminClient.from('plovila').update({ promoted: true, promoted_do: null }).eq('user_id', userId)
    }
  }

  return NextResponse.json({ ok: true })
}

// Popolna izbrisa racuna - namensko LOCENO od brisanja charter/skipper
// profila (glej admin/charterji, admin/skiperji): tam brisanje NE sme vec
// tiho pobrisati tudi plovil/objav (glej incident - "0 plovil" prikazano
// polje st_plovil je bilo zastarelo, dejansko izbrisanih je bilo vec pravih
// oglasov). Tukaj, na strani "Uporabniki", pa je "izbrisi vse" ravno
// namen akcije, zato admin to eksplicitno zahteva z locenim gumbom in
// potrditvijo, ki jasno pove kaj vse bo izbrisano.
export async function DELETE(req: NextRequest) {
  const { ok } = await jeAdmin()
  if (!ok) return NextResponse.json({ error: 'Nisi admin' }, { status: 403 })

  const { userId } = await req.json() as { userId: string }
  if (!userId) return NextResponse.json({ error: 'Manjka userId' }, { status: 400 })

  const adminClient = createAdminClient()

  // plovila.user_id in rezervni_deli.user_id imata "on delete set null", ne
  // "cascade" - ce bi samo izbrisali auth uporabnika, bi ti oglasi ostali
  // (osiroteli, brez lastnika), namesto da izginejo. Zato ju izrecno
  // izbrisemo tukaj, pred brisanjem racuna.
  await adminClient.from('plovila').delete().eq('user_id', userId)
  await adminClient.from('rezervni_deli').delete().eq('user_id', userId)

  // Vse ostalo (profiles, charterji, skiperji, objave, messages, ratings,
  // komentarji ...) ima "on delete cascade" na auth.users, zato se izbrise
  // samodejno ob brisanju uporabnika spodaj.
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
