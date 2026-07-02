'use server'

import { createClient } from '@/lib/supabase/server'

export type PovprasevanjeInput = {
  tip: 'charter' | 'skipper' | 'plovilo'
  target_id: string
  ime: string
  email: string
  telefon: string
  termin: string
  sporocilo: string
}

export async function oddajPovprasevanje(data: PovprasevanjeInput): Promise<{ uspeh: boolean; napaka?: string }> {
  const supabase = await createClient()

  const insertData: {
    tip: 'charter' | 'skipper' | 'plovilo'
    target_id: string
    ime: string
    email: string
    telefon: string | null
    termin: string | null
    sporocilo: string
  } = {
    tip: data.tip,
    target_id: data.target_id,
    ime: data.ime,
    email: data.email,
    telefon: data.telefon || null,
    termin: data.termin || null,
    sporocilo: data.sporocilo,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('povprasevanja').insert(insertData)

  if (error) {
    console.error('Supabase insert error:', error)
    return { uspeh: false, napaka: 'Napaka pri shranjevanju. Prosimo, poskusite znova.' }
  }

  const resendKey = process.env.RESEND_API_KEY
  const obvestiloEmail = process.env.OBVESTILO_EMAIL ?? 'matej.skulj10@gmail.com'

  if (resendKey) {
    const tipLabel = data.tip === 'charter' ? 'Charter' : data.tip === 'skipper' ? 'Skipper' : 'Plovilo'
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Garbin <noreply@garbin.si>',
        to: obvestiloEmail,
        subject: `Novo povpraševanje — ${tipLabel}`,
        html: `
          <h2 style="color:#0c2340;">Novo povpraševanje na Garbin</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
            <tr><td style="padding:8px;color:#666;">Ime:</td><td style="padding:8px;font-weight:600;">${data.ime}</td></tr>
            <tr><td style="padding:8px;color:#666;">E-mail:</td><td style="padding:8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:8px;color:#666;">Telefon:</td><td style="padding:8px;">${data.telefon || '—'}</td></tr>
            <tr><td style="padding:8px;color:#666;">Termin:</td><td style="padding:8px;">${data.termin || '—'}</td></tr>
            <tr><td style="padding:8px;color:#666;">Sporočilo:</td><td style="padding:8px;">${data.sporocilo}</td></tr>
            <tr><td style="padding:8px;color:#666;">Tip / ID:</td><td style="padding:8px;">${tipLabel} / ${data.target_id}</td></tr>
          </table>
        `,
      }),
    }).catch(err => console.error('Email send error:', err))
  }

  return { uspeh: true }
}
