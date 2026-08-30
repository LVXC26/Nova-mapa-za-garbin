import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

// Admin je svoj oglas lahko brezplačno označil kot urgenten (glej
// /api/urgentno/brezplacno), ni pa imel poti nazaj — "Nujno" značka bi
// ostala do izteka 30 dni. Ta pot mu (samo admin, samo lastno plovilo)
// dovoli urgentno stanje takoj izklopiti.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Prijava zahtevana.' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profil?.is_admin) return NextResponse.json({ error: 'Samo administrator lahko to naredi.' }, { status: 403 })

  const { plovilo_id } = await req.json() as { plovilo_id: string }
  if (!plovilo_id) return NextResponse.json({ error: 'Manjka plovilo_id.' }, { status: 400 })

  const { data: plovilo } = await supabase.from('plovila').select('id, user_id, urgentno').eq('id', plovilo_id).maybeSingle()
  if (!plovilo) return NextResponse.json({ error: 'Oglas ne obstaja.' }, { status: 404 })
  if (plovilo.user_id !== user.id) return NextResponse.json({ error: 'To ni vaš oglas.' }, { status: 403 })
  if (!plovilo.urgentno) return NextResponse.json({ error: 'Oglas ni označen kot urgenten.' }, { status: 400 })

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('plovila')
    .update({ urgentno: false, urgentno_do: null })
    .eq('id', plovilo_id)
  if (error) return NextResponse.json({ error: 'Napaka pri odstranjevanju oznake.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
