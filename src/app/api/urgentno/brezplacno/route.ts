import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { URGENTNO_DNI } from '@/lib/stripe'

// Admin lahko svoj lastni oglas označi kot urgenten brez plačila prek
// Stripe — enako kot je "auto_promocija" brezplačna pot za promocijo.
// Varnostno: is_admin preverimo iz baze (ne iz seje/klienta), lastništvo
// plovila pa iz prave "plovila" tabele (RLS dovoli lastniku brati svojo
// vrstico) — service-role client uporabimo šele za sam zapis, potem ko
// sta obe preverjanji uspešni.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Prijava zahtevana.' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profil?.is_admin) return NextResponse.json({ error: 'Samo administrator lahko to naredi brezplačno.' }, { status: 403 })

  const { plovilo_id } = await req.json() as { plovilo_id: string }
  if (!plovilo_id) return NextResponse.json({ error: 'Manjka plovilo_id.' }, { status: 400 })

  const { data: plovilo } = await supabase.from('plovila').select('id, user_id, urgentno').eq('id', plovilo_id).maybeSingle()
  if (!plovilo) return NextResponse.json({ error: 'Oglas ne obstaja.' }, { status: 404 })
  if (plovilo.user_id !== user.id) return NextResponse.json({ error: 'To ni vaš oglas.' }, { status: 403 })
  if (plovilo.urgentno) return NextResponse.json({ error: 'Oglas je že označen kot urgenten.' }, { status: 400 })

  const urgentnoDo = new Date()
  urgentnoDo.setDate(urgentnoDo.getDate() + URGENTNO_DNI)

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('plovila')
    .update({ urgentno: true, urgentno_do: urgentnoDo.toISOString() })
    .eq('id', plovilo_id)
  if (error) return NextResponse.json({ error: 'Napaka pri označevanju oglasa.' }, { status: 500 })

  return NextResponse.json({ success: true, urgentno_do: urgentnoDo.toISOString() })
}
