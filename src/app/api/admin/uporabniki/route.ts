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

  const { data: profili } = await adminClient.from('profiles').select('id, is_admin')
  const adminMap = new Map((profili ?? []).map(p => [p.id, p.is_admin]))

  const uporabniki = data.users.map((u) => ({
    id: u.id,
    ime: (u.user_metadata?.ime as string | undefined) ?? u.email ?? 'Uporabnik',
    email: u.email ?? '',
    vloga: (u.user_metadata?.vloga as string | undefined) ?? 'prodajalec',
    created: u.created_at,
    aktiven: !u.banned_until || new Date(u.banned_until) < new Date(),
    isAdmin: adminMap.get(u.id) ?? false,
  }))

  return NextResponse.json({ data: uporabniki })
}

export async function PATCH(req: NextRequest) {
  const { ok } = await jeAdmin()
  if (!ok) return NextResponse.json({ error: 'Nisi admin' }, { status: 403 })

  const { userId, vloga, aktiven, isAdmin } = await req.json() as { userId: string; vloga?: string; aktiven?: boolean; isAdmin?: boolean }
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

  return NextResponse.json({ ok: true })
}
