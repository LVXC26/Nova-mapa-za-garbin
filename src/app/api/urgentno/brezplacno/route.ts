import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { URGENTNO_DNI } from '@/lib/stripe'

// Dve brezplačni poti do "Nujno" značke:
//  1) Admin — vedno brezplačno, vsak klic mu da svež 30-dnevni rok.
//  2) Navaden lastnik, ki je urgentno že PLAČAL in ga je nato sam izklopil
//     (glej /api/urgentno/odstrani, ki ob izklopu NAMENOMA ohrani
//     urgentno_do) — dokler ta star datum poteka še ni mimo, lahko značko
//     brezplačno vklopi nazaj, ker za to obdobje je že plačal. Rok se v tem
//     primeru NE podaljša — ostane isti, kot je bil ob plačilu.
// Vse ostalo (nikoli plačano, ali rok že potekel) gre naprej prek
// /api/urgentno/checkout (pravo Stripe plačilo).
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Prijava zahtevana.' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  const jeAdmin = profil?.is_admin ?? false

  const { plovilo_id } = await req.json() as { plovilo_id: string }
  if (!plovilo_id) return NextResponse.json({ error: 'Manjka plovilo_id.' }, { status: 400 })

  const { data: plovilo } = await supabase.from('plovila').select('id, user_id, urgentno, urgentno_do').eq('id', plovilo_id).maybeSingle()
  if (!plovilo) return NextResponse.json({ error: 'Oglas ne obstaja.' }, { status: 404 })
  if (plovilo.user_id !== user.id) return NextResponse.json({ error: 'To ni vaš oglas.' }, { status: 403 })
  if (plovilo.urgentno) return NextResponse.json({ error: 'Oglas je že označen kot urgenten.' }, { status: 400 })

  let urgentnoDo: string

  if (jeAdmin) {
    const datum = new Date()
    datum.setDate(datum.getDate() + URGENTNO_DNI)
    urgentnoDo = datum.toISOString()
  } else {
    const seStejeRok = plovilo.urgentno_do && new Date(plovilo.urgentno_do).getTime() > Date.now()
    if (!seStejeRok) {
      return NextResponse.json({ error: 'Za urgentno oznako je potrebno plačilo — glejte gumb za plačilo.' }, { status: 403 })
    }
    urgentnoDo = plovilo.urgentno_do as string
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('plovila')
    .update({ urgentno: true, urgentno_do: urgentnoDo })
    .eq('id', plovilo_id)
  if (error) return NextResponse.json({ error: 'Napaka pri označevanju oglasa.' }, { status: 500 })

  return NextResponse.json({ success: true, urgentno_do: urgentnoDo })
}
