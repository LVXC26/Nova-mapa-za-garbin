import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import type { CharterNarocnina } from '@/types/database'

async function jeAdmin(): Promise<{ ok: boolean; userId?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const profil = data as { is_admin: boolean } | null
  return { ok: !!profil?.is_admin, userId: user.id }
}

export async function POST(req: NextRequest) {
  const { ok, userId } = await jeAdmin()
  if (!ok || !userId) return NextResponse.json({ error: ok === false ? 'Nisi admin' : 'Ni prijave' }, { status: ok === false ? 403 : 401 })

  const { charter_id, meseci, opomba } = await req.json() as { charter_id: string; meseci: number; opomba?: string }
  if (!charter_id || !meseci) return NextResponse.json({ error: 'Manjkajo parametri' }, { status: 400 })

  const adminClient = createAdminClient()
  const zdaj = new Date()
  const konec = new Date(zdaj)
  konec.setMonth(konec.getMonth() + meseci)

  const vnos: Omit<CharterNarocnina, 'id' | 'created_at'> = {
    charter_id,
    plan: 'trial',
    trial_zacetek: zdaj.toISOString(),
    trial_konec: konec.toISOString(),
    brezplacni_meseci: meseci,
    podelil_admin_id: userId,
    opomba: opomba || null,
    updated_at: zdaj.toISOString(),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (adminClient as any)
    .from('charter_narocnine')
    .upsert(vnos, { onConflict: 'charter_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}

export async function GET() {
  const { ok } = await jeAdmin()
  if (!ok) return NextResponse.json({ error: 'Nisi admin' }, { status: 403 })

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('charter_narocnine')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
  return NextResponse.json({ data })
}
