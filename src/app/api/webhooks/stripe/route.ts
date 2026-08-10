import { NextRequest, NextResponse } from 'next/server'
import { createStripeClient, PROMOCIJA_DNI } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET manjka' }, { status: 503 })
  }

  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Manjka stripe-signature' }, { status: 400 })

  const stripe = createStripeClient()
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: `Neveljaven podpis: ${err instanceof Error ? err.message : 'napaka'}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const plovilo_id = session.metadata?.plovilo_id
    if (plovilo_id) {
      const adminClient = createAdminClient()

      const promotedDo = new Date()
      promotedDo.setDate(promotedDo.getDate() + PROMOCIJA_DNI)

      await adminClient.from('plovila').update({
        promoted: true,
        promoted_do: promotedDo.toISOString(),
      }).eq('id', plovilo_id)

      await adminClient.from('promocija_narocila').update({
        status: 'placano',
        placano_at: new Date().toISOString(),
      }).eq('stripe_session_id', session.id)
    }
  }

  return NextResponse.json({ received: true })
}
