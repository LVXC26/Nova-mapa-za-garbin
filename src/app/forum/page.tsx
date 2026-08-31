import { notFound } from 'next/navigation'

// Forum je zacasno skrit (tudi za neposreden naslov) — vsebina je bila
// izmisljen mock (glej src/data/forum.ts), ne prava Supabase baza, in bi
// obiskovalcem prikazovala neresnicno "aktivno skupnost". Prejsnja verzija
// strani je v git zgodovini, ce se kasneje forum naredi zares.
export default function ForumPage() {
  notFound()
}
