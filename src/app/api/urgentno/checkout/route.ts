import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createStripeClient, URGENTNO_CENA_EUR, URGENTNO_DNI } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Za urgentno prodajo se morate prijaviti.' }, { status: 401 })

  const { plovilo_id } = await req.json() as { plovilo_id: string }
  if (!plovilo_id) return NextResponse.json({ error: 'Manjka plovilo_id.' }, { status: 400 })

  const { data: plovilo } = await supabase.from('plovila').select('*').eq('id', plovilo_id).maybeSingle()
  if (!plovilo) return NextResponse.json({ error: 'Oglas ne obstaja.' }, { status: 404 })
  if (plovilo.user_id !== user.id) return NextResponse.json({ error: 'To ni vaš oglas.' }, { status: 403 })
  if (plovilo.urgentno) return NextResponse.json({ error: 'Oglas je že označen kot urgenten.' }, { status: 400 })

  // Prepreči podvojeno plačilo (dvojni klik, dva odprta zavihka ...) — če je
  // nedokončano naročilo za ta oglas nastalo pred manj kot 30 minutami, ne
  // odpiraj še ene Stripe seje.
  const pred30min = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data: obstojece } = await supabase
    .from('promocija_narocila')
    .select('id')
    .eq('plovilo_id', plovilo_id)
    .eq('tip', 'urgentno')
    .eq('status', 'pending')
    .gte('created_at', pred30min)
    .limit(1)
    .maybeSingle()
  if (obstojece) {
    return NextResponse.json({ error: 'Plačilo za ta oglas je že v teku. Počakajte nekaj minut ali poskusite znova.' }, { status: 409 })
  }

  let stripe
  try {
    stripe = createStripeClient()
  } catch {
    return NextResponse.json({ error: 'Plačila trenutno niso na voljo — manjka konfiguracija Stripe.' }, { status: 503 })
  }

  const origin = req.nextUrl.origin
  const zneskCent = URGENTNO_CENA_EUR * 100

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: zneskCent,
        product_data: {
          name: `Urgentna prodaja — ${plovilo.naziv}`,
          description: `${URGENTNO_DNI} dni rdečega "Nujno" badgea in prioritete v prikazu na Garbin`,
        },
      },
      quantity: 1,
    }],
    metadata: { plovilo_id, user_id: user.id, tip: 'urgentno' },
    success_url: `${origin}/dashboard/moja-plovila?urgentno=uspesno`,
    cancel_url: `${origin}/dashboard/moja-plovila?urgentno=preklicano`,
  })

  const { error: dbError } = await supabase.from('promocija_narocila').insert({
    plovilo_id,
    user_id: user.id,
    tip: 'urgentno',
    stripe_session_id: session.id,
    znesek_cent: zneskCent,
    valuta: 'eur',
    dni_promocije: URGENTNO_DNI,
    status: 'pending',
    placano_at: null,
  })
  if (dbError) return NextResponse.json({ error: 'Napaka pri ustvarjanju naročila.' }, { status: 500 })

  return NextResponse.json({ url: session.url })
}
