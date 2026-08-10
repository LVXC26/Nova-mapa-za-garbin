import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createStripeClient, PROMOCIJA_CENA_EUR, PROMOCIJA_DNI } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Za promocijo oglasa se morate prijaviti.' }, { status: 401 })

  const { plovilo_id } = await req.json() as { plovilo_id: string }
  if (!plovilo_id) return NextResponse.json({ error: 'Manjka plovilo_id.' }, { status: 400 })

  const { data: plovilo } = await supabase.from('plovila').select('*').eq('id', plovilo_id).maybeSingle()
  if (!plovilo) return NextResponse.json({ error: 'Oglas ne obstaja.' }, { status: 404 })
  if (plovilo.user_id !== user.id) return NextResponse.json({ error: 'To ni vaš oglas.' }, { status: 403 })

  let stripe
  try {
    stripe = createStripeClient()
  } catch {
    return NextResponse.json({ error: 'Plačila trenutno niso na voljo — manjka konfiguracija Stripe.' }, { status: 503 })
  }

  const origin = req.nextUrl.origin
  const zneskCent = PROMOCIJA_CENA_EUR * 100

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: zneskCent,
        product_data: {
          name: `Promocija oglasa — ${plovilo.naziv}`,
          description: `${PROMOCIJA_DNI} dni prednostnega prikaza na Garbin`,
        },
      },
      quantity: 1,
    }],
    metadata: { plovilo_id, user_id: user.id },
    success_url: `${origin}/dashboard/moja-plovila?promocija=uspesno`,
    cancel_url: `${origin}/dashboard/moja-plovila?promocija=preklicano`,
  })

  const { error: dbError } = await supabase.from('promocija_narocila').insert({
    plovilo_id,
    user_id: user.id,
    stripe_session_id: session.id,
    znesek_cent: zneskCent,
    valuta: 'eur',
    dni_promocije: PROMOCIJA_DNI,
    status: 'pending',
    placano_at: null,
  })
  if (dbError) return NextResponse.json({ error: 'Napaka pri ustvarjanju naročila.' }, { status: 500 })

  return NextResponse.json({ url: session.url })
}
